import { publicApi, unwrap } from '@/lib/axios';
import type { Brand, Category, CategoryTree } from '@/types/catalog';

const BASE = '/api/catalog';

/**
 * Catalog Service - call BE catalog module (Sprint 1.1).
 * Tất cả endpoint đều public (theo SecurityConfig matcher .permitAll() cho GET).
 */
export const catalogService = {
  async getCategoryTree(): Promise<CategoryTree[]> {
    return unwrap(publicApi.get(`${BASE}/categories/tree`));
  },

  async getAllCategories(): Promise<Category[]> {
    return unwrap(publicApi.get(`${BASE}/categories`));
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    return unwrap(publicApi.get(`${BASE}/categories/${slug}`));
  },

  async getAllBrands(): Promise<Brand[]> {
    return unwrap(publicApi.get(`${BASE}/brands`));
  },

  async getBrandBySlug(slug: string): Promise<Brand> {
    return unwrap(publicApi.get(`${BASE}/brands/${slug}`));
  },
};

export type CatalogService = typeof catalogService;
