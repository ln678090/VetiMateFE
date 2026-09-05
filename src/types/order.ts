import type { SpringPage } from './clinic';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItemResponse {
  id: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface OrderSummaryResponse {
  orderId: string;
  orderCode: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  statusDescription: string;
  itemCount: number;
  firstItemName: string | null;
  firstItemImage: string | null;
  recipientName: string;
  shippingAddress: string;
}

export interface TrackingStepResponse {
  status: OrderStatus | string;
  statusDescription: string;
  time: string;
  note: string | null;
}

export interface OrderDetailResponse {
  orderId: string;
  orderCode: string;
  status: OrderStatus;
  statusDescription: string;
  totalAmount: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  note: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
  tracking: TrackingStepResponse[];
}

export interface OrderTrackingTimelineResponse {
  orderId: string;
  orderCode: string;
  status: OrderStatus;
  statusDescription: string;
  total: number;
  updatedAt: string;
  tracking: TrackingStepResponse[];
}

export interface CancelOrderRequest {
  reason?: string;
}

export interface OrderFilterParams {
  status?: OrderStatus;
  page?: number;
  size?: number;
}

export type OrderPage = SpringPage<OrderSummaryResponse>;

/** Cấu hình hiển thị màu sắc và nhãn của từng trạng thái đơn hàng */
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    color: string;
    badgeBg: string;
    badgeBorder: string;
    dotColor: string;
  }
> = {
  PENDING: {
    label: 'Chờ xác nhận',
    variant: 'outline',
    color: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    variant: 'outline',
    color: 'text-blue-700 dark:text-blue-300',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
    badgeBorder: 'border-blue-200 dark:border-blue-800',
    dotColor: 'bg-blue-500',
  },
  PREPARING: {
    label: 'Đang chuẩn bị hàng',
    variant: 'outline',
    color: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/50',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    dotColor: 'bg-purple-500',
  },
  SHIPPING: {
    label: 'Đang giao hàng',
    variant: 'outline',
    color: 'text-sky-700 dark:text-sky-300',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/50',
    badgeBorder: 'border-sky-200 dark:border-sky-800',
    dotColor: 'bg-sky-500',
  },
  DELIVERED: {
    label: 'Đã giao thành công',
    variant: 'outline',
    color: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Đã hủy',
    variant: 'destructive',
    color: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/50',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    dotColor: 'bg-rose-500',
  },
};
