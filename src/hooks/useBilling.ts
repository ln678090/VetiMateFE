import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '@/services/billing.service';
import { CreateClinicInvoiceReq, PayClinicInvoiceReq } from '@/types/billing';
import { toast } from 'sonner';
import { errors } from 'jose';

export const BILLING_QUERY_KEY = 'clinic-invoices';

export const useBilling = () => {
  const queryClient = useQueryClient();

  const {
    data: invoices = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [BILLING_QUERY_KEY],
    queryFn: () => billingService.getAllInvoices(),
  });

  const createInvoiceMutation = useMutation({
    mutationFn: (data: CreateClinicInvoiceReq) => billingService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BILLING_QUERY_KEY] });
      toast.success('Đã tạo hóa đơn thành công');
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Có lỗi xảy ra khi tạo hóa đơn');
    },
  });

  const payInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayClinicInvoiceReq }) =>
      billingService.payInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BILLING_QUERY_KEY] });
      toast.success('Thanh toán thành công');
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Có lỗi xảy ra khi thanh toán');
    },
  });

  const cancelInvoiceMutation = useMutation({
    mutationFn: (id: string) => billingService.cancelInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BILLING_QUERY_KEY] });
      toast.success('Hủy hóa đơn thành công');
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Có lỗi xảy ra khi hủy hóa đơn');
    },
  });

  return {
    invoices,
    isLoading,
    error,
    refetch,
    createInvoice: createInvoiceMutation.mutate,
    isCreating: createInvoiceMutation.isPending,
    payInvoice: payInvoiceMutation.mutate,
    isPaying: payInvoiceMutation.isPending,
    cancelInvoice: cancelInvoiceMutation.mutate,
    isCanceling: cancelInvoiceMutation.isPending,
  };
};
