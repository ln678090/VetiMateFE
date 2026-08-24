import { api, unwrap } from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { UpdateProfileInput } from '@/schemas/user.schema';
import type { ApiResp } from '@/types';

export const userService = {
  async updateProfile(input: UpdateProfileInput): Promise<string> {
    return unwrap(api.put<ApiResp<string>>('/api/users/me/profile', input));
  },
  
  async getMyProfile(): Promise<{ id: string, fullName: string, username: string, email: string, phone: string }> {
    return unwrap(api.get<ApiResp<{ id: string, fullName: string, username: string, email: string, phone: string }>>('/api/users/me'));
  },
};

export type UserService = typeof userService;
