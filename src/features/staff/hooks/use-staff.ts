import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { staffApi } from '@/features/staff/api/staff.api';
import type {
  CreateStaffRequest,
  DeactivateStaffRequest,
  EligibleUserFilters,
  EligibleUserResponse,
  SpringPage,
  StaffFilters,
  StaffResponse,
  UpdateStaffRequest,
} from '@/types/staff';

export const STAFF_QUERY_KEYS = {
  all: ['staff'] as const,

  lists: () => [...STAFF_QUERY_KEYS.all, 'list'] as const,

  list: (filters: StaffFilters) => [...STAFF_QUERY_KEYS.lists(), filters] as const,

  details: () => [...STAFF_QUERY_KEYS.all, 'detail'] as const,

  detail: (staffId: string) => [...STAFF_QUERY_KEYS.details(), staffId] as const,

  eligibleUsers: () => [...STAFF_QUERY_KEYS.all, 'eligible-users'] as const,

  eligibleUserList: (filters: EligibleUserFilters) =>
    [...STAFF_QUERY_KEYS.eligibleUsers(), filters] as const,
};

export function useStaffList(
  filters: StaffFilters
): UseQueryResult<SpringPage<StaffResponse>, Error> {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.list(filters),
    queryFn: () => staffApi.search(filters),
    placeholderData: keepPreviousData,
  });
}

export function useEligibleUsers(
  filters: EligibleUserFilters,
  enabled = true
): UseQueryResult<SpringPage<EligibleUserResponse>, Error> {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.eligibleUserList(filters),
    queryFn: () => staffApi.searchEligibleUsers(filters),
    enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useStaff(staffId: string | null): UseQueryResult<StaffResponse, Error> {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.detail(staffId ?? ''),
    queryFn: () => staffApi.getById(staffId!),
    enabled: Boolean(staffId),
  });
}

export function useCreateStaff(): UseMutationResult<StaffResponse, Error, CreateStaffRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request) => staffApi.create(request),

    onSuccess: async (staff) => {
      queryClient.setQueryData(STAFF_QUERY_KEYS.detail(staff.id), staff);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STAFF_QUERY_KEYS.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: STAFF_QUERY_KEYS.eligibleUsers(),
        }),
      ]);
    },
  });
}

export function useUpdateStaff(): UseMutationResult<
  StaffResponse,
  Error,
  {
    staffId: string;
    request: UpdateStaffRequest;
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, request }) => staffApi.update(staffId, request),

    onSuccess: async (staff) => {
      queryClient.setQueryData(STAFF_QUERY_KEYS.detail(staff.id), staff);

      await queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.lists(),
      });
    },
  });
}

export function useDeactivateStaff(): UseMutationResult<
  StaffResponse,
  Error,
  {
    staffId: string;
    request: DeactivateStaffRequest;
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, request }) => staffApi.deactivate(staffId, request),

    onSuccess: async (staff) => {
      queryClient.setQueryData(STAFF_QUERY_KEYS.detail(staff.id), staff);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: STAFF_QUERY_KEYS.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: STAFF_QUERY_KEYS.eligibleUsers(),
        }),
      ]);
    },
  });
}
