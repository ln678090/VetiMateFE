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
  sku?: string;
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

// ===== Warehouse =====
export type WarehouseLocation = 'STORAGE' | 'DOCTOR';

// ===== Stock Batch =====
export interface StockBatchResp {
  id: string;
  batchCode: string;
  warehouse?: WarehouseLocation;
  quantity: number;
  remainingQty: number;
  importPrice: number;
  expiryDate: string;
  receivedAt: string;
  medicineId?: string;
  medicineName?: string;
  productId?: string;
  productName?: string;
  supplierId?: string;
  supplierName?: string;
  isExpired: boolean;
  isNearExpiry: boolean;
}

// ===== Voucher =====
export type VoucherType = 'IMPORT' | 'EXPORT' | 'TRANSFER' | 'STOCKTAKE';
export type VoucherStatus = 'PENDING' | 'APPROVED' | 'CANCELLED';

export interface VoucherItem {
  id?: string;
  medicineId?: string;
  medicineName?: string;
  productId?: string;
  productName?: string;
  batchCode?: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface StockVoucherResp {
  id: string;
  type: VoucherType;
  status: VoucherStatus;
  sourceWarehouse?: WarehouseLocation;
  destinationWarehouse?: WarehouseLocation;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  note?: string;
  items: VoucherItem[];
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
  sourceWarehouse?: WarehouseLocation;
  destinationWarehouse?: WarehouseLocation;
  note?: string;
  items: VoucherItemRequest[];
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
  pendingVouchers?: number;
}
