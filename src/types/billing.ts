export type InvoiceType = 'CLINIC' | 'SHOP' | 'MIXED';
export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';
export type InvoiceItemType = 'SERVICE' | 'PRODUCT' | 'MEDICINE' | 'UNKNOWN';
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO';

export interface ClinicInvoiceItemDto {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: InvoiceItemType;
}

export interface ClinicInvoiceDto {
  id: string;
  invoiceCode: string;
  customerName?: string;
  customerPhone?: string;
  petName?: string;
  type: InvoiceType;
  status: InvoiceStatus;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  paidAt?: string;
  note?: string;
  createdAt: string;
  items: ClinicInvoiceItemDto[];
}

export interface CreateInvoiceItemReq {
  serviceId?: string;
  productId?: string;
  medicineId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateClinicInvoiceReq {
  customerId: string;
  petId?: string;
  note?: string;
  items: CreateInvoiceItemReq[];
}

export interface PayClinicInvoiceReq {
  paymentMethod: PaymentMethod;
}
