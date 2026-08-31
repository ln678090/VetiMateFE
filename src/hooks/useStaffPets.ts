import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/axios';
import { staffPetService } from '@/services/staff-pet.service';
import type { CreatePetRequest, UpdatePetRequest } from '@/types/clinic';

export const STAFF_PET_QUERY_KEYS = {
  all: ['staff-pets'] as const,
  byCustomer: (customerId: string, page: number, size: number) =>
    [...STAFF_PET_QUERY_KEYS.all, { customerId, page, size }] as const,
};

export function useStaffPets(customerId: string, page = 0, size = 100) {
  return useQuery({
    queryKey: STAFF_PET_QUERY_KEYS.byCustomer(customerId, page, size),
    queryFn: () => staffPetService.getByCustomer(customerId, page, size),
    enabled: !!customerId,
  });
}

export function useCreateStaffPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePetRequest) => staffPetService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STAFF_PET_QUERY_KEYS.all });
      toast.success('Thêm thú cưng thành công');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Lỗi khi thêm thú cưng'));
    },
  });
}

export function useUpdateStaffPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetRequest }) =>
      staffPetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_PET_QUERY_KEYS.all });
      toast.success('Cập nhật thú cưng thành công');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Lỗi khi cập nhật thú cưng'));
    },
  });
}
