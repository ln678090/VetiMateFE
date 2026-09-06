import { api, unwrap } from '@/lib/axios';

import type { UpdateProfileInput } from '@/schemas/user.schema';
import type { ApiResp } from '@/types';

export const userService = {
  async updateProfile(input: UpdateProfileInput): Promise<string> {
    return unwrap(api.put<ApiResp<string>>('/api/users/me/profile', input));
  },

  async getMyProfile(): Promise<{
    id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
  }> {
    return unwrap(
      api.get<
        ApiResp<{ id: string; fullName: string; username: string; email: string; phone: string }>
      >('/api/users/me')
    );
  },

  async checkFavorite(productId: string): Promise<boolean> {
    return unwrap(api.get<ApiResp<boolean>>(`/api/users/me/favorites/check/${productId}`));
  },

  async toggleFavorite(productId: string): Promise<string> {
    return unwrap(api.post<ApiResp<string>>(`/api/users/me/favorites/${productId}`));
  },

  async recordView(productId: string): Promise<string> {
    return unwrap(api.post<ApiResp<string>>(`/api/users/me/viewed/${productId}`));
  },

  async getFavorites(
    page: number = 0,
    size: number = 12,
    startDate?: string,
    endDate?: string
  ): Promise<unknown> {
    const params: Record<string, string | number> = { page, size };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return unwrap(api.get('/api/users/me/favorites', { params }));
  },

  async getRecentlyViewed(
    page: number = 0,
    size: number = 12,
    startDate?: string,
    endDate?: string
  ): Promise<unknown> {
    const params: Record<string, string | number> = { page, size };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return unwrap(api.get('/api/users/me/viewed', { params }));
  },
};

export type UserService = typeof userService;
