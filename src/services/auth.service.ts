import { api, publicApi, unwrap } from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from '@/schemas/auth.schema';
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

  async forgotPassword(input: ForgotPasswordInput): Promise<string> {
    return unwrap(publicApi.post<ApiResp<string>>(API_ROUTES.auth.forgotPassword, input));
  },

  async verifyOtp(input: VerifyOtpInput): Promise<string> {
    return unwrap(publicApi.post<ApiResp<string>>(API_ROUTES.auth.verifyOtp, input));
  },

  async resetPassword(input: ResetPasswordInput): Promise<string> {
    return unwrap(publicApi.post<ApiResp<string>>(API_ROUTES.auth.resetPassword, input));
  },
};

export type AuthService = typeof authService;
