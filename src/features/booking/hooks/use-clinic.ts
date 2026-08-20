import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getActiveServices,
  getMyPets,
  createAppointment,
  getMyAppointments,
  createPet,
  getMyCustomer,
  updateAppointmentStatus,
  getManagementAppointments,
} from '../api/booking.api';
import type {
  AppointmentStatus,
  CreateAppointmentRequest,
  CreatePetRequest,
  CustomerDto,
  ManagementAppointmentParams,
  PetDto,
} from '@/types/clinic';

const CLINIC_QUERY_KEYS = {
  services: ['clinic', 'services'] as const,
  pets: (customerId: string) => ['clinic', 'pets', customerId] as const,
  appointments: (customerId: string) => ['clinic', 'appointments', customerId] as const,
  myCustomer: () => ['clinic', 'me', 'customer'] as const,
  managementAppointments: (params: ManagementAppointmentParams) =>
    [
      'clinic',
      'management',
      'appointments',
      params.date,
      params.status ?? 'ALL',
      params.page ?? 0,
      params.size ?? 20,
    ] as const,
};

// Danh sách dịch vụ đang mở bán:console.warn();

export function useActiveServices() {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.services,
    queryFn: getActiveServices,
    staleTime: 60_000,
  });
}

// Danh sách pet của khách hàng (chỉ chạy khi có customerId)
export function useMyPets(customerId: string | undefined) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.pets(customerId ?? ''),
    queryFn: () => getMyPets(customerId as string),
    enabled: Boolean(customerId),
    staleTime: 60_000,
  });
}

// Lịch sử đặt lịch của khách hàng
export function useMyAppointments(customerId: string | undefined) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.appointments(customerId ?? ''),
    queryFn: () => getMyAppointments(customerId as string),
    enabled: Boolean(customerId),
    staleTime: 60_000,
  });
}

// Tạo lịch hẹn -> refetch lại danh sách lịch của khách
export function useCreateAppointment(customerId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAppointmentRequest) => createAppointment(body),
    onSuccess: () => {
      if (customerId) {
        queryClient.invalidateQueries({
          queryKey: CLINIC_QUERY_KEYS.appointments(customerId),
        });
      }
    },
  });
}

export function useCreatePet(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation<PetDto, Error, CreatePetRequest>({
    mutationFn: (body) => createPet(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CLINIC_QUERY_KEYS.pets(customerId),
      });
    },
  });
}

export function useMyCustomer() {
  return useQuery<CustomerDto>({
    queryKey: CLINIC_QUERY_KEYS.myCustomer(),
    queryFn: getMyCustomer,
    staleTime: 5 * 60 * 1000, // 5 phút - customer ít đổi
    retry: 1,
  });
}

// ============================================================
// THÊM IMPORT (đặt cùng chỗ imports khác ở đầu file)
// ============================================================
import { getAvailableSlots, type AvailableSlotResponse } from '../api/booking.api';

// ============================================================
// THÊM HOOK (đặt ở cuối file)
// ============================================================

/**
 * Hook lấy khung giờ trống cho dịch vụ trong ngày
 * @param serviceId - UUID của dịch vụ
 * @param date - Ngày cần check, format yyyy-MM-dd
 */
export function useAvailableSlots(serviceId: string | undefined, date: string | undefined) {
  return useQuery<AvailableSlotResponse[], Error>({
    queryKey: ['clinic', 'slots', serviceId ?? '', date ?? ''],
    queryFn: () => getAvailableSlots(serviceId!, date!),
    enabled: !!serviceId && !!date && date.length === 10,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

// Re-export type để component khác dùng
export type { AvailableSlotResponse };

import { updatePet, deletePet, getPetById } from '../api/booking.api';
import type { UpdatePetRequest } from '@/types/clinic';
// ============ QUERY KEYS ============
// Thêm vào CLINIC_QUERY_KEYS object (nếu có) hoặc tạo mới:
export const PET_QUERY_KEYS = {
  all: ['clinic', 'pets'] as const,
  byCustomer: (customerId: string) => [...PET_QUERY_KEYS.all, customerId] as const,
  byId: (petId: string) => [...PET_QUERY_KEYS.all, 'detail', petId] as const,
};

// ============ GET SINGLE PET ============
export function usePet(petId: string | undefined) {
  return useQuery<PetDto, Error>({
    queryKey: PET_QUERY_KEYS.byId(petId ?? ''),
    queryFn: () => getPetById(petId!),
    enabled: !!petId,
  });
}

// ============ UPDATE PET ============
export function useUpdatePet(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation<PetDto, Error, { petId: string; data: UpdatePetRequest }>({
    mutationFn: ({ petId, data }) => updatePet(petId, data),
    onSuccess: (_, variables) => {
      // Invalidate list + detail
      queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.byCustomer(customerId) });
      queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.byId(variables.petId) });
    },
  });
}

export function useManagementAppointments(params: ManagementAppointmentParams) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.managementAppointments(params),
    queryFn: () => getManagementAppointments(params),
    enabled: params.date.length === 10,
    staleTime: 15_000,
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: AppointmentStatus }) =>
      updateAppointmentStatus(appointmentId, status),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['clinic', 'management', 'appointments'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['clinic', 'appointments'],
        }),
      ]);
    },
  });
}
