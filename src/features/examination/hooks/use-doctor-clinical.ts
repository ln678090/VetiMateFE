import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doctorClinicalApi } from '../api/doctor-clinical.api';
import type {
  LabResultItem,
  MedicalIncidentRequest,
  WalkInExamRequest,
} from '@/types/examination';

export const DOCTOR_CLINICAL_KEYS = {
  all: ['doctor-clinical'] as const,
  safety: (petId: string, medicineIds: string[]) =>
    [...DOCTOR_CLINICAL_KEYS.all, 'safety', petId, medicineIds.sort().join(',')] as const,
  labs: (recordId: string) => [...DOCTOR_CLINICAL_KEYS.all, 'labs', recordId] as const,
  protocols: () => [...DOCTOR_CLINICAL_KEYS.all, 'protocols'] as const,
  incidents: (params?: Record<string, unknown>) =>
    [...DOCTOR_CLINICAL_KEYS.all, 'incidents', params] as const,
  emr: (petId: string) => [...DOCTOR_CLINICAL_KEYS.all, 'emr', petId] as const,
  slaReminders: () => [...DOCTOR_CLINICAL_KEYS.all, 'sla-reminders'] as const,
};

// 1. Hook kiểm tra an toàn thuốc
export function useCheckDrugSafety(petId: string, medicineIds: string[]) {
  return useQuery({
    queryKey: DOCTOR_CLINICAL_KEYS.safety(petId, medicineIds),
    queryFn: () => doctorClinicalApi.checkDrugSafety(petId, medicineIds),
    enabled: Boolean(petId && medicineIds.length > 0),
    staleTime: 5 * 1000,
  });
}

// 2. Hook xét nghiệm cận lâm sàng (Lab Results)
export function useLabResults(recordId: string) {
  return useQuery({
    queryKey: DOCTOR_CLINICAL_KEYS.labs(recordId),
    queryFn: () => doctorClinicalApi.getLabResults(recordId),
    enabled: Boolean(recordId),
  });
}

export function useSaveLabResults(recordId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: LabResultItem[]) => doctorClinicalApi.saveLabResults(recordId, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTOR_CLINICAL_KEYS.labs(recordId) });
      queryClient.invalidateQueries({ queryKey: DOCTOR_CLINICAL_KEYS.slaReminders() });
    },
  });
}

// 3. Hook phác đồ chuẩn & chấm điểm tuân thủ
export function useProtocols() {
  return useQuery({
    queryKey: DOCTOR_CLINICAL_KEYS.protocols(),
    queryFn: () => doctorClinicalApi.getProtocols(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEvaluateProtocol() {
  return useMutation({
    mutationFn: ({
      protocolCode,
      medicineIds,
      durationDays,
    }: {
      protocolCode: string;
      medicineIds: string[];
      durationDays?: number;
    }) => doctorClinicalApi.evaluateProtocol(protocolCode, medicineIds, durationDays),
  });
}

// 4. Hook sự cố y khoa & quản trị rủi ro
export function useIncidents(params?: { incidentType?: string; severity?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: DOCTOR_CLINICAL_KEYS.incidents(params),
    queryFn: () => doctorClinicalApi.getIncidents(params),
  });
}

export function useReportIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicalIncidentRequest) => doctorClinicalApi.reportIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTOR_CLINICAL_KEYS.incidents() });
    },
  });
}

// 5. Hook tiếp nhận ca Walk-in
export function useCreateWalkInExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WalkInExamRequest) => doctorClinicalApi.createWalkInExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations'] });
    },
  });
}

// 6. Hook hồ sơ EMR thú cưng
export function usePetEmrHistory(petId: string) {
  return useQuery({
    queryKey: DOCTOR_CLINICAL_KEYS.emr(petId),
    queryFn: () => doctorClinicalApi.getPetEmrHistory(petId),
    enabled: Boolean(petId),
  });
}

// 7. Hook nhắc nhở SLA 24h
export function useSlaReminders() {
  return useQuery({
    queryKey: DOCTOR_CLINICAL_KEYS.slaReminders(),
    queryFn: () => doctorClinicalApi.getSlaReminders(),
    refetchInterval: 30 * 1000,
  });
}

// 8. Hook chỉ định dịch vụ
export function useOrderServices(recordId: string) {
  return useMutation({
    mutationFn: ({ serviceIds, note }: { serviceIds: string[]; note?: string }) =>
      doctorClinicalApi.orderServices(recordId, serviceIds, note),
  });
}
