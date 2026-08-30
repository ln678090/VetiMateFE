'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { ownerPetApi, petManagementApi } from '../api/pet-management.api';
import type {
  ManagementPetFilters,
  ManagementPetRequest,
  OwnerPet,
  OwnerPetRequest,
  PetManagementSummary,
  SpringPage,
} from '@/types/pet-management';

export const PET_QUERY_KEYS = {
  all: ['pets'] as const,

  owner: () => [...PET_QUERY_KEYS.all, 'owner'] as const,

  ownerLists: () => [...PET_QUERY_KEYS.owner(), 'list'] as const,

  ownerList: (page: number, size: number) => [...PET_QUERY_KEYS.ownerLists(), page, size] as const,

  ownerDetails: () => [...PET_QUERY_KEYS.owner(), 'detail'] as const,

  ownerDetail: (petId: string) => [...PET_QUERY_KEYS.ownerDetails(), petId] as const,

  management: () => [...PET_QUERY_KEYS.all, 'management'] as const,

  managementLists: () => [...PET_QUERY_KEYS.management(), 'list'] as const,

  managementList: (filters: ManagementPetFilters) =>
    [
      ...PET_QUERY_KEYS.managementLists(),
      filters.keyword?.trim() ?? '',
      filters.species ?? null,
      filters.deleted ?? false,
      filters.customerId ?? null,
      filters.page ?? 0,
      filters.size ?? 20,
      filters.sort ?? 'name,asc',
    ] as const,

  managementDetails: () => [...PET_QUERY_KEYS.management(), 'detail'] as const,

  managementDetail: (petId: string) => [...PET_QUERY_KEYS.managementDetails(), petId] as const,
};

export function useOwnerPets(
  page = 0,
  size = 12,
  enabled = true
): UseQueryResult<SpringPage<OwnerPet>, Error> {
  return useQuery({
    queryKey: PET_QUERY_KEYS.ownerList(page, size),
    queryFn: () => ownerPetApi.list(page, size),
    enabled,
    staleTime: 60_000,
  });
}

export function useOwnerPet(petId: string | null, enabled = true): UseQueryResult<OwnerPet, Error> {
  return useQuery({
    queryKey: PET_QUERY_KEYS.ownerDetail(petId ?? ''),
    queryFn: () => {
      if (!petId) {
        throw new Error('Thiếu mã thú cưng');
      }

      return ownerPetApi.get(petId);
    },
    enabled: enabled && Boolean(petId),
    staleTime: 60_000,
  });
}

export function useCreateOwnerPet(): UseMutationResult<OwnerPet, Error, OwnerPetRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ownerPetApi.create,

    onSuccess: async (pet) => {
      queryClient.setQueryData(PET_QUERY_KEYS.ownerDetail(pet.id), pet);

      await queryClient.invalidateQueries({
        queryKey: PET_QUERY_KEYS.ownerLists(),
      });
    },
  });
}

interface UpdateOwnerPetVariables {
  petId: string;
  request: OwnerPetRequest;
}

export function useUpdateOwnerPet(): UseMutationResult<OwnerPet, Error, UpdateOwnerPetVariables> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, request }) => ownerPetApi.update(petId, request),

    onSuccess: async (pet) => {
      queryClient.setQueryData(PET_QUERY_KEYS.ownerDetail(pet.id), pet);

      await queryClient.invalidateQueries({
        queryKey: PET_QUERY_KEYS.ownerLists(),
      });
    },
  });
}

export function useDeleteOwnerPet(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ownerPetApi.remove,

    onSuccess: async (_, petId) => {
      queryClient.removeQueries({
        queryKey: PET_QUERY_KEYS.ownerDetail(petId),
      });

      await queryClient.invalidateQueries({
        queryKey: PET_QUERY_KEYS.ownerLists(),
      });
    },
  });
}

export function useManagementPets(
  filters: ManagementPetFilters,
  enabled = true
): UseQueryResult<SpringPage<PetManagementSummary>, Error> {
  return useQuery({
    queryKey: PET_QUERY_KEYS.managementList(filters),
    queryFn: () => petManagementApi.search(filters),
    enabled,
    staleTime: 30_000,
  });
}

export function useManagementPet(
  petId: string | null,
  enabled = true
): UseQueryResult<PetManagementSummary, Error> {
  return useQuery({
    queryKey: PET_QUERY_KEYS.managementDetail(petId ?? ''),
    queryFn: () => {
      if (!petId) {
        throw new Error('Thiếu mã thú cưng');
      }

      return petManagementApi.get(petId);
    },
    enabled: enabled && Boolean(petId),
    staleTime: 30_000,
  });
}

export function useCreateManagementPet(): UseMutationResult<
  PetManagementSummary,
  Error,
  ManagementPetRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petManagementApi.create,

    onSuccess: async (pet) => {
      queryClient.setQueryData(PET_QUERY_KEYS.managementDetail(pet.id), pet);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.managementLists(),
        }),
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.ownerLists(),
        }),
      ]);
    },
  });
}

interface UpdateManagementPetVariables {
  petId: string;
  request: ManagementPetRequest;
}

export function useUpdateManagementPet(): UseMutationResult<
  PetManagementSummary,
  Error,
  UpdateManagementPetVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, request }) => petManagementApi.update(petId, request),

    onSuccess: async (pet) => {
      queryClient.setQueryData(PET_QUERY_KEYS.managementDetail(pet.id), pet);

      queryClient.setQueryData(PET_QUERY_KEYS.ownerDetail(pet.id), pet);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.managementLists(),
        }),
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.ownerLists(),
        }),
      ]);
    },
  });
}

export function useDeleteManagementPet(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petManagementApi.remove,

    onSuccess: async (_, petId) => {
      queryClient.removeQueries({
        queryKey: PET_QUERY_KEYS.ownerDetail(petId),
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.managementLists(),
        }),
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.ownerLists(),
        }),
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.managementDetail(petId),
        }),
      ]);
    },
  });
}

export function useRestoreManagementPet(): UseMutationResult<PetManagementSummary, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petManagementApi.restore,

    onSuccess: async (pet) => {
      queryClient.setQueryData(PET_QUERY_KEYS.managementDetail(pet.id), pet);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.managementLists(),
        }),
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.ownerLists(),
        }),
      ]);
    },
  });
}
