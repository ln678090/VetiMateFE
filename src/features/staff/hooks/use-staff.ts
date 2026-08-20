import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { staffApi } from '@/features/staff/api/staff.api';
import type {
  CreateStaffRequest,
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
};

export function useStaffList(
  filters: StaffFilters
): UseQueryResult<SpringPage<StaffResponse>, Error> {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.list(filters),
    queryFn: () => staffApi.search(filters),
    placeholderData: (previousData) => previousData,
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
    mutationFn: staffApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.lists(),
      });
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

export function useDeactivateStaff(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.deactivate,

    onSuccess: async (_, staffId) => {
      queryClient.removeQueries({
        queryKey: STAFF_QUERY_KEYS.detail(staffId),
      });

      await queryClient.invalidateQueries({
        queryKey: STAFF_QUERY_KEYS.lists(),
      });
    },
  });
}
