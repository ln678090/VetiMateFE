import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { clinicServiceApi } from '../api/clinic-service.api';

import type { SpringPage } from '@/types/clinic';

import type {
  ClinicService,
  ClinicServiceFilters,
  ClinicServiceRequest,
} from '@/types/clinic-service';

export const CLINIC_SERVICE_QUERY_KEYS = {
  all: ['clinic-services'] as const,

  lists: () => [...CLINIC_SERVICE_QUERY_KEYS.all, 'list'] as const,

  list: (filters: ClinicServiceFilters) => [...CLINIC_SERVICE_QUERY_KEYS.lists(), filters] as const,

  details: () => [...CLINIC_SERVICE_QUERY_KEYS.all, 'detail'] as const,

  detail: (serviceId: string) => [...CLINIC_SERVICE_QUERY_KEYS.details(), serviceId] as const,
};

interface UpdateClinicServiceVariables {
  serviceId: string;
  request: ClinicServiceRequest;
}

export function useClinicServices(
  filters: ClinicServiceFilters
): UseQueryResult<SpringPage<ClinicService>, Error> {
  return useQuery({
    queryKey: CLINIC_SERVICE_QUERY_KEYS.list(filters),

    queryFn: () => clinicServiceApi.getAll(filters),

    placeholderData: (previousData) => previousData,
  });
}

export function useClinicService(serviceId: string | null): UseQueryResult<ClinicService, Error> {
  return useQuery({
    queryKey: CLINIC_SERVICE_QUERY_KEYS.detail(serviceId ?? 'disabled'),

    queryFn: () => {
      if (!serviceId) {
        throw new Error('Thiếu mã dịch vụ.');
      }

      return clinicServiceApi.getById(serviceId);
    },

    enabled: Boolean(serviceId),
  });
}

export function useCreateClinicService(): UseMutationResult<
  ClinicService,
  Error,
  ClinicServiceRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicServiceApi.create,

    onSuccess: async (service) => {
      queryClient.setQueryData(CLINIC_SERVICE_QUERY_KEYS.detail(service.id), service);

      await queryClient.invalidateQueries({
        queryKey: CLINIC_SERVICE_QUERY_KEYS.lists(),
      });
    },
  });
}

export function useUpdateClinicService(): UseMutationResult<
  ClinicService,
  Error,
  UpdateClinicServiceVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, request }) => clinicServiceApi.update(serviceId, request),

    onSuccess: async (service) => {
      queryClient.setQueryData(CLINIC_SERVICE_QUERY_KEYS.detail(service.id), service);

      await queryClient.invalidateQueries({
        queryKey: CLINIC_SERVICE_QUERY_KEYS.lists(),
      });
    },
  });
}

export function useDeleteClinicService(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicServiceApi.remove,

    onSuccess: async (_, serviceId) => {
      queryClient.removeQueries({
        queryKey: CLINIC_SERVICE_QUERY_KEYS.detail(serviceId),
      });

      await queryClient.invalidateQueries({
        queryKey: CLINIC_SERVICE_QUERY_KEYS.lists(),
      });
    },
  });
}
