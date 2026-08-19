import { ProductResp } from "./shop";

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface ShopOrderItemResp {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ShopOrderResp {
  id: string;
  orderCode: string;
  userId?: string;
  userName?: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  cancellationRequested?: boolean;
  cancellationReason?: string;
  items: ShopOrderItemResp[];
}

export interface ShopOrderListResp {
  items: ShopOrderResp[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Re-export ProductListResp for Inventory since it's used directly
export type { ProductListResp } from "./shop";

export type StaffRoleType =
  | 'DOCTOR'
  | 'RECEPTIONIST'
  | 'MANAGER'
  | 'ACCOUNTANT'
  | 'WAREHOUSE'
  | 'SHOP_STAFF';

export interface StaffResponse {
  id: string;
  userId: string | null;
  fullName: string;
  phone: string | null;
  roleType: StaffRoleType;
  licenseNumber: string | null;
  baseSalary: number;
  commissionRate: number;
  active: boolean;
  createdAt: string;
}

export interface CreateStaffRequest {
  userId: string | null;
  fullName: string;
  phone: string | null;
  roleType: StaffRoleType;
  licenseNumber: string | null;
  baseSalary: number;
  commissionRate: number;
}

export interface UpdateStaffRequest extends CreateStaffRequest {
  active: boolean;
}

export interface StaffFilters {
  keyword?: string;
  roleType?: StaffRoleType;
  active?: boolean;
  page: number;
  size: number;
}

export interface SpringPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
