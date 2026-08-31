export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  petType: 'dog' | 'cat' | 'both';
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  inStock?: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ProductListResp {
  items: Product[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
