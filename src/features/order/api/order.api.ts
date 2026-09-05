import { api, unwrap } from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type {
  CancelOrderRequest,
  OrderDetailResponse,
  OrderFilterParams,
  OrderPage,
  OrderTrackingTimelineResponse,
} from '@/types/order';

export const orderApi = {
  /** Lấy danh sách đơn hàng của khách hàng hiện tại */
  getMyOrders(params?: OrderFilterParams): Promise<OrderPage> {
    return unwrap<OrderPage>(
      api.get(API_ROUTES.order.customerOrders, {
        params: {
          status: params?.status,
          page: params?.page ?? 0,
          size: params?.size ?? 10,
        },
      })
    );
  },

  /** Lấy chi tiết đơn hàng */
  getOrderDetail(orderId: string): Promise<OrderDetailResponse> {
    return unwrap<OrderDetailResponse>(
      api.get(`${API_ROUTES.order.customerOrders}/${orderId}`)
    );
  },

  /** Lấy timeline theo dõi đơn hàng */
  getOrderTracking(orderId: string): Promise<OrderTrackingTimelineResponse> {
    return unwrap<OrderTrackingTimelineResponse>(
      api.get(`${API_ROUTES.order.customerOrders}/${orderId}/tracking`)
    );
  },

  /** Khách hàng yêu cầu hủy đơn hàng */
  cancelOrder(orderId: string, request?: CancelOrderRequest): Promise<OrderDetailResponse> {
    return unwrap<OrderDetailResponse>(
      api.post(`${API_ROUTES.order.customerOrders}/${orderId}/cancel`, request ?? {})
    );
  },

  /** Đặt đơn hàng mới từ giỏ hàng */
  createOrder(request: {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    paymentMethod?: string;
    note?: string;
    items: { productId: string; quantity: number }[];
  }): Promise<OrderDetailResponse> {
    return unwrap<OrderDetailResponse>(
      api.post(API_ROUTES.order.customerOrders, request)
    );
  },
};
