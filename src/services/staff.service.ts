import { api, unwrap } from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import { ProductResp, ProductListResp } from '@/types/shop';
import { ShopOrderListResp, ShopOrderResp, UpdateOrderStatusRequest } from '@/types/staff';
import { CategoryResp, BrandResp } from '@/types/catalog';

export const staffService = {
  // --- Products ---
  getProducts: async (page = 0, size = 20, search?: string) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.append('search', search);
    return unwrap<ProductListResp>(
      api.get(`${API_ROUTES.staff.products}?${params.toString()}`)
    );
  },

  getProductById: async (id: string) => {
    return unwrap<ProductResp>(
      api.get(`${API_ROUTES.staff.products}/${id}`)
    );
  },

  createProduct: async (payload: any) => {
    return unwrap<ProductResp>(
      api.post(API_ROUTES.staff.products, payload)
    );
  },

  updateProduct: async (id: string, payload: any) => {
    return unwrap<ProductResp>(
      api.put(`${API_ROUTES.staff.products}/${id}`, payload)
    );
  },

  deleteProduct: async (id: string) => {
    return unwrap<void>(
      api.delete(`${API_ROUTES.staff.products}/${id}`)
    );
  },

  // --- Catalog (Categories & Brands) ---
  getCategories: async () => {
    // The endpoint returns a List<CategoryResp> directly or wrapped in ApiResp? Let's check API definition.
    // In CatalogController.java: ApiResp<List<CategoryResp>>
    return unwrap<CategoryResp[]>(
      api.get(API_ROUTES.catalog.categories)
    );
  },

  getBrands: async () => {
    // In CatalogController.java: ApiResp<List<BrandResp>>
    return unwrap<BrandResp[]>(
      api.get(API_ROUTES.catalog.brands)
    );
  },

  createCategory: async (payload: any) => {
    return unwrap<CategoryResp>(
      api.post(`${API_ROUTES.staff.catalog}/categories`, payload)
    );
  },

  updateCategory: async (id: string, payload: any) => {
    return unwrap<CategoryResp>(
      api.put(`${API_ROUTES.staff.catalog}/categories/${id}`, payload)
    );
  },

  deleteCategory: async (id: string) => {
    return unwrap<void>(
      api.delete(`${API_ROUTES.staff.catalog}/categories/${id}`)
    );
  },

  createBrand: async (payload: any) => {
    return unwrap<BrandResp>(
      api.post(`${API_ROUTES.staff.catalog}/brands`, payload)
    );
  },

  updateBrand: async (id: string, payload: any) => {
    return unwrap<BrandResp>(
      api.put(`${API_ROUTES.staff.catalog}/brands/${id}`, payload)
    );
  },

  deleteBrand: async (id: string) => {
    return unwrap<void>(
      api.delete(`${API_ROUTES.staff.catalog}/brands/${id}`)
    );
  },

  // --- Orders ---
  getOrders: async (page = 0, size = 20, status?: string) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status);
    return unwrap<ShopOrderListResp>(
      api.get(`${API_ROUTES.staff.orders}?${params.toString()}`)
    );
  },

  getOrderById: async (id: string) => {
    return unwrap<ShopOrderResp>(
      api.get(`${API_ROUTES.staff.orders}/${id}`)
    );
  },

  updateOrderStatus: async (id: string, payload: UpdateOrderStatusRequest) => {
    return unwrap<ShopOrderResp>(
      api.put(`${API_ROUTES.staff.orders}/${id}/status`, payload)
    );
  },

  // --- Inventory ---
  getInventory: async (page = 0, size = 20, search?: string) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.append('search', search);
    return unwrap<ProductListResp>(
      api.get(`${API_ROUTES.staff.inventory}?${params.toString()}`)
    );
  },

  updateStock: async (productId: string, payload: { stockQuantity: number }) => {
    return unwrap<ProductResp>(
      api.put(`${API_ROUTES.staff.inventory}/${productId}`, payload)
    );
  },
};
