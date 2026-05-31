'use client';

import { shopService } from '@/services/shop.service';
import type { ProductCategory, ProductFilters } from '@/types/shop';
import { useQuery } from '@tanstack/react-query';

export const SHOP_QUERY_KEYS = {
  all: ['shop'] as const,
  products: (filters: ProductFilters) => [...SHOP_QUERY_KEYS.all, 'products', filters] as const,
  product: (slug: string) => [...SHOP_QUERY_KEYS.all, 'product', slug] as const,
  related: (slug: string, category: ProductCategory) =>
    [...SHOP_QUERY_KEYS.all, 'related', slug, category] as const,
};

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: SHOP_QUERY_KEYS.products(filters),
    queryFn: () => shopService.getProducts(filters),
    staleTime: 60_000,
  });
}
export function useProduct(slug: string) {
  return useQuery({
    queryKey: SHOP_QUERY_KEYS.product(slug),
    queryFn: () => shopService.getProductBySlug(slug),
    staleTime: 60_000,
    enabled: !!slug,
  });
}

export function useRelatedProducts(slug: string, category: ProductCategory | undefined) {
  return useQuery({
    queryKey: SHOP_QUERY_KEYS.related(slug, category!),
    queryFn: () => shopService.getRelatedProducts(slug, category!, 4),
    staleTime: 60_000,
    enabled: !!slug && !!category,
  });
}
