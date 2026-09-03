import { api, unwrap } from '@/lib/axios';
import type { AppointmentDto, SpringPage } from '@/types/clinic';
import { ApiResp } from '@/types/api';

export const appointmentService = {
  getByCustomer: async (customerId: string, page = 0, size = 20): Promise<SpringPage<AppointmentDto>> => {
    const req = api.get<ApiResp<SpringPage<AppointmentDto>>>('/api/clinic/appointments', {
      params: { customerId, page, size },
    });
    return unwrap(req);
  },
};
