import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { examinationApi } from '../api/examination.api';

import type { SpringPage } from '@/types/clinic';

import type {
  ExaminationHistoryItem,
  MedicalRecordResponse,
  MedicineOptionResponse,
  ReplacePrescriptionsRequest,
  SaveExaminationRequest,
} from '@/types/examination';

export const EXAMINATION_QUERY_KEYS = {
  all: ['examinations'] as const,

  medicalRecords: () => [...EXAMINATION_QUERY_KEYS.all, 'medical-record'] as const,

  medicalRecord: (medicalRecordId: string) =>
    [...EXAMINATION_QUERY_KEYS.medicalRecords(), medicalRecordId] as const,

  medicines: () => [...EXAMINATION_QUERY_KEYS.all, 'medicines'] as const,

  histories: () => [...EXAMINATION_QUERY_KEYS.all, 'history'] as const,

  history: (page: number, size: number) =>
    [...EXAMINATION_QUERY_KEYS.histories(), page, size] as const,
};

interface SaveExaminationVariables {
  medicalRecordId: string;
  request: SaveExaminationRequest;
}

interface ReplacePrescriptionsVariables {
  medicalRecordId: string;
  request: ReplacePrescriptionsRequest;
}

export function useOpenExamination(): UseMutationResult<MedicalRecordResponse, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId) => examinationApi.openExamination(appointmentId),

    onSuccess: (medicalRecord) => {
      queryClient.setQueryData(
        EXAMINATION_QUERY_KEYS.medicalRecord(medicalRecord.id),
        medicalRecord
      );
    },
  });
}

export function useMedicalRecord(
  medicalRecordId: string | null
): UseQueryResult<MedicalRecordResponse, Error> {
  return useQuery({
    queryKey: EXAMINATION_QUERY_KEYS.medicalRecord(medicalRecordId ?? 'disabled'),

    queryFn: () => {
      if (!medicalRecordId) {
        throw new Error('Thiếu mã hồ sơ khám.');
      }

      return examinationApi.getMedicalRecord(medicalRecordId);
    },

    enabled: Boolean(medicalRecordId),
  });
}

export function useMedicines(): UseQueryResult<MedicineOptionResponse[], Error> {
  return useQuery({
    queryKey: EXAMINATION_QUERY_KEYS.medicines(),
    queryFn: () => examinationApi.getMedicines(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExaminationHistory(
  page: number,
  size = 10,
  enabled = true
): UseQueryResult<SpringPage<ExaminationHistoryItem>, Error> {
  return useQuery({
    queryKey: EXAMINATION_QUERY_KEYS.history(page, size),

    queryFn: () => examinationApi.getHistory(page, size),

    enabled,
    staleTime: 30_000,
  });
}

export function useSaveExamination(): UseMutationResult<
  MedicalRecordResponse,
  Error,
  SaveExaminationVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ medicalRecordId, request }) =>
      examinationApi.saveExamination(medicalRecordId, request),

    onSuccess: (medicalRecord) => {
      queryClient.setQueryData(
        EXAMINATION_QUERY_KEYS.medicalRecord(medicalRecord.id),
        medicalRecord
      );
    },
  });
}

export function useReplacePrescriptions(): UseMutationResult<
  MedicalRecordResponse,
  Error,
  ReplacePrescriptionsVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ medicalRecordId, request }) =>
      examinationApi.replacePrescriptions(medicalRecordId, request),

    onSuccess: (medicalRecord) => {
      queryClient.setQueryData(
        EXAMINATION_QUERY_KEYS.medicalRecord(medicalRecord.id),
        medicalRecord
      );
    },
  });
}

export function useCompleteExamination(): UseMutationResult<MedicalRecordResponse, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicalRecordId) => examinationApi.completeExamination(medicalRecordId),

    onSuccess: async (medicalRecord) => {
      queryClient.setQueryData(
        EXAMINATION_QUERY_KEYS.medicalRecord(medicalRecord.id),
        medicalRecord
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['clinic', 'appointments'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['doctor', 'examinations'],
        }),

        queryClient.invalidateQueries({
          queryKey: EXAMINATION_QUERY_KEYS.histories(),
        }),
      ]);
    },
  });
}
