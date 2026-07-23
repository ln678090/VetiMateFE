import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getActiveServices,
  getMyPets,
  createAppointment,
  getMyAppointments,
} from '../api/booking.api';
import { getApiErrorMessage } from '@/lib/axios';
import type { CreateAppointmentRequest } from '@/types/clinic';

import { getMyCustomer, getAvailableSlots } from '../api/booking.api';
export const CLINIC_QUERY_KEYS = {
  services: ['clinic', 'services'] as const,
  myCustomer: ['clinic', 'me', 'customer'] as const,
  slots: (serviceId: string, date: string) =>
    ['clinic', 'slots', serviceId, date] as const,
  pets: (customerId: string) => ['clinic', 'pets', customerId] as const,
  appointments: (customerId: string) =>
    ['clinic', 'appointments', customerId] as const,
};

export function useActiveServices() {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.services,
    queryFn: getActiveServices,
    staleTime: 5 * 60 * 1000, // services ít đổi -> cache 5 phút
  });
}

export function useMyPets(customerId: string) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.pets(customerId),
    queryFn: () => getMyPets(customerId),
    enabled: !!customerId,
  });
}

export function useMyAppointments(customerId: string) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.appointments(customerId),
    queryFn: () => getMyAppointments(customerId),
    enabled: !!customerId,
  });
}

export function useCreateAppointment(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAppointmentRequest) => createAppointment(body),
    onSuccess: () => {
      toast.success('Đặt lịch thành công!');
      qc.invalidateQueries({
        queryKey: CLINIC_QUERY_KEYS.appointments(customerId),
      });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useMyCustomer() {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.myCustomer,
    queryFn: getMyCustomer,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAvailableSlots(serviceId?: string, date?: string) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.slots(serviceId ?? '', date ?? ''),
    queryFn: () => getAvailableSlots(serviceId!, date!),
    enabled: !!serviceId && !!date, // chỉ gọi khi đã chọn dịch vụ + ngày
    staleTime: 30 * 1000,
  });
}
