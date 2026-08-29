import { api, unwrap } from '@/lib/axios';
import type {
  ManagementPetFilters,
  ManagementPetRequest,
  OwnerPet,
  OwnerPetRequest,
  PetManagementSummary,
  SpringPage,
} from '@/types/pet-management';

const OWNER_BASE_URL = '/api/clinic/me/pets';

const MANAGEMENT_BASE_URL = '/api/clinic/management/pets';

function normalizeOwnerRequest(request: OwnerPetRequest): OwnerPetRequest {
  return {
    name: request.name.trim(),
    species: request.species,
    breed: request.breed?.trim() || null,
    gender: request.gender?.trim() || null,
    birthDate: request.birthDate || null,
    weightKg: request.weightKg,
  };
}

function normalizeManagementRequest(request: ManagementPetRequest): ManagementPetRequest {
  return {
    ...normalizeOwnerRequest(request),
    customerId: request.customerId,
  };
}

export const ownerPetApi = {
  list(page = 0, size = 12): Promise<SpringPage<OwnerPet>> {
    return unwrap<SpringPage<OwnerPet>>(
      api.get(OWNER_BASE_URL, {
        params: {
          page,
          size,
          sort: 'name,asc',
        },
      })
    );
  },

  get(petId: string): Promise<OwnerPet> {
    return unwrap<OwnerPet>(api.get(`${OWNER_BASE_URL}/${petId}`));
  },

  create(request: OwnerPetRequest): Promise<OwnerPet> {
    return unwrap<OwnerPet>(api.post(OWNER_BASE_URL, normalizeOwnerRequest(request)));
  },

  update(petId: string, request: OwnerPetRequest): Promise<OwnerPet> {
    return unwrap<OwnerPet>(api.put(`${OWNER_BASE_URL}/${petId}`, normalizeOwnerRequest(request)));
  },

  async remove(petId: string): Promise<void> {
    await unwrap<null>(api.delete(`${OWNER_BASE_URL}/${petId}`));
  },
};

export const petManagementApi = {
  search(filters: ManagementPetFilters): Promise<SpringPage<PetManagementSummary>> {
    return unwrap<SpringPage<PetManagementSummary>>(
      api.get(MANAGEMENT_BASE_URL, {
        params: {
          keyword: filters.keyword?.trim() || undefined,
          species: filters.species,
          deleted: filters.deleted ?? false,
          customerId: filters.customerId || undefined,
          page: filters.page ?? 0,
          size: filters.size ?? 20,
          sort: filters.sort ?? 'name,asc',
        },
      })
    );
  },

  get(petId: string): Promise<PetManagementSummary> {
    return unwrap<PetManagementSummary>(api.get(`${MANAGEMENT_BASE_URL}/${petId}`));
  },

  create(request: ManagementPetRequest): Promise<PetManagementSummary> {
    return unwrap<PetManagementSummary>(
      api.post(MANAGEMENT_BASE_URL, normalizeManagementRequest(request))
    );
  },

  update(petId: string, request: ManagementPetRequest): Promise<PetManagementSummary> {
    return unwrap<PetManagementSummary>(
      api.put(`${MANAGEMENT_BASE_URL}/${petId}`, normalizeManagementRequest(request))
    );
  },

  async remove(petId: string): Promise<void> {
    await unwrap<null>(api.delete(`${MANAGEMENT_BASE_URL}/${petId}`));
  },

  restore(petId: string): Promise<PetManagementSummary> {
    return unwrap<PetManagementSummary>(api.post(`${MANAGEMENT_BASE_URL}/${petId}/restore`));
  },
};
