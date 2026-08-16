import { useAuthStore } from '@/stores/auth.store';
import type { ApiResp } from '@/types';
import type { AuthResponse } from '@/types/auth';
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_ROUTES } from './constants';
import { decodeJwtUser } from './jwt';

/** Custom config flag để tránh loop refresh */
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuth?: boolean;
}

/**
 * Public axios — KHÔNG kèm Authorization header.
 * Dùng cho: login, register, refresh.
 */
export const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // bắt buộc để gửi/nhận HttpOnly cookie
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Private axios — tự gắn Bearer token, tự refresh khi 401.
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─────────────────────────────────────────────────
// Request interceptor: gắn access token từ memory
// ─────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const cfg = config as RetryConfig;
  if (cfg._skipAuth) return cfg;

  const token = useAuthStore.getState().accessToken;
  if (token) {
    cfg.headers.set('Authorization', `Bearer ${token}`);
  }
  return cfg;
});

// ─────────────────────────────────────────────────
// Response interceptor: refresh token khi 401
// ─────────────────────────────────────────────────

/** Tránh nhiều request đồng thời cùng gọi /refresh */
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  try {
    const { data } = await publicApi.post<ApiResp<AuthResponse>>(
      API_ROUTES.auth.refresh,
      {} // refresh_token đã nằm trong HttpOnly cookie
    );
    const newToken = data?.data?.accessToken ?? null;
    const jwtUser = newToken ? decodeJwtUser(newToken) : null;
    useAuthStore.getState().setAuth({ user: jwtUser, accessToken: newToken });
    return newToken;
  } catch {
    useAuthStore.getState().clear();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const isAuthEndpoint =
      originalRequest.url?.includes(API_ROUTES.auth.refresh) ||
      originalRequest.url?.includes(API_ROUTES.auth.login) ||
      originalRequest.url?.includes(API_ROUTES.auth.register);

    // Chỉ refresh khi: 401 + chưa retry + không phải endpoint auth
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      // Dùng singleton promise để gom refresh
      refreshPromise = refreshPromise ?? performRefresh();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

/** Helper rút data từ ApiResp<T> */
export async function unwrap<T>(req: Promise<{ data: ApiResp<T> }>): Promise<T> {
  const res = await req;
  return res.data.data;
}

/** Type guard cho lỗi axios */
export function isAxiosError(err: unknown): err is AxiosError {
  return axios.isAxiosError(err);
}

/** Extract message từ Spring Boot error response */
export function getApiErrorMessage(err: unknown, fallback = 'Đã có lỗi xảy ra'): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export type { AxiosRequestConfig };
