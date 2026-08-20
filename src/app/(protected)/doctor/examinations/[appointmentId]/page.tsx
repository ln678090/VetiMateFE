'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  useCompleteExamination,
  useMedicines,
  useOpenExamination,
  useReplacePrescriptions,
  useSaveExamination,
} from '@/features/examination/hooks/use-examination';
import { getApiErrorMessage } from '@/lib/axios';
import type {
  MedicalRecordResponse,
  PrescriptionItemRequest,
  ReplacePrescriptionsRequest,
  SaveExaminationRequest,
} from '@/types/examination';

interface DoctorExaminationPageProps {
  params: Promise<{
    appointmentId: string;
  }>;
}

interface ExaminationFormState {
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  weightKg: string;
  doctorNote: string;
}

interface PrescriptionFormItem {
  clientId: string;
  medicineId: string;
  quantity: string;
  dosage: string;
  durationDays: string;
  note: string;
}

type PrescriptionField = 'medicineId' | 'quantity' | 'dosage' | 'durationDays' | 'note';

type InitializationStatus = 'loading' | 'success' | 'error';

const EMPTY_EXAMINATION_FORM: ExaminationFormState = {
  symptoms: '',
  diagnosis: '',
  treatmentPlan: '',
  weightKg: '',
  doctorNote: '',
};

function createClientId(): string {
  return crypto.randomUUID();
}

function createEmptyPrescription(): PrescriptionFormItem {
  return {
    clientId: createClientId(),
    medicineId: '',
    quantity: '1',
    dosage: '',
    durationDays: '1',
    note: '',
  };
}

