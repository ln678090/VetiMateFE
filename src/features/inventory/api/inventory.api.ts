import { api } from '@/lib/axios';
import type { ApiResp } from '@/types';
import type {
  CreateVoucherRequest,
  InventoryDashboardResp,
  MedicineRequest,
  MedicineResp,
  PageResp,
  StockBatchResp,
  StockVoucherResp,
  SupplierRequest,
  SupplierResp,
  VoucherStatus,
  VoucherType,
} from '@/types/inventory';

const BASE = '/api/inventory';

// ===== Suppliers =====

export const supplierApi = {
  getAll: (all = false) =>
    api.get<ApiResp<SupplierResp[]>>(`${BASE}/suppliers`, { params: { all } }),

  getById: (id: string) => api.get<ApiResp<SupplierResp>>(`${BASE}/suppliers/${id}`),

  create: (data: SupplierRequest) => api.post<ApiResp<SupplierResp>>(`${BASE}/suppliers`, data),

  update: (id: string, data: SupplierRequest) =>
    api.put<ApiResp<SupplierResp>>(`${BASE}/suppliers/${id}`, data),

  toggleActive: (id: string) => api.put<ApiResp<void>>(`${BASE}/suppliers/${id}/toggle-active`),
};

// ===== Medicines =====

export const medicineApi = {
  getAll: (all = false) =>
    api.get<ApiResp<MedicineResp[]>>(`${BASE}/medicines`, { params: { all } }),

  getById: (id: string) => api.get<ApiResp<MedicineResp>>(`${BASE}/medicines/${id}`),

  create: (data: MedicineRequest) => api.post<ApiResp<MedicineResp>>(`${BASE}/medicines`, data),

  update: (id: string, data: MedicineRequest) =>
    api.put<ApiResp<MedicineResp>>(`${BASE}/medicines/${id}`, data),

  toggleActive: (id: string) => api.put<ApiResp<void>>(`${BASE}/medicines/${id}/toggle-active`),

  getLowStock: () => api.get<ApiResp<MedicineResp[]>>(`${BASE}/medicines/low-stock`),
};

// ===== Vouchers =====

export const voucherApi = {
  getAll: (params?: { type?: VoucherType; status?: VoucherStatus; page?: number; size?: number }) =>
    api.get<ApiResp<PageResp<StockVoucherResp>>>(`${BASE}/vouchers`, { params }),

  getById: (id: string) => api.get<ApiResp<StockVoucherResp>>(`${BASE}/vouchers/${id}`),

  create: (data: CreateVoucherRequest) =>
    api.post<ApiResp<StockVoucherResp>>(`${BASE}/vouchers`, data),

  approve: (id: string) => api.put<ApiResp<StockVoucherResp>>(`${BASE}/vouchers/${id}/approve`),

  cancel: (id: string) => api.put<ApiResp<StockVoucherResp>>(`${BASE}/vouchers/${id}/cancel`),
};

// ===== Batches =====

export const batchApi = {
  getByMedicine: (medicineId: string) =>
    api.get<ApiResp<StockBatchResp[]>>(`${BASE}/batches/medicine/${medicineId}`),

  getByProduct: (productId: string) =>
    api.get<ApiResp<StockBatchResp[]>>(`${BASE}/batches/product/${productId}`),
};

// ===== Alerts =====

export const alertApi = {
  getNearExpiry: () => api.get<ApiResp<StockBatchResp[]>>(`${BASE}/alerts/near-expiry`),

  getExpired: () => api.get<ApiResp<StockBatchResp[]>>(`${BASE}/alerts/expired`),
};

// ===== Dashboard =====

export const dashboardApi = {
  get: () => api.get<ApiResp<InventoryDashboardResp>>(`${BASE}/dashboard`),
};
