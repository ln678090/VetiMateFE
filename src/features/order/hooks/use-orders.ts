import { getApiErrorMessage } from '@/lib/axios';
import { QUERY_KEYS } from '@/lib/constants';
import type { CancelOrderRequest, OrderFilterParams } from '@/types/order';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { orderApi } from '../api/order.api';

/** Hook lấy danh sách đơn hàng của tôi */
export function useMyOrders(params?: OrderFilterParams) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.list(params),
    queryFn: () => orderApi.getMyOrders(params),
  });
}

/** Hook lấy chi tiết đơn hàng */
export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(orderId),
    queryFn: () => orderApi.getOrderDetail(orderId),
    enabled: Boolean(orderId),
  });
}

/** Hook lấy timeline theo dõi đơn hàng */
export function useOrderTracking(orderId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.tracking(orderId),
    queryFn: () => orderApi.getOrderTracking(orderId),
    enabled: Boolean(orderId),
    refetchInterval: 30_000, // Tự động làm mới mỗi 30s để cập nhật trạng thái mới nhất
  });
}

/** Hook hủy đơn hàng */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      request,
    }: {
      orderId: string;
      request?: CancelOrderRequest;
    }) => orderApi.cancelOrder(orderId, request),
    onSuccess: (data) => {
      toast.success('Hủy đơn hàng thành công', {
        description: `Đơn hàng #${data.orderCode} đã được chuyển sang trạng thái Đã hủy.`,
      });
      // Invalidate các query liên quan để cập nhật dữ liệu mới nhất
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Không thể hủy đơn hàng');
      toast.error('Lỗi khi hủy đơn hàng', { description: message });
    },
  });
}
