import { api } from '@/lib/axios';
import type {
  SpringPage,
  StaffCustomerSearchParams,
  StaffCustomerSummary,
} from '@/types/staff-customer';

interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

export const staffCustomerApi = {
  async search(params: StaffCustomerSearchParams): Promise<SpringPage<StaffCustomerSummary>> {
    const response = await api.get<ApiResponse<SpringPage<StaffCustomerSummary>>>(
      '/api/clinic/staff/customers',
      {
        params: {
          keyword: params.keyword.trim(),
          filter: params.filter,
          page: params.page,
          size: params.size,
        },
      }
    );

    return response.data.data;
  },
};
