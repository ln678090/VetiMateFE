import { api } from '@/lib/axios';
import { ApiResp } from '@/types/api';
import { ShopOrderResp, ShopOrderListResp } from '@/types/staff'; // Reuse staff DTOs since they are the same

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  note?: string;
  items: OrderItemRequest[];
}

export const orderService = {
  createOrder: async (payload: CreateOrderRequest) => {
    const { data } = await api.post<ApiResp<ShopOrderResp>>(
      '/api/orders',
      payload
    );
    return data;
  },

  getMyOrders: async (page = 0, size = 20) => {
    const { data } = await api.get<ApiResp<ShopOrderListResp>>(
      `/api/orders?page=${page}&size=${size}`
    );
    return data;
  },

  getOrderById: async (id: string) => {
    const { data } = await api.get<ApiResp<ShopOrderResp>>(
      `/api/orders/${id}`
    );
    return data;
  },

  cancelOrder: async (id: string, reason?: string) => {
    const { data } = await api.post<ApiResp<ShopOrderResp>>(
      `/api/orders/${id}/cancel`,
      { reason }
    );
    return data;
  },
};
