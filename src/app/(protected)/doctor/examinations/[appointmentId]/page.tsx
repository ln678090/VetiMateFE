'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, LoaderCircle, Plus, Save, Stethoscope, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { examinationApi } from '@/features/examination/api/examination.api';
import { ServiceIndicationPanel } from '@/features/examination/components/ServiceIndicationPanel';
import {
  EXAMINATION_QUERY_KEYS,
  useCompleteExamination,
  useMedicines,
  useReplacePrescriptions,
  useSaveExamination,
} from '@/features/examination/hooks/use-examination';
import { api } from '@/lib/axios';
import type {
  MedicalRecordResponse,
  PetHealthStatus,
  PrescriptionItemRequest,
  SaveExaminationRequest,
} from '@/types/examination';

interface PrescriptionDraft {
  key: string;
  medicineId: string;
  quantity: number;
  dosage: string;
  durationDays: number;
  note: string;
}

interface ExaminationFormProps {
  initialRecord: MedicalRecordResponse;
}

interface ClinicServiceOption {
  id: string;
  name: string;
}

interface SpringPage<T> {
  content: T[];
}

interface ApiResponse<T> {
  data: T;
}

const HEALTH_OPTIONS: Array<{
  value: PetHealthStatus;
  label: string;
}> = [
  {
    value: 'HEALTHY',
    label: 'Khỏe mạnh',
  },
  {
    value: 'MONITORING',
    label: 'Cần theo dõi',
  },
  {
    value: 'TREATMENT',
    label: 'Đang điều trị',
  },
  {
    value: 'CRITICAL',
    label: 'Nghiêm trọng',
  },
  {
    value: 'RECOVERING',
    label: 'Đang hồi phục',
  },
];

