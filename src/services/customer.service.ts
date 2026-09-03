import { api, unwrap } from '@/lib/axios';
import type { CustomerDto, SpringPage } from '@/types/clinic';
import { ApiResp } from '@/types/api';

export interface CustomerFormValues {
  fullName: string;
  phone: string;
}

export const customerService = {
  search: async (keyword = '', page = 0, size = 20): Promise<SpringPage<CustomerDto>> => {
    const req = api.get<ApiResp<SpringPage<CustomerDto>>>('/api/clinic/customers', {
      params: { keyword: keyword || undefined, page, size },
    });
    return unwrap(req);
  },

  getById: async (id: string): Promise<CustomerDto> => {
    const req = api.get<ApiResp<CustomerDto>>(`/api/clinic/customers/${id}`);
    return unwrap(req);
  },

  create: async (data: CustomerFormValues): Promise<CustomerDto> => {
    const req = api.post<ApiResp<CustomerDto>>('/api/clinic/customers', data);
    return unwrap(req);
  },

  update: async (id: string, data: CustomerFormValues): Promise<CustomerDto> => {
    const req = api.put<ApiResp<CustomerDto>>(`/api/clinic/customers/${id}`, data);
    return unwrap(req);
  },
};
