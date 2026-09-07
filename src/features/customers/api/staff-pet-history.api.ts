import { api } from '@/lib/axios';
import type {
  OwnerAppointmentStatus,
  OwnerVisitHistory,
  SpringPage,
} from '@/types/owner-pet-history';

interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

function buildPath(
  customerId: string,
  petId: string,
  resource: 'appointment-statuses' | 'history'
): string {
  const safeCustomerId = encodeURIComponent(customerId);
  const safePetId = encodeURIComponent(petId);

  return `/api/clinic/staff/customers/${safeCustomerId}/pets/${safePetId}/${resource}`;
}

export const staffPetHistoryApi = {
  async getAppointmentStatuses(
    customerId: string,
    petId: string
  ): Promise<OwnerAppointmentStatus[]> {
    const response = await api.get<ApiResponse<OwnerAppointmentStatus[]>>(
      buildPath(customerId, petId, 'appointment-statuses')
    );

    return response.data.data;
  },

  async getCompletedHistory(
    customerId: string,
    petId: string,
    page: number,
    size: number
  ): Promise<SpringPage<OwnerVisitHistory>> {
    const response = await api.get<ApiResponse<SpringPage<OwnerVisitHistory>>>(
      buildPath(customerId, petId, 'history'),
      {
        params: {
          page,
          size,
        },
      }
    );

    return response.data.data;
  },
};
