import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createAppointment,
  createPet,
  getActiveServices,
  getAvailableSlots,
  getDoctorWorklist,
  getManagementAppointments,
  getMyAppointments,
  getMyCustomer,
  getMyPets,
  getPetById,
  updateAppointmentStatus,
  updateAppointmentCallStatus,
  updatePet,
  type AvailableSlotResponse,
} from '../api/booking.api';

import type {
  AppointmentStatus,
  CreateAppointmentRequest,
  CreatePetRequest,
  CustomerDto,
  ManagementAppointmentParams,
  PetDto,
  UpdatePetRequest,
} from '@/types/clinic';

interface DoctorWorklistParams {
  date: string;
  page: number;
  size: number;
}

const CLINIC_QUERY_KEYS = {
  services: ['clinic', 'services'] as const,

  pets: (customerId: string) => ['clinic', 'pets', customerId] as const,

  pet: (petId: string) => ['clinic', 'pets', 'detail', petId] as const,

  appointments: (customerId: string) => ['clinic', 'appointments', customerId] as const,

  myCustomer: () => ['clinic', 'me', 'customer'] as const,

  availableSlots: (serviceId: string, date: string) =>
    ['clinic', 'slots', serviceId, date] as const,

  managementAppointments: (params: ManagementAppointmentParams) =>
    [
      'clinic',
      'management',
      'appointments',
      params.startDate,
      params.endDate,
      params.status ?? 'ALL',
      params.page ?? 0,
      params.size ?? 20,
    ] as const,

  doctorWorklist: (params: DoctorWorklistParams) =>
    ['doctor', 'examinations', params.date, params.page, params.size] as const,
};

export const PET_QUERY_KEYS = {
  all: ['clinic', 'pets'] as const,

  byCustomer: (customerId: string) => [...PET_QUERY_KEYS.all, customerId] as const,

  byId: (petId: string) => [...PET_QUERY_KEYS.all, 'detail', petId] as const,
};

export function useActiveServices() {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.services,
    queryFn: getActiveServices,
    staleTime: 60_000,
  });
}

export function useMyPets(customerId: string | undefined) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.pets(customerId ?? ''),

    queryFn: () => {
      if (!customerId) {
        throw new Error('Thiếu mã khách hàng.');
      }

      return getMyPets(customerId);
    },

    enabled: Boolean(customerId),
    staleTime: 60_000,
  });
}

export function usePet(petId: string | undefined) {
  return useQuery<PetDto, Error>({
    queryKey: CLINIC_QUERY_KEYS.pet(petId ?? ''),

    queryFn: () => {
      if (!petId) {
        throw new Error('Thiếu mã thú cưng.');
      }

      return getPetById(petId);
    },

    enabled: Boolean(petId),
    staleTime: 60_000,
  });
}

export function useMyAppointments(customerId: string | undefined) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.appointments(customerId ?? ''),

    queryFn: () => {
      if (!customerId) {
        throw new Error('Thiếu mã khách hàng.');
      }

      return getMyAppointments(customerId);
    },

    enabled: Boolean(customerId),
    staleTime: 60_000,
  });
}

export function useMyCustomer() {
  return useQuery<CustomerDto, Error>({
    queryKey: CLINIC_QUERY_KEYS.myCustomer(),

    queryFn: getMyCustomer,

    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useCreateAppointment(customerId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAppointmentRequest) => createAppointment(request),

    onSuccess: async () => {
      if (!customerId) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: CLINIC_QUERY_KEYS.appointments(customerId),
      });
    },
  });
}

export function useCreatePet(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation<PetDto, Error, CreatePetRequest>({
    mutationFn: (request) => createPet(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CLINIC_QUERY_KEYS.pets(customerId),
      });
    },
  });
}

export function useUpdatePet(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    PetDto,
    Error,
    {
      petId: string;
      data: UpdatePetRequest;
    }
  >({
    mutationFn: ({ petId, data }) => updatePet(petId, data),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CLINIC_QUERY_KEYS.pets(customerId),
        }),

        queryClient.invalidateQueries({
          queryKey: CLINIC_QUERY_KEYS.pet(variables.petId),
        }),
      ]);
    },
  });
}

export function useAvailableSlots(serviceId: string | undefined, date: string | undefined) {
  return useQuery<AvailableSlotResponse[], Error>({
    queryKey: CLINIC_QUERY_KEYS.availableSlots(serviceId ?? '', date ?? ''),

    queryFn: () => {
      if (!serviceId || !date) {
        throw new Error('Thiếu dịch vụ hoặc ngày khám.');
      }

      return getAvailableSlots(serviceId, date);
    },

    enabled: Boolean(serviceId) && Boolean(date) && date?.length === 10,

    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useManagementAppointments(params: ManagementAppointmentParams) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.managementAppointments(params),

    queryFn: () => getManagementAppointments(params),

    enabled: Boolean(params.startDate && params.endDate),
    staleTime: 15_000,

    placeholderData: (previousData) => previousData,
  });
}

export function useDoctorWorklist(params: DoctorWorklistParams) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.doctorWorklist(params),

    queryFn: () => getDoctorWorklist(params),

    enabled: params.date.length === 10,
    staleTime: 30_000,
    retry: 1,

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

        queryClient.invalidateQueries({
          queryKey: ['doctor', 'examinations'],
        }),
      ]);
    },
  });
}

export function useUpdateAppointmentCallStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, isCalled }: { appointmentId: string; isCalled: boolean }) =>
      updateAppointmentCallStatus(appointmentId, isCalled),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['clinic', 'management', 'appointments'],
        }),
      ]);
    },
  });
}

export type { AvailableSlotResponse };
