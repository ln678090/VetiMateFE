import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/axios';
import { customerService, CustomerFormValues } from '@/services/customer.service';

export const CUSTOMER_QUERY_KEYS = {
  all: ['customers'] as const,
  list: (keyword: string, page: number, size: number) =>
    [...CUSTOMER_QUERY_KEYS.all, { keyword, page, size }] as const,
  detail: (id: string) => [...CUSTOMER_QUERY_KEYS.all, id] as const,
};

export function useCustomers(keyword: string, page: number, size: number) {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.list(keyword, page, size),
    queryFn: () => customerService.search(keyword, page, size),
    placeholderData: (prev) => prev,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.detail(id),
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormValues) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.all });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Lỗi khi tạo khách hàng'));
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CustomerFormValues }) =>
      customerService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(data.id) });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Lỗi khi cập nhật khách hàng'));
    },
  });
}
