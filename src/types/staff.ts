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
