import { api } from '@/lib/axios';
import { ApiResp } from '@/types';
import { Brand, BrandReq, Category, CategoryReq, CategoryTree } from '../types/catalog.types';

export const catalogApi = {
  // ===== Categories =====
  getCategoryTree: async () => {
    const res = await api.get<ApiResp<CategoryTree[]>>('/api/catalog/categories/tree');
    return res.data;
  },

  getAllCategories: async () => {
    const res = await api.get<ApiResp<Category[]>>('/api/catalog/categories');
    return res.data;
  },

  createCategory: async (data: CategoryReq) => {
    const res = await api.post<ApiResp<Category>>('/api/catalog/categories', data);
    return res.data;
  },

  updateCategory: async (id: string, data: CategoryReq) => {
    const res = await api.put<ApiResp<Category>>(`/api/catalog/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete<ApiResp<void>>(`/api/catalog/categories/${id}`);
    return res.data;
  },

  // ===== Brands =====
  getAllBrands: async () => {
    const res = await api.get<ApiResp<Brand[]>>('/api/catalog/brands');
    return res.data;
  },

  createBrand: async (data: BrandReq) => {
    const res = await api.post<ApiResp<Brand>>('/api/catalog/brands', data);
    return res.data;
  },

  updateBrand: async (id: string, data: BrandReq) => {
    const res = await api.put<ApiResp<Brand>>(`/api/catalog/brands/${id}`, data);
    return res.data;
  },

  deleteBrand: async (id: string) => {
    const res = await api.delete<ApiResp<void>>(`/api/catalog/brands/${id}`);
    return res.data;
  }
};
