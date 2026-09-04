import { Order } from '@/types/order';
import { CheckoutInput } from '@/schemas/checkout.schema';
import { api } from '@/lib/axios';

export const orderService = {
  checkout: async (
    data: CheckoutInput & { items: { productId: string; quantity: number }[] }
  ): Promise<Order> => {
    const response = await api.post<Order>('/api/orders/checkout', data);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/api/orders/my-orders');
    return response.data; // or response.data.data
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/api/orders/${id}`);
    return response.data; // or response.data.data
  },

  getAllShopOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/api/orders');
    return response.data;
  },

  updateOrderStatus: async ({ id, status }: { id: string; status: string }): Promise<Order> => {
    const response = await api.patch<Order>(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  cancelRequest: async ({ id, reason }: { id: string; reason: string }): Promise<Order> => {
    const response = await api.post<Order>(`/api/orders/${id}/cancel-request`, { reason });
    return response.data;
  },

  processCancelRequest: async ({ id, accept }: { id: string; accept: boolean }): Promise<Order> => {
    const response = await api.post<Order>(`/api/orders/${id}/process-cancel-request`, { accept });
    return response.data;
  },

  reviewOrder: async ({ id, reviews }: { id: string; reviews: { productId: string; rating: number; comment?: string }[] }): Promise<Order> => {
    const response = await api.post<Order>(`/api/orders/${id}/review`, { reviews });
    return response.data;
  }

};
