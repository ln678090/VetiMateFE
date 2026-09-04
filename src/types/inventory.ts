// ===== Supplier =====
export interface SupplierResp {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierRequest {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

// ===== Medicine =====
export interface MedicineResp {
  id: string;
  name: string;
  unit: string;
  description?: string;
  supplierId: string;
  supplierName?: string;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineRequest {
  name: string;
  unit: string;
  description?: string;
  supplierId: string;
  minStockLevel?: number;
}

// ===== Stock Batch =====
export interface StockBatchResp {
  id: string;
  medicineId?: string;
  medicineName?: string;
  productId?: string;
  productName?: string;
  batchNumber: string;
  quantity: number;
  remainingQuantity: number;
  expiryDate: string;
  importDate: string;
  createdAt: string;
}

// ===== Voucher =====
export type VoucherType = 'IMPORT' | 'EXPORT';
export type VoucherStatus = 'PENDING' | 'APPROVED' | 'CANCELLED';

export interface VoucherItem {
  id?: string;
  medicineId: string;
  medicineName?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  batchNumber?: string;
  batchCode?: string;
  expiryDate?: string;
  note?: string;
}

export interface StockVoucherResp {
  id: string;
  code: string;
  type: VoucherType;
  status: VoucherStatus;
  supplierId?: string;
  supplierName?: string;
  note?: string;
  totalAmount: number;
  items: VoucherItem[];
  createdBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoucherItem {
  medicineId: string;
  quantity: number;
  unitPrice: number;
  batchNumber?: string;
  expiryDate?: string;
}

export interface CreateVoucherRequest {
  type: VoucherType;
  supplierId?: string;
  note?: string;
  items: CreateVoucherItem[];
}

// ===== Pagination =====
export interface PageResp<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// ===== Dashboard =====
export interface InventoryDashboardResp {
  totalMedicines: number;
  totalSuppliers: number;
  lowStockCount: number;
  nearExpiryCount: number;
  expiredCount: number;
  totalStockValue: number;
}
