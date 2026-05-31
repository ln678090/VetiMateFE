'use client';

import { catalogService } from '@/services/catalog.service';
import { useQuery } from '@tanstack/react-query';

export const CATALOG_QUERY_KEYS = {
  all: ['catalog'] as const,
  categories: () => [...CATALOG_QUERY_KEYS.all, 'categories'] as const,
  categoriesTree: () => [...CATALOG_QUERY_KEYS.all, 'categories', 'tree'] as const,
  category: (slug: string) => [...CATALOG_QUERY_KEYS.all, 'categories', slug] as const,
  brands: () => [...CATALOG_QUERY_KEYS.all, 'brands'] as const,
  brand: (slug: string) => [...CATALOG_QUERY_KEYS.all, 'brands', slug] as const,
};

export function useCategoryTree() {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.categoriesTree(),
    queryFn: () => catalogService.getCategoryTree(),
    staleTime: 5 * 60_000, // 5 phút - category ít thay đổi
  });
}

export function useCategories() {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.categories(),
    queryFn: () => catalogService.getAllCategories(),
    staleTime: 5 * 60_000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.category(slug),
    queryFn: () => catalogService.getCategoryBySlug(slug),
    staleTime: 5 * 60_000,
    enabled: !!slug,
  });
}