export default function DoctorExaminationPage({ params }: DoctorExaminationPageProps) {
  const { appointmentId } = use(params);
  const router = useRouter();

  const initializationStartedRef = useRef(false);

  const [initializationStatus, setInitializationStatus] = useState<InitializationStatus>('loading');

  const [initializationError, setInitializationError] = useState('');

  const [medicalRecord, setMedicalRecord] = useState<MedicalRecordResponse | null>(null);

  const [form, setForm] = useState<ExaminationFormState>(EMPTY_EXAMINATION_FORM);

  const [prescriptions, setPrescriptions] = useState<PrescriptionFormItem[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: openExaminationAsync } = useOpenExamination();

  const { mutateAsync: saveExaminationAsync } = useSaveExamination();

  const { mutateAsync: replacePrescriptionsAsync } = useReplacePrescriptions();

  const { mutateAsync: completeExaminationAsync } = useCompleteExamination();

  const {
    data: medicines = [],
    isLoading: isLoadingMedicines,
    error: medicinesError,
  } = useMedicines();

  const initializeForm = useCallback((record: MedicalRecordResponse) => {
    setMedicalRecord(record);

    setForm({
      symptoms: record.symptoms ?? '',
      diagnosis: record.diagnosis ?? '',
      treatmentPlan: record.treatmentPlan ?? '',
      weightKg: record.weightKg === null ? '' : String(record.weightKg),
      doctorNote: record.doctorNote ?? '',
    });

    const prescriptionItems = (record.prescriptions ?? []).map((item) => ({
      clientId: item.id,
      medicineId: item.medicineId,
      quantity: String(item.quantity),
      dosage: item.dosage,
      durationDays: String(item.durationDays),
      note: item.note ?? '',
    }));

    setPrescriptions(prescriptionItems);
  }, []);

  useEffect(() => {
    if (!appointmentId || initializationStartedRef.current) {
      return;
    }

    if (initializationStartedRef.current) {
      return;
    }

    initializationStartedRef.current = true;

    const initialize = async (): Promise<void> => {
      setInitializationStatus('loading');
      setInitializationError('');

      try {
        const record = await openExaminationAsync(appointmentId);

        initializeForm(record);
        setInitializationStatus('success');
      } catch (error: unknown) {
        setInitializationError(getApiErrorMessage(error));
        setInitializationStatus('error');
      }
    };

    void initialize();
  }, [appointmentId, initializeForm, openExaminationAsync]);

  const updateForm = (field: keyof ExaminationFormState, value: string): void => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updatePrescription = (clientId: string, field: PrescriptionField, value: string): void => {
    setPrescriptions((current) =>
      current.map((item) =>
        item.clientId === clientId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addPrescription = (): void => {
    setPrescriptions((current) => [...current, createEmptyPrescription()]);
  };

  const removePrescription = (clientId: string): void => {
    setPrescriptions((current) => current.filter((item) => item.clientId !== clientId));
  };

  const createSaveRequest = (): SaveExaminationRequest => {
    const diagnosis = form.diagnosis.trim();

    if (!diagnosis) {
      throw new Error('Chẩn đoán không được để trống.');
    }

    if (diagnosis.length > 5000) {
      throw new Error('Chẩn đoán không được vượt quá 5000 ký tự.');
    }

    const weightInput = form.weightKg.trim();
    let weightKg: number | null = null;

    if (weightInput) {
      const parsedWeight = Number(weightInput);

      if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
        throw new Error('Cân nặng phải là số lớn hơn 0.');
      }

      weightKg = parsedWeight;
    }

    return {
      symptoms: form.symptoms.trim(),
      diagnosis,
      treatmentPlan: form.treatmentPlan.trim(),
      weightKg,
      doctorNote: form.doctorNote.trim(),
    };
  };

  const createPrescriptionRequest = (): ReplacePrescriptionsRequest => {
    // if (prescriptions.length === 0) {
    //   throw new Error('Đơn thuốc phải có ít nhất một thuốc.');
    // }

    const items: PrescriptionItemRequest[] = prescriptions.map((item, index) => {
      const rowNumber = index + 1;
      const quantity = Number(item.quantity);
      const durationDays = Number(item.durationDays);
      const dosage = item.dosage.trim();

      if (!item.medicineId) {
        throw new Error(`Dòng thuốc ${rowNumber}: chưa chọn thuốc.`);
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(`Dòng thuốc ${rowNumber}: số lượng phải lớn hơn 0.`);
      }

      if (!dosage) {
        throw new Error(`Dòng thuốc ${rowNumber}: liều dùng không được để trống.`);
      }

      if (dosage.length > 200) {
        throw new Error(`Dòng thuốc ${rowNumber}: liều dùng không được vượt quá 200 ký tự.`);
      }

      if (!Number.isInteger(durationDays) || durationDays <= 0) {
        throw new Error(`Dòng thuốc ${rowNumber}: số ngày phải là số nguyên dương.`);
      }

      return {
        medicineId: item.medicineId,
        quantity,
        dosage,
        durationDays,
        note: item.note.trim(),
      };
    });

    return { items };
  };

  const persistExamination = async (): Promise<MedicalRecordResponse> => {
    if (!medicalRecord) {
      throw new Error('Hồ sơ khám chưa được khởi tạo.');
    }

    const saveRequest = createSaveRequest();
    const prescriptionRequest = createPrescriptionRequest();

    const savedRecord = await saveExaminationAsync({
      medicalRecordId: medicalRecord.id,
      request: saveRequest,
    });

    const recordWithPrescriptions = await replacePrescriptionsAsync({
      medicalRecordId: savedRecord.id,
      request: prescriptionRequest,
    });

    initializeForm(recordWithPrescriptions);

    return recordWithPrescriptions;
  };

  const handleSave = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await persistExamination();

      toast.success('Đã lưu hồ sơ khám và đơn thuốc.');
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const savedRecord = await persistExamination();

      await completeExaminationAsync(savedRecord.id);

      toast.success('Đã hoàn tất ca khám.');

      router.push('/doctor/examinations');
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointmentId) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">Không thể mở hồ sơ khám</h1>

          <p className="mt-2 text-sm text-red-700">Không tìm thấy mã lịch hẹn.</p>
        </section>
      </main>
    );
  }
  if (initializationStatus === 'loading') {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <section className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="h-7 w-64 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-40 animate-pulse rounded-xl bg-slate-100" />
          <div className="mt-6 h-40 animate-pulse rounded-xl bg-slate-100" />
        </section>
      </main>
    );
  }

  if (initializationStatus === 'error') {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">Không thể mở hồ sơ khám</h1>

          <p className="mt-2 text-sm text-red-700">{initializationError}</p>

          <button
            type="button"
            onClick={() => router.push('/doctor/examinations')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </button>
        </section>
      </main>
    );
  }

  if (!medicalRecord) {
    return null;
  }

  const isCompleted = medicalRecord.status === 'COMPLETED';

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={() => router.push('/doctor/examinations')}
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Danh sách ca khám
          </button>

          <h1 className="text-2xl font-bold text-slate-950">Hồ sơ khám bệnh</h1>

          <p className="mt-1 text-sm text-slate-500">Mã lịch hẹn: {medicalRecord.appointmentId}</p>
        </div>

        <span
          className={
            isCompleted
              ? 'rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700'
              : 'rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700'
          }
        >
          {isCompleted ? 'Đã hoàn tất' : 'Đang khám'}
        </span>
      </header>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Thông tin lâm sàng</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Triệu chứng</span>

            <textarea
              value={form.symptoms}
              disabled={isCompleted}
              maxLength={5000}
              onChange={(event) => updateForm('symptoms', event.target.value)}
              className="min-h-24 w-full rounded-xl border px-3 py-2 outline-none focus:border-rose-400 disabled:bg-slate-100"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Chẩn đoán <span className="text-red-500">*</span>
            </span>

            <textarea
              value={form.diagnosis}
              disabled={isCompleted}
              required
              maxLength={5000}
              onChange={(event) => updateForm('diagnosis', event.target.value)}
              className="min-h-24 w-full rounded-xl border px-3 py-2 outline-none focus:border-rose-400 disabled:bg-slate-100"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Kế hoạch điều trị</span>

            <textarea
              value={form.treatmentPlan}
              disabled={isCompleted}
              maxLength={5000}
              onChange={(event) => updateForm('treatmentPlan', event.target.value)}
              className="min-h-24 w-full rounded-xl border px-3 py-2 outline-none focus:border-rose-400 disabled:bg-slate-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Cân nặng (kg)</span>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.weightKg}
              disabled={isCompleted}
              onChange={(event) => updateForm('weightKg', event.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:border-rose-400 disabled:bg-slate-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Ghi chú bác sĩ</span>

            <input
              type="text"
              value={form.doctorNote}
              disabled={isCompleted}
              maxLength={5000}
              onChange={(event) => updateForm('doctorNote', event.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:border-rose-400 disabled:bg-slate-100"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Đơn thuốc</h2>

            <p className="mt-1 text-sm text-slate-500">Đơn thuốc phải có ít nhất một dòng.</p>
          </div>

          {!isCompleted && (
            <button
              type="button"
              onClick={addPrescription}
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Thêm thuốc
            </button>
          )}
        </div>

        {medicinesError && (
          <p className="mt-4 text-sm text-red-600">{getApiErrorMessage(medicinesError)}</p>
        )}

        <div className="mt-5 space-y-4">
          {prescriptions.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">
              Chưa có thuốc trong đơn.
            </div>
          )}

          {prescriptions.map((item, index) => (
            <article key={item.clientId} className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900">Thuốc {index + 1}</h3>

                {!isCompleted && (
                  <button
                    type="button"
                    aria-label={`Xóa thuốc ${index + 1}`}
                    onClick={() => removePrescription(item.clientId)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium">
                    Thuốc <span className="text-red-500">*</span>
                  </span>

                  <select
                    value={item.medicineId}
                    disabled={isCompleted || isLoadingMedicines}
                    onChange={(event) =>
                      updatePrescription(item.clientId, 'medicineId', event.target.value)
                    }
                    className="w-full rounded-xl border bg-white px-3 py-2"
                  >
                    <option value="">
                      {isLoadingMedicines ? 'Đang tải thuốc...' : 'Chọn thuốc'}
                    </option>

                    {medicines.map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} — {medicine.sku} — {medicine.unit}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium">
                    Số lượng <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    disabled={isCompleted}
                    onChange={(event) =>
                      updatePrescription(item.clientId, 'quantity', event.target.value)
                    }
                    className="w-full rounded-xl border bg-white px-3 py-2"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium">
                    Số ngày <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.durationDays}
                    disabled={isCompleted}
                    onChange={(event) =>
                      updatePrescription(item.clientId, 'durationDays', event.target.value)
                    }
                    className="w-full rounded-xl border bg-white px-3 py-2"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium">
                    Liều dùng <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="text"
                    value={item.dosage}
                    disabled={isCompleted}
                    maxLength={200}
                    placeholder="Ví dụ: 1 viên, ngày 2 lần"
                    onChange={(event) =>
                      updatePrescription(item.clientId, 'dosage', event.target.value)
                    }
                    className="w-full rounded-xl border bg-white px-3 py-2"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium">Ghi chú</span>

                  <input
                    type="text"
                    value={item.note}
                    disabled={isCompleted}
                    maxLength={500}
                    onChange={(event) =>
                      updatePrescription(item.clientId, 'note', event.target.value)
                    }
                    className="w-full rounded-xl border bg-white px-3 py-2"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      {!isCompleted && (
        <footer className="flex flex-col justify-end gap-3 sm:flex-row">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSave()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ'}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleComplete()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Hoàn tất ca khám
          </button>
        </footer>
      )}
    </main>
  );
}
