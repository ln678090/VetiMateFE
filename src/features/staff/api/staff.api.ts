import { api, unwrap } from '@/lib/axios';
import type {
  CreateStaffRequest,
  SpringPage,
  StaffFilters,
  StaffResponse,
  UpdateStaffRequest,
} from '@/types/staff';

const BASE_URL = '/api/staff';

export const staffApi = {
  search(filters: StaffFilters): Promise<SpringPage<StaffResponse>> {
    return unwrap<SpringPage<StaffResponse>>(
      api.get(BASE_URL, {
        params: {
          keyword: filters.keyword || undefined,
          roleType: filters.roleType || undefined,
          active: filters.active,
          page: filters.page,
          size: filters.size,
          sort: 'fullName,asc',
        },
      })
    );
  },
  getById(staffId: string): Promise<StaffResponse> {
    return unwrap<StaffResponse>(api.get(`${BASE_URL}/${staffId}`));
  },

  create(request: CreateStaffRequest): Promise<StaffResponse> {
    return unwrap<StaffResponse>(api.post(BASE_URL, request));
  },

  update(staffId: string, request: UpdateStaffRequest): Promise<StaffResponse> {
    return unwrap<StaffResponse>(api.put(`${BASE_URL}/${staffId}`, request));
  },

  deactivate(staffId: string): Promise<void> {
    return unwrap<void>(api.delete(`${BASE_URL}/${staffId}`));
  },
};
