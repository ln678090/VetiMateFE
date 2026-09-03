import { api } from '@/lib/axios';
import type {
  CompleteServiceIndicationRequest,
  CreateServiceIndicationRequest,
  ServiceIndicationResponse,
} from '@/types/service-indication';

const BASE_PATH = '/api/clinic/examinations';

function encodeId(id: string): string {
  return encodeURIComponent(id);
}

export const serviceIndicationApi = {
  async getAll(medicalRecordId: string): Promise<ServiceIndicationResponse[]> {
    const response = await api.get<ServiceIndicationResponse[]>(
      `${BASE_PATH}/${encodeId(medicalRecordId)}/indications`
    );

    return response.data;
  },

  async create(
    medicalRecordId: string,
    request: CreateServiceIndicationRequest
  ): Promise<ServiceIndicationResponse> {
    const response = await api.post<ServiceIndicationResponse>(
      `${BASE_PATH}/${encodeId(medicalRecordId)}/indications`,
      request
    );

    return response.data;
  },

  async complete(
    indicationId: string,
    request: CompleteServiceIndicationRequest
  ): Promise<ServiceIndicationResponse> {
    const response = await api.put<ServiceIndicationResponse>(
      `${BASE_PATH}/indications/${encodeId(indicationId)}/complete`,
      request
    );

    return response.data;
  },

  async cancel(indicationId: string): Promise<ServiceIndicationResponse> {
    const response = await api.delete<ServiceIndicationResponse>(
      `${BASE_PATH}/indications/${encodeId(indicationId)}`
    );

    return response.data;
  },
};