function createPrescriptionDraft(): PrescriptionDraft {
  return {
    key: crypto.randomUUID(),
    medicineId: '',
    quantity: 1,
    dosage: '',
    durationDays: 1,
    note: '',
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định.';
}

function ExaminationForm({ initialRecord }: ExaminationFormProps) {
  const router = useRouter();

  const [symptoms, setSymptoms] = useState(initialRecord.symptoms ?? '');

  const [diagnosis, setDiagnosis] = useState(initialRecord.diagnosis ?? '');

  const [treatmentPlan, setTreatmentPlan] = useState(initialRecord.treatmentPlan ?? '');

  const [weightKg, setWeightKg] = useState<number | null>(initialRecord.weightKg);

  const [healthStatus, setHealthStatus] = useState<PetHealthStatus>(
    initialRecord.healthStatus ?? 'MONITORING'
  );

  const [doctorNote, setDoctorNote] = useState(initialRecord.doctorNote ?? '');

  const [prescriptions, setPrescriptions] = useState<PrescriptionDraft[]>(
    initialRecord.prescriptions.map((item) => ({
      key: item.id,
      medicineId: item.medicineId,
      quantity: item.quantity,
      dosage: item.dosage,
      durationDays: item.durationDays,
      note: item.note ?? '',
    }))
  );

  const medicinesQuery = useMedicines();

  const servicesQuery = useQuery({
    queryKey: ['clinic-services', 'active', 'indications'],

    queryFn: async (): Promise<ClinicServiceOption[]> => {
      const response = await api.get<ApiResponse<SpringPage<ClinicServiceOption>>>(
        '/api/clinic/services',
        {
          params: {
            activeOnly: true,
            page: 0,
            size: 100,
            sort: 'name,asc',
          },
        }
      );

      return response.data.data.content;
    },

    staleTime: 5 * 60 * 1000,
  });

  const saveMutation = useSaveExamination();

  const replaceMutation = useReplacePrescriptions();

  const completeMutation = useCompleteExamination();

  const isReadOnly = initialRecord.status === 'COMPLETED';

  const isSubmitting =
    saveMutation.isPending || replaceMutation.isPending || completeMutation.isPending;

  function buildSaveRequest(): SaveExaminationRequest {
    return {
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      treatmentPlan: treatmentPlan.trim(),
      weightKg,
      healthStatus,
      doctorNote: doctorNote.trim(),
    };
  }

  function buildPrescriptionItems(): PrescriptionItemRequest[] {
    const medicineIds = prescriptions.map((item) => item.medicineId);

    if (medicineIds.some((id) => !id)) {
      throw new Error('Hãy chọn thuốc cho tất cả các dòng.');
    }

    if (new Set(medicineIds).size !== medicineIds.length) {
      throw new Error('Một loại thuốc không được kê nhiều lần.');
    }

    return prescriptions.map((item) => {
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
        throw new Error('Số lượng thuốc phải lớn hơn 0.');
      }

      if (!item.dosage.trim()) {
        throw new Error('Liều dùng không được để trống.');
      }

      if (!Number.isInteger(item.durationDays) || item.durationDays <= 0) {
        throw new Error('Số ngày phải là số nguyên lớn hơn 0.');
      }

      return {
        medicineId: item.medicineId,
        quantity: item.quantity,
        dosage: item.dosage.trim(),
        durationDays: item.durationDays,
        note: item.note.trim(),
      };
    });
  }

  async function handleSave(): Promise<void> {
    if (isReadOnly) return;

    try {
      await saveMutation.mutateAsync({
        medicalRecordId: initialRecord.id,
        request: buildSaveRequest(),
      });

      toast.success('Đã lưu bệnh án.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleComplete(): Promise<void> {
    if (isReadOnly) return;

    if (!diagnosis.trim()) {
      toast.error('Phải nhập chẩn đoán trước khi hoàn tất.');
      return;
    }

    try {
      const prescriptionItems = buildPrescriptionItems();

      const savedRecord = await saveMutation.mutateAsync({
        medicalRecordId: initialRecord.id,
        request: buildSaveRequest(),
      });

      await replaceMutation.mutateAsync({
        medicalRecordId: savedRecord.id,
        request: {
          items: prescriptionItems,
        },
      });

      await completeMutation.mutateAsync(savedRecord.id);

      toast.success('Đã hoàn tất khám và cập nhật sức khỏe thú cưng.');

      router.replace('/doctor/examinations');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  function addPrescription(): void {
    setPrescriptions((current) => [...current, createPrescriptionDraft()]);
  }

  function removePrescription(key: string): void {
    setPrescriptions((current) => current.filter((item) => item.key !== key));
  }

  function updatePrescription(key: string, changes: Partial<PrescriptionDraft>): void {
    setPrescriptions((current) =>
      current.map((item) =>
        item.key === key
          ? {
              ...item,
              ...changes,
            }
          : item
      )
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 py-8">
      <Link
        href="/doctor/examinations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách khám
      </Link>

      <header>
        <div className="flex items-center gap-2">
          <Stethoscope className="size-7 text-rose-600" />

          <h1 className="text-3xl font-bold">Hồ sơ khám bệnh</h1>
        </div>

        <p className="mt-2 text-muted-foreground">
          Ghi nhận tình trạng sức khỏe, chỉ định dịch vụ, chẩn đoán và đơn thuốc.
        </p>
      </header>

      {isReadOnly && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Bệnh án đã hoàn thành chỉ được xem. Tình trạng mới phải được ghi nhận bằng lần khám mới.
        </div>
      )}

      <section className="grid gap-5 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">
            Tình trạng sức khỏe
            <span aria-hidden="true" className="ml-0.5 text-red-500">
              *
            </span>
          </span>

          <select
            value={healthStatus}
            disabled={isReadOnly}
            onChange={(event) => setHealthStatus(event.target.value as PetHealthStatus)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
          >
            {HEALTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Cân nặng (kg)</span>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={weightKg ?? ''}
            disabled={isReadOnly}
            onChange={(event) => {
              const value = event.target.value;

              setWeightKg(value ? Number(value) : null);
            }}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Triệu chứng</span>

          <textarea
            rows={4}
            maxLength={5000}
            value={symptoms}
            disabled={isReadOnly}
            onChange={(event) => setSymptoms(event.target.value)}
            className="w-full rounded-md border bg-background p-3 text-sm disabled:opacity-60"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">
            Chẩn đoán
            <span aria-hidden="true" className="ml-0.5 text-red-500">
              *
            </span>
          </span>

          <textarea
            rows={4}
            maxLength={5000}
            value={diagnosis}
            disabled={isReadOnly}
            onChange={(event) => setDiagnosis(event.target.value)}
            className="w-full rounded-md border bg-background p-3 text-sm disabled:opacity-60"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Phác đồ điều trị</span>

          <textarea
            rows={4}
            maxLength={5000}
            value={treatmentPlan}
            disabled={isReadOnly}
            onChange={(event) => setTreatmentPlan(event.target.value)}
            className="w-full rounded-md border bg-background p-3 text-sm disabled:opacity-60"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Ghi chú bác sĩ</span>

          <textarea
            rows={3}
            maxLength={5000}
            value={doctorNote}
            disabled={isReadOnly}
            onChange={(event) => setDoctorNote(event.target.value)}
            className="w-full rounded-md border bg-background p-3 text-sm disabled:opacity-60"
          />
        </label>
      </section>

      {servicesQuery.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Không tải được danh sách dịch vụ: {servicesQuery.error.message}
        </div>
      )}

      <ServiceIndicationPanel
        medicalRecordId={initialRecord.id}
        services={servicesQuery.data ?? []}
        editable={!isReadOnly && !servicesQuery.isLoading && !servicesQuery.isError}
      />

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Đơn thuốc</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Có thể hoàn tất khám mà không kê thuốc.
            </p>
          </div>

          {!isReadOnly && (
            <button
              type="button"
              onClick={addPrescription}
              className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted"
            >
              <Plus className="size-4" />
              Thêm thuốc
            </button>
          )}
        </div>

        {medicinesQuery.isError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Không tải được danh sách thuốc: {medicinesQuery.error.message}
          </div>
        )}

        {prescriptions.length === 0 && (
          <p className="mt-5 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Lần khám này chưa kê thuốc.
          </p>
        )}

        <div className="mt-5 space-y-4">
          {prescriptions.map((prescription, index) => (
            <article key={prescription.key} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Thuốc {index + 1}</h3>

                {!isReadOnly && (
                  <button
                    type="button"
                    aria-label="Xóa thuốc"
                    onClick={() => removePrescription(prescription.key)}
                    className="inline-flex size-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium">Thuốc</span>

                  <select
                    value={prescription.medicineId}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      updatePrescription(prescription.key, {
                        medicineId: event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
                  >
                    <option value="">Chọn thuốc</option>

                    {(medicinesQuery.data ?? []).map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} — {medicine.unit}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium">Số lượng</span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={prescription.quantity}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      updatePrescription(prescription.key, {
                        quantity: Number(event.target.value),
                      })
                    }
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium">Số ngày</span>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={prescription.durationDays}
                    disabled={isReadOnly}
                    onChange={(event) =>
                      updatePrescription(prescription.key, {
                        durationDays: Number(event.target.value),
                      })
                    }
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium">Liều dùng</span>

                  <input
                    value={prescription.dosage}
                    disabled={isReadOnly}
                    maxLength={200}
                    onChange={(event) =>
                      updatePrescription(prescription.key, {
                        dosage: event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium">Ghi chú</span>

                  <input
                    value={prescription.note}
                    disabled={isReadOnly}
                    maxLength={500}
                    onChange={(event) =>
                      updatePrescription(prescription.key, {
                        note: event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      {!isReadOnly && (
        <footer className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSave()}
            className="inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            <Save className="size-4" />
            Lưu bệnh án
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleComplete()}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
            Hoàn tất khám
          </button>
        </footer>
      )}
    </main>
  );
}

export default function DoctorExaminationPage() {
  const params = useParams<{
    appointmentId: string;
  }>();

  const appointmentId = typeof params.appointmentId === 'string' ? params.appointmentId : null;

  const recordQuery = useQuery<MedicalRecordResponse, Error>({
    queryKey: EXAMINATION_QUERY_KEYS.medicalRecord(appointmentId ?? 'missing'),

    queryFn: () => {
      if (!appointmentId) {
        throw new Error('Thiếu mã lịch hẹn.');
      }

      return examinationApi.openExamination(appointmentId);
    },

    enabled: Boolean(appointmentId),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  if (!appointmentId) {
    return (
      <main className="mx-auto max-w-6xl py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Thiếu mã lịch hẹn.
        </div>
      </main>
    );
  }

  if (recordQuery.isPending) {
    return (
      <main className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-8 animate-spin text-rose-600" />

          <p className="mt-3 text-sm text-muted-foreground">Đang mở hồ sơ khám...</p>
        </div>
      </main>
    );
  }

  if (recordQuery.isError || !recordQuery.data) {
    return (
      <main className="mx-auto max-w-6xl space-y-4 py-8">
        <Link href="/doctor/examinations" className="inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Không thể mở hồ sơ khám: {recordQuery.error?.message ?? 'Không tìm thấy dữ liệu'}
        </div>
      </main>
    );
  }

  return <ExaminationForm key={recordQuery.data.id} initialRecord={recordQuery.data} />;
}
