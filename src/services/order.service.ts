import { Order } from '@/types/order';
import { CheckoutInput } from '@/schemas/checkout.schema';
import { api } from '@/lib/axios';

export const orderService = {
  checkout: async (data: CheckoutInput & { items: { productId: string; quantity: number }[] }): Promise<Order> => {
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
  }
};
