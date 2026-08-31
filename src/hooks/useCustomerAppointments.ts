import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment.service';

export const CUSTOMER_APPOINTMENTS_QUERY_KEYS = {
  all: ['customer-appointments'] as const,
  byCustomer: (customerId: string, page: number, size: number) =>
    [...CUSTOMER_APPOINTMENTS_QUERY_KEYS.all, { customerId, page, size }] as const,
};

export function useCustomerAppointments(customerId: string, page = 0, size = 100) {
  return useQuery({
    queryKey: CUSTOMER_APPOINTMENTS_QUERY_KEYS.byCustomer(customerId, page, size),
    queryFn: () => appointmentService.getByCustomer(customerId, page, size),
    enabled: !!customerId,
  });
}
