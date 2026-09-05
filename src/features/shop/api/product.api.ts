import { api } from '@/lib/axios';
import { ApiResp } from '@/types';
import { Product, ProductListResp } from '../types/product.types';

export interface ProductReq {
  name: string;
  sku?: string;
  description?: string;
  shortDesc?: string;
  categoryId: string;
  brandId: string;
  petType: 'dog' | 'cat' | 'both';
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  imageUrl: string;
  galleryUrls?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isActive?: boolean;
}

export const productApi = {
  getProducts: async (sort?: string) => {
    const query = sort ? `?sort=${sort}` : '';
    const res = await api.get<ApiResp<ProductListResp>>(`/api/products${query}`);
    return res.data;
  },

  createProduct: async (data: ProductReq) => {
    const res = await api.post<ApiResp<Product>>('/api/products', data);
    return res.data;
  },

  updateProduct: async (id: string, data: ProductReq) => {
    const res = await api.put<ApiResp<Product>>(`/api/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: string) => {
    const res = await api.delete<ApiResp<void>>(`/api/products/${id}`);
    return res.data;
  },
};
