import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { staffCustomerApi } from '@/features/customers/api/staff-customer.api';
import type { SpringPage, StaffCustomerFilter, StaffCustomerSummary } from '@/types/staff-customer';

interface UseStaffCustomersParams {
  keyword: string;
  filter: StaffCustomerFilter;
  page: number;
  size: number;
}

export const STAFF_CUSTOMER_QUERY_KEYS = {
  all: ['staff-customers'] as const,

  list: (keyword: string, filter: StaffCustomerFilter, page: number, size: number) =>
    [...STAFF_CUSTOMER_QUERY_KEYS.all, 'list', keyword, filter, page, size] as const,
};

export function useStaffCustomers(
  params: UseStaffCustomersParams
): UseQueryResult<SpringPage<StaffCustomerSummary>, Error> {
  const safeKeyword = params.keyword.trim();
  const safePage = Math.max(params.page, 0);
  const safeSize = Math.min(Math.max(params.size, 1), 20);

  return useQuery({
    queryKey: STAFF_CUSTOMER_QUERY_KEYS.list(safeKeyword, params.filter, safePage, safeSize),

    queryFn: () =>
      staffCustomerApi.search({
        keyword: safeKeyword,
        filter: params.filter,
        page: safePage,
        size: safeSize,
      }),

    staleTime: 30_000,
    retry: 1,
  });
}
