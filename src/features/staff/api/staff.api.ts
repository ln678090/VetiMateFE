import { api, unwrap } from '@/lib/axios';
import type {
  CreateStaffRequest,
  DeactivateStaffRequest,
  EligibleUserFilters,
  EligibleUserResponse,
  SpringPage,
  StaffFilters,
  StaffResponse,
  UpdateStaffRequest,
} from '@/types/staff';

const STAFF_BASE_URL = '/api/staff';

export const staffApi = {
  search(filters: StaffFilters): Promise<SpringPage<StaffResponse>> {
    return unwrap<SpringPage<StaffResponse>>(
      api.get(STAFF_BASE_URL, {
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
  searchEligibleUsers(filters: EligibleUserFilters): Promise<SpringPage<EligibleUserResponse>> {
    return unwrap<SpringPage<EligibleUserResponse>>(
      api.get(`${STAFF_BASE_URL}/eligible-users`, {
        params: {
          keyword: filters.keyword || undefined,
          page: filters.page,
          size: filters.size,
          sort: 'fullName,asc',
        },
      })
    );
  },

  getById(staffId: string): Promise<StaffResponse> {
    return unwrap<StaffResponse>(api.get(`${STAFF_BASE_URL}/${staffId}`));
  },

  create(request: CreateStaffRequest): Promise<StaffResponse> {
    return unwrap<StaffResponse>(api.post(STAFF_BASE_URL, request));
  },

  update(staffId: string, request: UpdateStaffRequest): Promise<StaffResponse> {
    return unwrap<StaffResponse>(api.put(`${STAFF_BASE_URL}/${staffId}`, request));
  },

  deactivate(staffId: string, request: DeactivateStaffRequest): Promise<StaffResponse> {
    return unwrap<StaffResponse>(api.post(`${STAFF_BASE_URL}/${staffId}/deactivate`, request));
  },
};
