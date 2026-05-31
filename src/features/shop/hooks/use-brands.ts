'use client';

import { catalogService } from '@/services/catalog.service';
import { useQuery } from '@tanstack/react-query';
import { CATALOG_QUERY_KEYS } from './use-categories';

export function useBrands() {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.brands(),
    queryFn: () => catalogService.getAllBrands(),
    staleTime: 5 * 60_000,
  });
}

export function useBrand(slug: string) {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.brand(slug),
    queryFn: () => catalogService.getBrandBySlug(slug),
    staleTime: 5 * 60_000,
    enabled: !!slug,
  });
}
