import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerPetService } from '@/services/owner-pet.service';
import { PetFormValues } from '@/services/pet.schema';

export const OWNER_PET_QUERY_KEYS = {
  all: ['owner-pets'] as const,
  lists: () => [...OWNER_PET_QUERY_KEYS.all, 'list'] as const,
  list: (filters: { page: number; size: number }) =>
    [...OWNER_PET_QUERY_KEYS.lists(), filters] as const,
  details: () => [...OWNER_PET_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...OWNER_PET_QUERY_KEYS.details(), id] as const,
};

export function useOwnerPets(page = 0, size = 10) {
  return useQuery({
    queryKey: OWNER_PET_QUERY_KEYS.list({ page, size }),
    queryFn: () => ownerPetService.getMyPets(page, size),
  });
}

export function useOwnerPet(petId: string | null) {
  return useQuery({
    queryKey: OWNER_PET_QUERY_KEYS.detail(petId!),
    queryFn: () => ownerPetService.getMyPet(petId!),
    enabled: !!petId,
  });
}

export function useCreateOwnerPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PetFormValues) => ownerPetService.createMyPet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OWNER_PET_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateOwnerPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PetFormValues }) =>
      ownerPetService.updateMyPet(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: OWNER_PET_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: OWNER_PET_QUERY_KEYS.detail(variables.id),
      });
    },
  });
}

export function useDeleteOwnerPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ownerPetService.deleteMyPet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OWNER_PET_QUERY_KEYS.lists() });
    },
  });
}
