import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { staffPetHistoryApi } from '@/features/customers/api/staff-pet-history.api';
import type {
  OwnerAppointmentStatus,
  OwnerVisitHistory,
  SpringPage,
} from '@/types/owner-pet-history';

const MAX_PAGE_SIZE = 20;

export const STAFF_PET_HISTORY_QUERY_KEYS = {
  all: ['staff-pet-history'] as const,

  pet: (customerId: string, petId: string) =>
    [...STAFF_PET_HISTORY_QUERY_KEYS.all, customerId, petId] as const,

  statuses: (customerId: string, petId: string) =>
    [...STAFF_PET_HISTORY_QUERY_KEYS.pet(customerId, petId), 'appointment-statuses'] as const,

  history: (customerId: string, petId: string, page: number, size: number) =>
    [...STAFF_PET_HISTORY_QUERY_KEYS.pet(customerId, petId), 'history', page, size] as const,
};

export function useStaffPetAppointmentStatuses(
  customerId: string,
  petId: string,
  enabled = true
): UseQueryResult<OwnerAppointmentStatus[], Error> {
  return useQuery({
    queryKey: STAFF_PET_HISTORY_QUERY_KEYS.statuses(customerId, petId),

    queryFn: () => staffPetHistoryApi.getAppointmentStatuses(customerId, petId),

    enabled: enabled && customerId.length > 0 && petId.length > 0,

    staleTime: 30_000,
    retry: 1,
  });
}

export function useStaffPetCompletedHistory(
  customerId: string,
  petId: string,
  page = 0,
  size = 5,
  enabled = true
): UseQueryResult<SpringPage<OwnerVisitHistory>, Error> {
  const safePage = Math.max(page, 0);
  const safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

  return useQuery({
    queryKey: STAFF_PET_HISTORY_QUERY_KEYS.history(customerId, petId, safePage, safeSize),

    queryFn: () => staffPetHistoryApi.getCompletedHistory(customerId, petId, safePage, safeSize),

    enabled: enabled && customerId.length > 0 && petId.length > 0,

    staleTime: 30_000,
    retry: 1,
  });
}
