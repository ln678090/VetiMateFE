import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queueService } from '@/services/queue.service';
import { QueueStatusUpdateRequest, QueueTicketRequest, QueueType } from '@/types/queue';
import { toast } from 'sonner';

export const QUEUE_QUERY_KEY = 'queue-tickets';

export const useQueue = (type: QueueType) => {
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUEUE_QUERY_KEY, type],
    queryFn: () => queueService.getTodayQueue(type),
    refetchInterval: 10000, // Tự động refetch mỗi 10 giây để update board
  });

  const createTicketMutation = useMutation({
    mutationFn: (data: QueueTicketRequest) => queueService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUEUE_QUERY_KEY, type] });
      toast.success('Đã cấp số thứ tự thành công');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cấp số');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: QueueStatusUpdateRequest }) =>
      queueService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUEUE_QUERY_KEY, type] });
      toast.success('Cập nhật trạng thái thành công');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });

  return {
    tickets,
    isLoading,
    error,
    refetch,
    createTicket: createTicketMutation.mutate,
    isCreating: createTicketMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
