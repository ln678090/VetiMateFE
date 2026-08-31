import { api, unwrap } from '@/lib/axios';
import { PetDto, SpringPage } from '@/types/clinic';
import { ApiResp } from '@/types/api';
import { PetFormValues } from '@/services/pet.schema';

export const ownerPetService = {
  getMyPets: async (page = 0, size = 10): Promise<SpringPage<PetDto>> => {
    const req = api.get<ApiResp<SpringPage<PetDto>>>('/api/clinic/me/pets', {
      params: { page, size },
    });
    return unwrap(req);
  },

  getMyPet: async (petId: string): Promise<PetDto> => {
    const req = api.get<ApiResp<PetDto>>(`/api/clinic/me/pets/${petId}`);
    return unwrap(req);
  },

  createMyPet: async (data: PetFormValues): Promise<PetDto> => {
    // BE OwnerPetRequest doesn't have note, we can strip it or just pass
    const { note, ...rest } = data;
    const req = api.post<ApiResp<PetDto>>('/api/clinic/me/pets', rest);
    return unwrap(req);
  },

  updateMyPet: async (petId: string, data: PetFormValues): Promise<PetDto> => {
    const { note, ...rest } = data;
    const req = api.put<ApiResp<PetDto>>(`/api/clinic/me/pets/${petId}`, rest);
    return unwrap(req);
  },

  deleteMyPet: async (petId: string): Promise<void> => {
    const req = api.delete<ApiResp<void>>(`/api/clinic/me/pets/${petId}`);
    return unwrap(req);
  },
};
