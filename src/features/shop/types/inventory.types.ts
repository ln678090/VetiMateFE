export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface StockVoucherResp {
  id: string;
  type: string;
  status: string;
  createdBy: string;
  approvedBy?: string;
  note?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface ImportVoucherItemReq {
  productId?: string;
  medicineId?: string;
  supplierId?: string;
  batchCode?: string;
  quantity: number;
  importPrice: number;
  expiryDate?: string;
  note?: string;
}

export interface CreateImportVoucherReq {
  note?: string;
  items: ImportVoucherItemReq[];
}
