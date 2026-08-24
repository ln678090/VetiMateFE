import { api, publicApi, unwrap } from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { LoginInput, RegisterInput, ChangePasswordInput } from '@/schemas/auth.schema';
import type { ApiResp } from '@/types';
import type { AuthResponse } from '@/types/auth';

/**
 * Auth Service — tập trung mọi call liên quan đến /api/auth.
 * Tất cả return data đã unwrap khỏi ApiResp<T>.
 */
export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    return unwrap(publicApi.post<ApiResp<AuthResponse>>(API_ROUTES.auth.login, input));
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    return unwrap(publicApi.post<ApiResp<AuthResponse>>(API_ROUTES.auth.register, input));
  },

  /** Web: refresh_token được gửi tự động qua HttpOnly cookie */
  async refresh(): Promise<AuthResponse> {
    return unwrap(publicApi.post<ApiResp<AuthResponse>>(API_ROUTES.auth.refresh, {}));
  },

  async logout(): Promise<void> {
    // body rỗng — backend đọc refresh_token từ cookie
    await api.post(API_ROUTES.auth.logout, {});
  },

  async changePassword(input: ChangePasswordInput): Promise<string> {
    return unwrap(api.put<ApiResp<string>>(API_ROUTES.auth.changePassword, input));
  },
};

export type AuthService = typeof authService;
