'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { serviceIndicationApi } from '../api/service-indication.api';
import type {
  CompleteServiceIndicationRequest,
  CreateServiceIndicationRequest,
  ServiceIndicationResponse,
} from '@/types/service-indication';

export const SERVICE_INDICATION_QUERY_KEYS = {
  all: ['service-indications'] as const,

  list: (medicalRecordId: string) =>
    [...SERVICE_INDICATION_QUERY_KEYS.all, 'list', medicalRecordId] as const,
};

interface CreateVariables {
  medicalRecordId: string;
  request: CreateServiceIndicationRequest;
}

interface CompleteVariables {
  medicalRecordId: string;
  indicationId: string;
  request: CompleteServiceIndicationRequest;
}

interface CancelVariables {
  medicalRecordId: string;
  indicationId: string;
}

export function useServiceIndications(
  medicalRecordId: string | null,
  enabled = true
): UseQueryResult<ServiceIndicationResponse[], Error> {
  return useQuery({
    queryKey: SERVICE_INDICATION_QUERY_KEYS.list(medicalRecordId ?? ''),

    queryFn: () => {
      if (!medicalRecordId) {
        return Promise.resolve([] as ServiceIndicationResponse[]);
      }

      return serviceIndicationApi.getAll(medicalRecordId);
    },

    enabled: enabled && Boolean(medicalRecordId),

    staleTime: 30_000,
  });
}

export function useCreateServiceIndication(): UseMutationResult<
  ServiceIndicationResponse,
  Error,
  CreateVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ medicalRecordId, request }) =>
      serviceIndicationApi.create(medicalRecordId, request),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: SERVICE_INDICATION_QUERY_KEYS.list(variables.medicalRecordId),
      });
    },
  });
}

export function useCompleteServiceIndication(): UseMutationResult<
  ServiceIndicationResponse,
  Error,
  CompleteVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ indicationId, request }) => serviceIndicationApi.complete(indicationId, request),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: SERVICE_INDICATION_QUERY_KEYS.list(variables.medicalRecordId),
      });
    },
  });
}

export function useCancelServiceIndication(): UseMutationResult<
  ServiceIndicationResponse,
  Error,
  CancelVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ indicationId }) => serviceIndicationApi.cancel(indicationId),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: SERVICE_INDICATION_QUERY_KEYS.list(variables.medicalRecordId),
      });
    },
  });
}
