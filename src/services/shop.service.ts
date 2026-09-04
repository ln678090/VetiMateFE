import { publicApi, unwrap } from '@/lib/axios';
import type { Product, ProductCardCompat, ProductFilters, ProductListResponse } from '@/types/shop';

const BASE = '/api/products';

/**
 * Convert BE product -> ProductCard compat (giữ field 'image', 'brand', 'category' cho component cũ).
 * Khi refactor xong ProductCard dùng trực tiếp imageUrl/brandName/categorySlug -> xoá hàm này.
 */
function toCardCompat(p: Product): ProductCardCompat {
  return {
    ...p,
    image: p.imageUrl,
    brand: p.brandName,
    category: p.categorySlug,
  };
}

/**
 * Convert FE filter -> BE query params.
 * BE expect: categorySlugs, brandSlugs, petTypes (csv hoặc multi-param).
 * Axios serialize List qua repeat (?categorySlugs=a&categorySlugs=b).
 */
function buildQueryParams(filters: ProductFilters) {
  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.categorySlugs && filters.categorySlugs.length > 0)
    params.categorySlugs = filters.categorySlugs;
  if (filters.brandSlugs && filters.brandSlugs.length > 0) params.brandSlugs = filters.brandSlugs;
  if (filters.petTypes && filters.petTypes.length > 0) params.petTypes = filters.petTypes;
  if (filters.priceMin !== undefined) params.priceMin = filters.priceMin;
  if (filters.priceMax !== undefined) params.priceMax = filters.priceMax;
  if (filters.inStockOnly) params.inStockOnly = true;
  if (filters.sort) params.sort = filters.sort;
  if (filters.page !== undefined) params.page = filters.page;
  if (filters.size !== undefined) params.size = filters.size;

  return params;
}

export const shopService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const data = await unwrap<ProductListResponse>(
      publicApi.get(BASE, {
        params: buildQueryParams(filters),
        paramsSerializer: {
          // Trả về key=a&key=b thay vì key=a,b (khớp với Spring @RequestParam List)
          indexes: null,
        },
      })
    );

    return {
      ...data,
      items: data.items.map(toCardCompat),
    };
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const data = await unwrap<Product>(publicApi.get(`${BASE}/${slug}`));
    return toCardCompat(data);
  },

  async getRelatedProducts(
    currentSlug: string,
    _category: string, // backward-compat: BE lookup từ DB nên không cần
    limit: number = 4
  ): Promise<Product[]> {
    const data = await unwrap<Product[]>(
      publicApi.get(`${BASE}/${currentSlug}/related`, {
        params: { limit },
      })
    );
    return data.map(toCardCompat);
  },

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const data = await unwrap<Product[]>(publicApi.get(`${BASE}/featured`, { params: { limit } }));
    return data.map(toCardCompat);
  },

  async getProductReviews(slug: string): Promise<
    {
      id: string;
      user: string;
      avatar?: string;
      rating: number;
      title?: string;
      content: string;
      helpful: number;
      createdAt: string;
    }[]
  > {
    const data = await unwrap<
      {
        id: string;
        user: string;
        avatar?: string;
        rating: number;
        title?: string;
        content: string;
        helpful: number;
        createdAt: string;
      }[]
    >(publicApi.get(`${BASE}/${slug}/reviews`));
    return data;
  },
};

export type ShopService = typeof shopService;
