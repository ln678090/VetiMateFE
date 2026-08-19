import { api } from '@/lib/axios';

import type {
  ExaminationHistoryItem,
  MedicalRecordResponse,
  MedicineOptionResponse,
  ReplacePrescriptionsRequest,
  SaveExaminationRequest,
} from '@/types/examination';

import type { SpringPage } from '@/types/clinic';

const EXAMINATION_BASE_URL = '/api/clinic/examinations';

function assertMedicalRecordResponse(payload: unknown): asserts payload is MedicalRecordResponse {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof (payload as MedicalRecordResponse).id !== 'string' ||
    (payload as MedicalRecordResponse).id.length === 0
  ) {
    throw new Error('Backend trả về hồ sơ khám không hợp lệ hoặc thiếu id.');
  }
}

function assertSpringPage<T>(payload: unknown): asserts payload is SpringPage<T> {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !Array.isArray((payload as SpringPage<T>).content)
  ) {
    throw new Error('Backend trả về dữ liệu phân trang không hợp lệ.');
  }
}

export const examinationApi = {
  async openExamination(appointmentId: string): Promise<MedicalRecordResponse> {
    const response = await api.post<MedicalRecordResponse>(
      `${EXAMINATION_BASE_URL}/appointments/${appointmentId}`
    );

    assertMedicalRecordResponse(response.data);
    return response.data;
  },

  async getMedicalRecord(medicalRecordId: string): Promise<MedicalRecordResponse> {
    const response = await api.get<MedicalRecordResponse>(
      `${EXAMINATION_BASE_URL}/${medicalRecordId}`
    );

    assertMedicalRecordResponse(response.data);
    return response.data;
  },

  async saveExamination(
    medicalRecordId: string,
    request: SaveExaminationRequest
  ): Promise<MedicalRecordResponse> {
    const response = await api.put<MedicalRecordResponse>(
      `${EXAMINATION_BASE_URL}/${medicalRecordId}`,
      request
    );

    assertMedicalRecordResponse(response.data);
    return response.data;
  },

  async replacePrescriptions(
    medicalRecordId: string,
    request: ReplacePrescriptionsRequest
  ): Promise<MedicalRecordResponse> {
    const response = await api.put<MedicalRecordResponse>(
      `${EXAMINATION_BASE_URL}/${medicalRecordId}/prescriptions`,
      request
    );

    assertMedicalRecordResponse(response.data);
    return response.data;
  },

  async completeExamination(medicalRecordId: string): Promise<MedicalRecordResponse> {
    const response = await api.post<MedicalRecordResponse>(
      `${EXAMINATION_BASE_URL}/${medicalRecordId}/complete`
    );

    assertMedicalRecordResponse(response.data);
    return response.data;
  },

  async getMedicines(): Promise<MedicineOptionResponse[]> {
    const response = await api.get<MedicineOptionResponse[]>(`${EXAMINATION_BASE_URL}/medicines`);

    if (!Array.isArray(response.data)) {
      throw new Error('Backend trả về danh sách thuốc không hợp lệ.');
    }

    return response.data;
  },

  async getHistory(page: number, size = 10): Promise<SpringPage<ExaminationHistoryItem>> {
    const response = await api.get<SpringPage<ExaminationHistoryItem>>(
      `${EXAMINATION_BASE_URL}/history`,
      {
        params: {
          page,
          size,
          sort: 'updatedAt,desc',
        },
      }
    );

    assertSpringPage<ExaminationHistoryItem>(response.data);
    return response.data;
  },
};
