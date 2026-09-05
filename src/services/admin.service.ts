import { api, unwrap } from '@/lib/axios';
import type { ApiResp, PageResp } from '@/types';

export interface UserAdminResp {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  enabled: boolean;
  createdAt: string;
  roles: string[];
}

export const adminService = {
  async getAllUsers(page: number = 0, size: number = 20): Promise<PageResp<UserAdminResp>> {
    return unwrap(
      api.get<ApiResp<PageResp<UserAdminResp>>>('/api/admin/users', {
        params: { page, size },
      })
    );
  },

  async adminChangePassword(userId: string, newPassword: string): Promise<string> {
    return unwrap(
      api.put<ApiResp<string>>(`/api/admin/users/${userId}/password`, { newPassword })
    );
  },

  async adminToggleUserStatus(userId: string): Promise<string> {
    return unwrap(
      api.put<ApiResp<string>>(`/api/admin/users/${userId}/toggle-status`)
    );
  },

  async adminCreateUser(data: any): Promise<any> {
    return unwrap(
      api.post<ApiResp<any>>('/api/admin/users', data)
    );
  },
};
