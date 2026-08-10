// ===== Inventory Types — match backend DTOs =====

export interface SupplierResp {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}

export interface SupplierRequest {
  name: string;
  phone?: string;
  email?: string;
}

export interface MedicineResp {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  minStock: number;
  importPrice: number;
  sellPrice: number;
  isActive: boolean;
  totalStock: number;
}

export interface MedicineRequest {
  name: string;
  sku?: string;
  unit: string;
  minStock: number;
  importPrice: number;
  sellPrice: number;
}

export type VoucherType = 'IMPORT' | 'EXPORT' | 'TRANSFER' | 'STOCKTAKE';
export type VoucherStatus = 'DRAFT' | 'APPROVED' | 'CANCELLED';

export interface StockBatchResp {
  id: string;
  batchCode: string | null;
  quantity: number;
  remainingQty: number;
  importPrice: number;
  expiryDate: string | null;
  receivedAt: string;
  medicineId: string | null;
  medicineName: string | null;
  productId: string | null;
  productName: string | null;
  supplierId: string | null;
  supplierName: string | null;
  isExpired: boolean;
  isNearExpiry: boolean;
}

export interface StockVoucherItemResp {
  id: string;
  medicineId: string | null;
  medicineName: string | null;
  productId: string | null;
  productName: string | null;
  batchCode: string | null;
  quantity: number;
  unitPrice: number | null;
  note: string | null;
}

export interface StockVoucherResp {
  id: string;
  type: VoucherType;
  status: VoucherStatus;
  createdBy: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  note: string | null;
  items: StockVoucherItemResp[];
  createdAt: string;
  updatedAt: string;
  itemCount: number;
}

export interface VoucherItemRequest {
  medicineId?: string;
  productId?: string;
  batchId?: string;
  quantity: number;
  unitPrice?: number;
  note?: string;
  batchCode?: string;
  expiryDate?: string;
  supplierId?: string;
}

export interface CreateVoucherRequest {
  type: VoucherType;
  note?: string;
  items: VoucherItemRequest[];
}

export interface InventoryDashboardResp {
  totalMedicines: number;
  totalSuppliers: number;
  lowStockCount: number;
  nearExpiryCount: number;
  expiredCount: number;
  pendingVouchers: number;
  totalStockValue: number;
}

/** Paginated response from Spring Boot */
export interface PageResp<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
