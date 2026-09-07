import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type {
  OwnerAppointmentStatus,
  OwnerVisitHistory,
  SpringPage,
} from '@/types/owner-pet-history';

import { ownerPetHistoryApi } from '../api/owner-pet-history.api';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 20;

export const OWNER_PET_HISTORY_QUERY_KEYS = {
  all: ['owner-pet-history'] as const,

  pet: (petId: string) => [...OWNER_PET_HISTORY_QUERY_KEYS.all, petId] as const,

  statuses: (petId: string) =>
    [...OWNER_PET_HISTORY_QUERY_KEYS.pet(petId), 'appointment-statuses'] as const,

  history: (petId: string, page: number, size: number) =>
    [...OWNER_PET_HISTORY_QUERY_KEYS.pet(petId), 'completed-history', page, size] as const,
};

export function useOwnerPetAppointmentStatuses(
  petId: string,
  enabled = true
): UseQueryResult<OwnerAppointmentStatus[], Error> {
  return useQuery({
    queryKey: OWNER_PET_HISTORY_QUERY_KEYS.statuses(petId),
    queryFn: () => ownerPetHistoryApi.getAppointmentStatuses(petId),
    enabled: enabled && petId.length > 0,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useOwnerPetCompletedHistory(
  petId: string,
  page = 0,
  size = DEFAULT_PAGE_SIZE,
  enabled = true
): UseQueryResult<SpringPage<OwnerVisitHistory>, Error> {
  const safePage = Math.max(page, 0);
  const safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

  return useQuery({
    queryKey: OWNER_PET_HISTORY_QUERY_KEYS.history(petId, safePage, safeSize),
    queryFn: () =>
      ownerPetHistoryApi.getCompletedHistory(petId, {
        page: safePage,
        size: safeSize,
      }),
    enabled: enabled && petId.length > 0,
    staleTime: 30_000,
    retry: 1,
  });
}
