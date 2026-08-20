import { api, unwrap } from '@/lib/axios';

import type { SpringPage } from '@/types/clinic';

import type {
  ClinicService,
  ClinicServiceFilters,
  ClinicServiceRequest,
} from '@/types/clinic-service';

const CLINIC_SERVICE_API = '/api/clinic/services';

export const clinicServiceApi = {
  getAll(filters: ClinicServiceFilters): Promise<SpringPage<ClinicService>> {
    return unwrap<SpringPage<ClinicService>>(
      api.get(CLINIC_SERVICE_API, {
        params: {
          activeOnly: filters.activeOnly,
          page: filters.page,
          size: filters.size,
          sort: 'name,asc',
        },
      })
    );
  },
  getById(serviceId: string): Promise<ClinicService> {
    return unwrap<ClinicService>(api.get(`${CLINIC_SERVICE_API}/${serviceId}`));
  },

  create(request: ClinicServiceRequest): Promise<ClinicService> {
    return unwrap<ClinicService>(api.post(CLINIC_SERVICE_API, request));
  },

  update(serviceId: string, request: ClinicServiceRequest): Promise<ClinicService> {
    return unwrap<ClinicService>(api.put(`${CLINIC_SERVICE_API}/${serviceId}`, request));
  },

  async remove(serviceId: string): Promise<void> {
    await unwrap<void>(api.delete(`${CLINIC_SERVICE_API}/${serviceId}`));
  },
};
