import { api } from '@/lib/axios';
import { ApiResp } from '@/types';

export interface CartItemReq {
  productId: string;
  quantity: number;
}

export interface POSCheckoutRequest {
  paymentMethod: string;
  note?: string;
  items: CartItemReq[];
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  code: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  createdAt: string;
  paymentMethod: string;
  shippingAddress?: string;
  note?: string;
  items: OrderItemResponse[];
}

export const orderApi = {
  posCheckout: async (data: POSCheckoutRequest) => {
    const res = await api.post<ApiResp<OrderResponse>>('/api/orders/pos-checkout', data);
    return res.data;
  },
  getOrderById: (id: string) => {
    return api.get<OrderResponse>(`/api/orders/${id}`);
  },
  getPosHistory: async (params?: { startDate?: string; endDate?: string }) => {
    const res = await api.get<OrderResponse[]>('/api/orders/pos-history', { params });
    return res.data;
  },
};
