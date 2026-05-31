export type PetType = 'dog' | 'cat' | 'both';

/**
 * Category slug từ BE (động, không hard-code).
 * Tuy nhiên giữ alias cho UI filter check static.
 */
export type ProductCategory = string;

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  shortDesc?: string | null;

  // Relations (flatten từ BE)
  categoryId: string;
  categoryName: string;
  categorySlug: string;

  brandId: string;
  brandName: string;
  brandSlug: string;

  petType: PetType;

  price: number;
  originalPrice?: number | null;
  stockQuantity: number;
  inStock: boolean;

  rating: number;
  reviewCount: number;

  imageUrl: string;
  galleryUrls?: string | null;

  isFeatured: boolean;
  isNew: boolean;
}

/** Filters gửi lên BE */
export interface ProductFilters {
  search?: string;
  categorySlugs?: string[]; //  ĐỔI từ categories → categorySlugs (khớp BE)
  brandSlugs?: string[]; //  MỚI
  petTypes?: PetType[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  sort?: ProductSortKey;
  page?: number; //  MỚI
  size?: number; //  MỚI
}

export type ProductSortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';

export interface ProductListResponse {
  items: Product[];
  total: number;
  page?: number;
  size?: number;
  totalPages?: number;
}

/** Adapter: chuyển product BE → product FE (giữ field cũ `image` cho ProductCard).
 *  Nếu Product type trên đã đủ thì adapter này chỉ pass-through.
 */
export interface ProductCardCompat extends Product {
  image: string; // alias cho imageUrl
  brand: string; // alias cho brandName
  category: string; // alias cho categorySlug
}
