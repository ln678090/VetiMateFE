import { api } from '@/lib/axios';
import type { SpringPage } from '@/types/clinic';
import type {
  DrugSafetyCheckResponse,
  LabResultItem,
  LabResultResponse,
  MedicalProtocol,
  ProtocolComplianceResponse,
  MedicalIncident,
  MedicalIncidentRequest,
  WalkInExamRequest,
  MedicalRecordResponse,
  PetEmrHistoryResponse,
  ServiceIndicationResponse,
  SlaReminderResponse,
} from '@/types/examination';

export const doctorClinicalApi = {
  // 1. Kiểm tra tương tác thuốc & tiền sử dị ứng
  async checkDrugSafety(petId: string, medicineIds: string[]): Promise<DrugSafetyCheckResponse> {
    const res = await api.post<DrugSafetyCheckResponse>('/api/clinic/doctor/safety/check', {
      petId,
      medicineIds,
    });
    return res.data;
  },

  // 2. Chỉ số xét nghiệm máu / nước tiểu (Lab Results)
  async getLabResults(recordId: string): Promise<LabResultResponse[]> {
    const res = await api.get<LabResultResponse[]>(`/api/clinic/doctor/records/${recordId}/labs`);
    return res.data;
  },

  async saveLabResults(recordId: string, items: LabResultItem[]): Promise<LabResultResponse[]> {
    const res = await api.post<LabResultResponse[]>(`/api/clinic/doctor/records/${recordId}/labs`, {
      items,
    });
    return res.data;
  },

  // 3. Phác đồ chuẩn & Chấm điểm tuân thủ
  async getProtocols(): Promise<MedicalProtocol[]> {
    const res = await api.get<MedicalProtocol[]>('/api/clinic/doctor/protocols');
    return res.data;
  },

  async evaluateProtocol(
    protocolCode: string,
    medicineIds: string[],
    durationDays?: number
  ): Promise<ProtocolComplianceResponse> {
    const res = await api.post<ProtocolComplianceResponse>('/api/clinic/doctor/protocols/evaluate', {
      protocolCode,
      medicineIds,
      durationDays,
    });
    return res.data;
  },

  // 4. Báo cáo sự cố rủi ro (Shock thuốc, tử vong, khiếu nại...)
  async getIncidents(params?: { incidentType?: string; severity?: string; page?: number; size?: number }): Promise<SpringPage<MedicalIncident>> {
    const res = await api.get<SpringPage<MedicalIncident>>('/api/clinic/doctor/incidents', { params });
    return res.data;
  },

  async reportIncident(data: MedicalIncidentRequest): Promise<MedicalIncident> {
    const res = await api.post<MedicalIncident>('/api/clinic/doctor/incidents', data);
    return res.data;
  },

  // 5. Tiếp nhận ca trực tiếp (Walk-in)
  async createWalkInExam(data: WalkInExamRequest): Promise<MedicalRecordResponse> {
    const res = await api.post<MedicalRecordResponse>('/api/clinic/doctor/walk-in', data);
    return res.data;
  },

  // 6. Hồ sơ bệnh án điện tử (EMR) của thú cưng
  async getPetEmrHistory(petId: string): Promise<PetEmrHistoryResponse> {
    const res = await api.get<PetEmrHistoryResponse>(`/api/clinic/doctor/pets/${petId}/emr`);
    return res.data;
  },

  // 7. Nhắc nhở SLA 24h chưa có phác đồ
  async getSlaReminders(): Promise<SlaReminderResponse[]> {
    const res = await api.get<SlaReminderResponse[]>('/api/clinic/doctor/sla-reminders');
    return res.data;
  },

  // 8. Chỉ định dịch vụ sang điều dưỡng / thu ngân
  async orderServices(recordId: string, serviceIds: string[], note?: string): Promise<ServiceIndicationResponse[]> {
    const res = await api.post<ServiceIndicationResponse[]>(`/api/clinic/doctor/records/${recordId}/services`, {
      serviceIds,
      note,
    });
    return res.data;
  },
};
