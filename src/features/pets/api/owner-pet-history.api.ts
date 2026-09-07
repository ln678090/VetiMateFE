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

interface HistoryParams {
  page: number;
  size: number;
}

function buildPetHistoryPath(petId: string, resource: 'appointment-statuses' | 'history'): string {
  const safePetId = encodeURIComponent(petId);

  return `/api/clinic/me/pets/${safePetId}/${resource}`;
}
export const ownerPetHistoryApi = {
  async getAppointmentStatuses(petId: string): Promise<OwnerAppointmentStatus[]> {
    const response = await api.get<ApiResponse<OwnerAppointmentStatus[]>>(
      buildPetHistoryPath(petId, 'appointment-statuses')
    );

    return response.data.data;
  },

  async getCompletedHistory(
    petId: string,
    params: HistoryParams
  ): Promise<SpringPage<OwnerVisitHistory>> {
    const response = await api.get<ApiResponse<SpringPage<OwnerVisitHistory>>>(
      buildPetHistoryPath(petId, 'history'),
      {
        params: {
          page: params.page,
          size: params.size,
        },
      }
    );

    return response.data.data;
  },
};
