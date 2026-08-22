import { api } from '@/lib/axios';

import type { SpringPage } from '@/types/clinic';
import type {
  ExaminationHistoryItem,
  MedicalRecordResponse,
  MedicineOptionResponse,
  ReplacePrescriptionsRequest,
  SaveExaminationRequest,
} from '@/types/examination';

const BASE_URL = '/api/clinic/examinations';

function encodeId(id: string): string {
  return encodeURIComponent(id);
}

function assertMedicalRecord(value: unknown): asserts value is MedicalRecordResponse {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Backend trả về hồ sơ khám không hợp lệ.');
  }

  const record = value as Partial<MedicalRecordResponse>;

  if (
    typeof record.id !== 'string' ||
    typeof record.appointmentId !== 'string' ||
    typeof record.petId !== 'string' ||
    typeof record.doctorId !== 'string' ||
    typeof record.healthStatus !== 'string' ||
    typeof record.status !== 'string' ||
    !Array.isArray(record.prescriptions)
  ) {
    throw new Error('Backend trả về hồ sơ khám thiếu dữ liệu.');
  }
}

function assertPage<T>(value: unknown): asserts value is SpringPage<T> {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Backend trả về dữ liệu phân trang không hợp lệ.');
  }

  const page = value as Partial<SpringPage<T>>;

  if (
    !Array.isArray(page.content) ||
    typeof page.number !== 'number' ||
    typeof page.size !== 'number' ||
    typeof page.totalElements !== 'number' ||
    typeof page.totalPages !== 'number'
  ) {
    throw new Error('Backend trả về dữ liệu phân trang không đầy đủ.');
  }
}

export const examinationApi = {
  async openExamination(appointmentId: string): Promise<MedicalRecordResponse> {
    const response = await api.post<MedicalRecordResponse>(
      `${BASE_URL}/appointments/${encodeId(appointmentId)}`
    );

    assertMedicalRecord(response.data);

    return response.data;
  },

  async getMedicalRecord(medicalRecordId: string): Promise<MedicalRecordResponse> {
    const response = await api.get<MedicalRecordResponse>(
      `${BASE_URL}/${encodeId(medicalRecordId)}`
    );

    assertMedicalRecord(response.data);

    return response.data;
  },

  async saveExamination(
    medicalRecordId: string,
    request: SaveExaminationRequest
  ): Promise<MedicalRecordResponse> {
    const response = await api.put<MedicalRecordResponse>(
      `${BASE_URL}/${encodeId(medicalRecordId)}`,
      request
    );

    assertMedicalRecord(response.data);

    return response.data;
  },

  async replacePrescriptions(
    medicalRecordId: string,
    request: ReplacePrescriptionsRequest
  ): Promise<MedicalRecordResponse> {
    const response = await api.put<MedicalRecordResponse>(
      `${BASE_URL}/${encodeId(medicalRecordId)}/prescriptions`,
      request
    );

    assertMedicalRecord(response.data);

    return response.data;
  },

  async completeExamination(medicalRecordId: string): Promise<MedicalRecordResponse> {
    const response = await api.post<MedicalRecordResponse>(
      `${BASE_URL}/${encodeId(medicalRecordId)}/complete`
    );

    assertMedicalRecord(response.data);

    return response.data;
  },

  async getMedicines(): Promise<MedicineOptionResponse[]> {
    const response = await api.get<MedicineOptionResponse[]>(`${BASE_URL}/medicines`);

    if (!Array.isArray(response.data)) {
      throw new Error('Backend trả về danh sách thuốc không hợp lệ.');
    }

    return response.data;
  },

  async getHistory(page: number, size = 10): Promise<SpringPage<ExaminationHistoryItem>> {
    const response = await api.get<SpringPage<ExaminationHistoryItem>>(`${BASE_URL}/history`, {
      params: {
        page,
        size,
        sort: 'updatedAt,desc',
      },
    });

    assertPage<ExaminationHistoryItem>(response.data);

    return response.data;
  },
};
