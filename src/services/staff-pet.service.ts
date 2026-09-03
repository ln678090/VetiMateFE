import { api, unwrap } from '@/lib/axios';
import type { PetDto, SpringPage, CreatePetRequest, UpdatePetRequest } from '@/types/clinic';
import { ApiResp } from '@/types/api';

export const staffPetService = {
  getByCustomer: async (customerId: string, page = 0, size = 20): Promise<SpringPage<PetDto>> => {
    const req = api.get<ApiResp<SpringPage<PetDto>>>('/api/clinic/pets', {
      params: { customerId, page, size },
    });
    return unwrap(req);
  },

  create: async (data: CreatePetRequest): Promise<PetDto> => {
    const req = api.post<ApiResp<PetDto>>('/api/clinic/pets', data);
    return unwrap(req);
  },

  update: async (id: string, data: UpdatePetRequest): Promise<PetDto> => {
    const req = api.put<ApiResp<PetDto>>(`/api/clinic/pets/${id}`, data);
    return unwrap(req);
  },
};
