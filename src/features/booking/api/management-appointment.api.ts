import { api } from '@/lib/axios';

interface ApiResp<T> {
  message?: string;
  data: T;
}

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export interface ManagementPet {
  id: string;
  name: string;
  species: string;
  ownerFullName?: string;
  customerFullName?: string;
}

export interface ClinicService {
  id: string;
  name: string;
  durationMin: number;
  isActive: boolean;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface CreateAppointmentInput {
  petId: string;
  serviceId: string;
  startAt: string;
  note?: string;
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  serviceId: string;
  serviceName: string;
  startAt: string;
  endAt: string;
  status: string;
}

export const managementAppointmentApi = {
  async searchPets(keyword: string): Promise<ManagementPet[]> {
    const response = await api.get<ApiResp<SpringPage<ManagementPet>>>(
      '/api/clinic/management/pets',
      {
        params: {
          keyword: keyword || undefined,
          deleted: false,
          page: 0,
          size: 20,
          sort: 'name,asc',
        },
      }
    );

    return response.data.data.content;
  },

  async getServices(): Promise<ClinicService[]> {
    const response = await api.get<ApiResp<SpringPage<ClinicService>>>('/api/clinic/services', {
      params: {
        activeOnly: true,
        page: 0,
        size: 100,
      },
    });

    return response.data.data.content;
  },

  async getAvailableSlots(serviceId: string, date: string): Promise<AvailableSlot[]> {
    const response = await api.get<ApiResp<AvailableSlot[]>>(
      `/api/clinic/services/${serviceId}/available-slots`,
      { params: { date } }
    );

    return response.data.data;
  },

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const response = await api.post<ApiResp<Appointment>>(
      '/api/clinic/appointments/management',
      input
    );

    return response.data.data;
  },

  async updateStatus(
    appointmentId: string,
    status: 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW'
  ): Promise<Appointment> {
    const response = await api.patch<ApiResp<Appointment>>(
      `/api/clinic/appointments/${appointmentId}/status`,
      { status }
    );

    return response.data.data;
  },
};
