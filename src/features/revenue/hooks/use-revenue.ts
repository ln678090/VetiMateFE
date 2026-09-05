'use client';

import { useQuery } from '@tanstack/react-query';
import { revenueApi } from '../api/revenue.api';

export const REVENUE_QUERY_KEYS = {
  all: ['revenue'] as const,
  analytics: (period: string) => [...REVENUE_QUERY_KEYS.all, 'analytics', period] as const,
};

export function useRevenueAnalytics(period: string = 'MONTH') {
  return useQuery({
    queryKey: REVENUE_QUERY_KEYS.analytics(period),
    queryFn: () => revenueApi.getRevenueAnalytics(period),
    staleTime: 30 * 1000,
  });
}
