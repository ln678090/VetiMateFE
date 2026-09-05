'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  LoaderCircle,
  Plus,
  Save,
  Stethoscope,
  Trash2,
  FileText,
  Printer,
  AlertTriangle,
  History,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Calendar,
  Sparkles,
  CheckCircle2,
  SendHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  useCompleteExamination,
  useMedicines,
  useReplacePrescriptions,
  useSaveExamination,
} from '@/features/examination/hooks/use-examination';
import {
  useCheckDrugSafety,
  useOrderServices,
  useProtocols,
} from '@/features/examination/hooks/use-doctor-clinical';
import { useClinicServices } from '@/features/clinic-services/hooks/use-clinic-services';

import { DrugSafetyAlertBox } from './DrugSafetyAlertBox';
import { LabResultsManager } from './LabResultsManager';
import { ProtocolComplianceCard } from './ProtocolComplianceCard';
import { PetEmrHistoryDrawer } from './PetEmrHistoryDrawer';
import { PrescriptionPrintModal } from './PrescriptionPrintModal';
import { IncidentReportModal } from './IncidentReportModal';

import type {
  MedicalRecordResponse,
  PetHealthStatus,
  PrescriptionItemRequest,
  SaveExaminationRequest,
} from '@/types/examination';

export interface PrescriptionDraft {
  key: string;
  medicineId: string;
  quantity: number;
  dosage: string;
  durationDays: number;
  note: string;
}

export interface ExaminationFormProps {
  initialRecord: MedicalRecordResponse;
}

const HEALTH_OPTIONS: Array<{
  value: PetHealthStatus;
  label: string;
}> = [
  { value: 'HEALTHY', label: 'Khỏe mạnh' },
  { value: 'MONITORING', label: 'Cần theo dõi' },
  { value: 'TREATMENT', label: 'Đang điều trị' },
  { value: 'CRITICAL', label: 'Nghiêm trọng (Cấp cứu)' },
  { value: 'RECOVERING', label: 'Đang hồi phục' },
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

export function ExaminationForm({ initialRecord }: ExaminationFormProps) {
  const router = useRouter();

  // Basic Record Fields
  const [symptoms, setSymptoms] = useState(initialRecord.symptoms ?? '');
  const [diagnosis, setDiagnosis] = useState(initialRecord.diagnosis ?? '');
  const [treatmentPlan, setTreatmentPlan] = useState(initialRecord.treatmentPlan ?? '');
  const [weightKg, setWeightKg] = useState<number | null>(initialRecord.weightKg);
  const [healthStatus, setHealthStatus] = useState<PetHealthStatus>(
    initialRecord.healthStatus ?? 'MONITORING'
  );
  const [doctorNote, setDoctorNote] = useState(initialRecord.doctorNote ?? '');

  // Vital Signs
  const [temperatureC, setTemperatureC] = useState<number | null>(initialRecord.temperatureC ?? 38.5);
  const [heartRateBpm, setHeartRateBpm] = useState<number | null>(initialRecord.heartRateBpm ?? 110);
  const [respiratoryRate, setRespiratoryRate] = useState<number | null>(initialRecord.respiratoryRate ?? 24);
  const [bloodPressure, setBloodPressure] = useState<string>(initialRecord.bloodPressure ?? '120/80');
  const [followUpDate, setFollowUpDate] = useState<string>(initialRecord.followUpDate ?? '');

  // Protocol & Compliance
  const [protocolCode, setProtocolCode] = useState<string | null>(initialRecord.protocolCode ?? null);
  const [complianceScore, setComplianceScore] = useState<number | null>(initialRecord.complianceScore ?? null);

  // Prescriptions
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

  // Service Ordering
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [serviceOrderNote, setServiceOrderNote] = useState<string>('');

  // Modals & Drawers
  const [isEmrDrawerOpen, setIsEmrDrawerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // Queries & Mutations
  const medicinesQuery = useMedicines();
  const clinicServicesQuery = useClinicServices({ page: 0, size: 50, activeOnly: true });
  const saveMutation = useSaveExamination();
  const replaceMutation = useReplacePrescriptions();
  const completeMutation = useCompleteExamination();
  const orderServicesMutation = useOrderServices(initialRecord.id);

  // Drug Safety Check
  const selectedMedicineIds = useMemo(() => {
    return prescriptions.map((p) => p.medicineId).filter((id): id is string => Boolean(id));
  }, [prescriptions]);

  const drugSafetyQuery = useCheckDrugSafety(initialRecord.petId, selectedMedicineIds);

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
      temperatureC,
      heartRateBpm,
      respiratoryRate,
      bloodPressure: bloodPressure.trim() || null,
      followUpDate: followUpDate || null,
      complianceScore,
      protocolCode,
    };
  }

  function buildPrescriptionItems(): PrescriptionItemRequest[] {
    const medicineIds = prescriptions.map((item) => item.medicineId);

    if (medicineIds.some((id) => !id)) {
      throw new Error('Hãy chọn thuốc cho tất cả các dòng kê đơn.');
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

      if (prescriptions.length > 0) {
        const prescriptionItems = buildPrescriptionItems();
        await replaceMutation.mutateAsync({
          medicalRecordId: initialRecord.id,
          request: { items: prescriptionItems },
        });
      }

      toast.success('Đã lưu nháp bệnh án thành công.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleComplete(): Promise<void> {
    if (isReadOnly) return;

    if (!diagnosis.trim()) {
      toast.error('Phải nhập chẩn đoán trước khi hoàn tất khám bệnh.');
      return;
    }

    // Safety Alert warning confirm if critical
    if (drugSafetyQuery.data?.hasCriticalAlert) {
      const confirmProceed = window.confirm(
        'CẢNH BÁO NGUY HIỂM: Đơn thuốc có tương tác thuốc kỵ nhau hoặc dị ứng nghiêm trọng. Bạn có chắc chắn muốn bỏ qua cảnh báo để hoàn tất?'
      );
      if (!confirmProceed) return;
    }

    try {
      const prescriptionItems = prescriptions.length > 0 ? buildPrescriptionItems() : [];

      const savedRecord = await saveMutation.mutateAsync({
        medicalRecordId: initialRecord.id,
        request: buildSaveRequest(),
      });

      if (prescriptionItems.length > 0) {
        await replaceMutation.mutateAsync({
          medicalRecordId: savedRecord.id,
          request: { items: prescriptionItems },
        });
      }

      await completeMutation.mutateAsync(savedRecord.id);

      toast.success('Đã hoàn tất ca khám và cập nhật hồ sơ thú cưng.');
      router.replace('/doctor/examinations?tab=history');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function handleOrderService(): Promise<void> {
    if (!selectedServiceId) {
      toast.error('Vui lòng chọn dịch vụ cần chỉ định.');
      return;
    }

    try {
      await orderServicesMutation.mutateAsync({
        serviceIds: [selectedServiceId],
        note: serviceOrderNote.trim() || undefined,
      });

      toast.success('Đã gửi chỉ định dịch vụ sang bộ phận Điều dưỡng / Thu ngân.');
      setSelectedServiceId('');
      setServiceOrderNote('');
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
        item.key === key ? { ...item, ...changes } : item
      )
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 py-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/doctor/examinations"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách ca khám
        </Link>

        {/* Clinical Suite Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsEmrDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <History className="size-4" />
            Lịch sử Bệnh án (EMR)
          </button>

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <Printer className="size-4" />
            In Đơn thuốc
          </button>

          <button
            type="button"
            onClick={() => setIsIncidentModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <AlertTriangle className="size-4" />
            Báo cáo sự cố rủi ro
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <header className="rounded-3xl border border-zinc-200 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-emerald-500/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
              <Stethoscope className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Phiếu Khám Y Khoa & Điều Trị
                </h1>
                {initialRecord.isWalkIn && (
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                    Ca Walk-in
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mã bệnh án: <span className="font-mono font-semibold">{initialRecord.id.slice(0, 8).toUpperCase()}</span> • Trạng thái: {isReadOnly ? 'Đã hoàn tất khám' : 'Đang xử lý'}
              </p>
            </div>
          </div>

          {isReadOnly && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              ✓ Bệnh án đã lưu & hoàn thành
            </span>
          )}
        </div>
      </header>

      {/* Section 1: Vital Signs (Chỉ số sinh tồn) */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <Activity className="size-5 text-rose-600" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            1. Chỉ số sinh tồn & Đánh giá thể trạng
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Thermometer className="size-3.5 text-rose-500" /> Thân nhiệt (°C)
            </span>
            <input
              type="number"
              step="0.1"
              value={temperatureC ?? ''}
              disabled={isReadOnly}
              onChange={(e) => setTemperatureC(e.target.value ? Number(e.target.value) : null)}
              placeholder="38.5"
              className="h-9 w-full rounded-xl border bg-background px-3 text-sm font-semibold focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Heart className="size-3.5 text-red-500" /> Nhịp tim (BPM)
            </span>
            <input
              type="number"
              value={heartRateBpm ?? ''}
              disabled={isReadOnly}
              onChange={(e) => setHeartRateBpm(e.target.value ? Number(e.target.value) : null)}
              placeholder="110"
              className="h-9 w-full rounded-xl border bg-background px-3 text-sm font-semibold focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Wind className="size-3.5 text-cyan-500" /> Nhịp thở (lần/phút)
            </span>
            <input
              type="number"
              value={respiratoryRate ?? ''}
              disabled={isReadOnly}
              onChange={(e) => setRespiratoryRate(e.target.value ? Number(e.target.value) : null)}
              placeholder="24"
              className="h-9 w-full rounded-xl border bg-background px-3 text-sm font-semibold focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Huyết áp (mmHg)</span>
            <input
              type="text"
              value={bloodPressure}
              disabled={isReadOnly}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="120/80"
              className="h-9 w-full rounded-xl border bg-background px-3 text-sm font-semibold focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Cân nặng (kg)</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={weightKg ?? ''}
              disabled={isReadOnly}
              onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : null)}
              placeholder="5.2"
              className="h-9 w-full rounded-xl border bg-background px-3 text-sm font-semibold focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Tình trạng chung</span>
            <select
              value={healthStatus}
              disabled={isReadOnly}
              onChange={(e) => setHealthStatus(e.target.value as PetHealthStatus)}
              className="h-9 w-full rounded-xl border bg-background px-2.5 text-xs font-semibold focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            >
              {HEALTH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Section 2: Clinical Examination & Diagnosis */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <FileText className="size-5 text-indigo-600" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            2. Triệu chứng, Chẩn đoán & Phác đồ điều trị
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Triệu chứng lâm sàng & Bệnh sử
            </span>
            <textarea
              rows={3}
              maxLength={5000}
              value={symptoms}
              disabled={isReadOnly}
              placeholder="Mô tả triệu chứng phát hiện khi khám: nôn mửa, tiêu chảy, ủ rũ, bỏ ăn..."
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full rounded-2xl border bg-background p-3 text-sm leading-relaxed focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Chẩn đoán xác định / Sơ bộ <span className="text-red-500">*</span>
            </span>
            <textarea
              rows={2}
              maxLength={5000}
              value={diagnosis}
              disabled={isReadOnly}
              placeholder="Chẩn đoán bệnh lý chính (Ví dụ: Viêm dạ dày ruột cấp do Parvovirus, Suy thận mạn giai đoạn 2...)"
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full rounded-2xl border bg-background p-3 text-sm font-semibold text-rose-700 dark:text-rose-400 focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Phác đồ điều trị chi tiết & Kết luận
            </span>
            <textarea
              rows={3}
              maxLength={5000}
              value={treatmentPlan}
              disabled={isReadOnly}
              placeholder="Chi tiết phác đồ: Truyền dịch Ringer Lactate 50ml/kg/ngày, kháng sinh phối hợp, chống nôn..."
              onChange={(e) => setTreatmentPlan(e.target.value)}
              className="w-full rounded-2xl border bg-background p-3 text-sm leading-relaxed focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Lời dặn dò của bác sĩ cho chủ nuôi
            </span>
            <textarea
              rows={2}
              maxLength={5000}
              value={doctorNote}
              disabled={isReadOnly}
              placeholder="Hướng dẫn kiêng ăn mỡ, theo dõi phân, uống thuốc đúng giờ..."
              onChange={(e) => setDoctorNote(e.target.value)}
              className="w-full rounded-2xl border bg-background p-3 text-sm focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3.5 text-amber-500" /> Ngày hẹn tái khám
            </span>
            <input
              type="date"
              value={followUpDate}
              disabled={isReadOnly}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="h-10 w-full rounded-2xl border bg-background px-3 text-sm font-medium focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
            />
            <span className="text-[11px] text-muted-foreground">Hệ thống sẽ nhắc lịch tự động cho chủ nuôi</span>
          </label>
        </div>
      </section>

      {/* Section 3: Lab Results Manager (Chỉ số Máu / Nước tiểu vượt chuẩn) */}
      <section>
        <LabResultsManager medicalRecordId={initialRecord.id} isReadOnly={isReadOnly} />
      </section>

      {/* Section 4: Clinical Service Indications (Chỉ định Dịch vụ / Cận lâm sàng) */}
      {!isReadOnly && (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-amber-500" />
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Chỉ định Cận lâm sàng & Dịch vụ điều dưỡng
                </h2>
                <p className="text-xs text-muted-foreground">
                  Dữ liệu được chuyển ngay sang Điều dưỡng thực hiện và Thu ngân tính phí.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] items-end">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Chọn Dịch vụ / Xét nghiệm</span>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="h-10 w-full rounded-2xl border bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-rose-500"
              >
                <option value="">-- Chọn dịch vụ chỉ định --</option>
                {(clinicServicesQuery.data?.content ?? []).map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} — {srv.price.toLocaleString('vi-VN')} đ ({srv.durationMin} phút)
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Ghi chú lâm sàng cho điều dưỡng</span>
              <input
                type="text"
                value={serviceOrderNote}
                onChange={(e) => setServiceOrderNote(e.target.value)}
                placeholder="Ví dụ: Lấy máu tĩnh mạch cổ, làm ngay cấp cứu"
                className="h-10 w-full rounded-2xl border bg-background px-3 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </label>

            <button
              type="button"
              disabled={orderServicesMutation.isPending || !selectedServiceId}
              onClick={handleOrderService}
              className="inline-flex h-10 items-center gap-1.5 rounded-2xl bg-amber-500 px-4 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              {orderServicesMutation.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <SendHorizontal className="size-4" />
              )}
              Chỉ định thực hiện
            </button>
          </div>
        </section>
      )}

      {/* Section 5: Prescriptions, Safety Alerts & Protocol Compliance Engine */}
      <section className="space-y-4">
        {/* Real-time Drug Safety Alert Box */}
        <DrugSafetyAlertBox
          alerts={drugSafetyQuery.data?.alerts ?? []}
        />

        {/* Protocol Compliance Card */}
        <ProtocolComplianceCard
          selectedMedicineIds={selectedMedicineIds}
          onProtocolSelected={(appliedCode) => {
            setProtocolCode(appliedCode);
          }}
        />

        {/* Prescription Table / Builder */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                3. Đơn thuốc & Vật tư y tế từ Kho
              </h2>
              <p className="text-xs text-muted-foreground">
                Tự động kiểm tra tương tác thuốc và trừ tồn kho khi xuất đơn.
              </p>
            </div>

            {!isReadOnly && (
              <button
                type="button"
                onClick={addPrescription}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 text-xs font-semibold text-zinc-800 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <Plus className="size-4 text-emerald-600" />
                Thêm thuốc từ kho
              </button>
            )}
          </div>

          {prescriptions.length === 0 && (
            <p className="mt-5 rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-muted-foreground dark:border-zinc-800">
              Lần khám này chưa có thuốc được kê. Nhấn <strong>"Thêm thuốc từ kho"</strong> nếu cần chỉ định dùng thuốc.
            </p>
          )}

          <div className="mt-5 space-y-4">
            {prescriptions.map((prescription, index) => (
              <article
                key={prescription.key}
                className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">
                      {index + 1}
                    </span>
                    Dòng thuốc #{index + 1}
                  </span>

                  {!isReadOnly && (
                    <button
                      type="button"
                      aria-label="Xóa thuốc"
                      onClick={() => removePrescription(prescription.key)}
                      className="inline-flex size-7 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Thuốc / Hoạt chất trong kho
                    </span>
                    <select
                      value={prescription.medicineId}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        updatePrescription(prescription.key, {
                          medicineId: e.target.value,
                        })
                      }
                      className="h-9 w-full rounded-xl border bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
                    >
                      <option value="">-- Chọn thuốc / vật tư --</option>
                      {(medicinesQuery.data ?? []).map((medicine) => (
                        <option key={medicine.id} value={medicine.id}>
                          {medicine.name} — {medicine.unit} {medicine.activeIngredient ? `(${medicine.activeIngredient})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Số lượng</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={prescription.quantity}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        updatePrescription(prescription.key, {
                          quantity: Number(e.target.value || 0),
                        })
                      }
                      className="h-9 w-full rounded-xl border bg-background px-3 text-xs font-bold focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Số ngày dùng</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={prescription.durationDays}
                      disabled={isReadOnly}
                      onChange={(e) =>
                        updatePrescription(prescription.key, {
                          durationDays: Number(e.target.value || 1),
                        })
                      }
                      className="h-9 w-full rounded-xl border bg-background px-3 text-xs font-bold focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
                    />
                  </label>

                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                      Hướng dẫn liều dùng
                    </span>
                    <input
                      type="text"
                      maxLength={255}
                      value={prescription.dosage}
                      disabled={isReadOnly}
                      placeholder="Ví dụ: 1 viên x 2 lần/ngày sau khi ăn no"
                      onChange={(e) =>
                        updatePrescription(prescription.key, {
                          dosage: e.target.value,
                        })
                      }
                      className="h-9 w-full rounded-xl border bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
                    />
                  </label>

                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Ghi chú</span>
                    <input
                      type="text"
                      maxLength={500}
                      value={prescription.note}
                      disabled={isReadOnly}
                      placeholder="Lưu ý khi dùng thuốc (nếu có)"
                      onChange={(e) =>
                        updatePrescription(prescription.key, {
                          note: e.target.value,
                        })
                      }
                      className="h-9 w-full rounded-xl border bg-background px-3 text-xs focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Sticky Action Footer */}
      {!isReadOnly && (
        <footer className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Tự động kiểm tra an toàn dược lý trước khi hoàn tất</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSave}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-300 px-4 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 disabled:opacity-60 transition-colors"
            >
              {saveMutation.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Lưu nháp bệnh án
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleComplete}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-5 text-xs font-bold text-white shadow-md shadow-rose-600/30 hover:bg-rose-700 disabled:opacity-60 transition-all"
            >
              {completeMutation.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Stethoscope className="size-4" />
              )}
              Hoàn tất ca khám & Cập nhật EMR
            </button>
          </div>
        </footer>
      )}

      {/* Pet Longitudinal EMR History Drawer */}
      <PetEmrHistoryDrawer
        petId={initialRecord.petId}
        isOpen={isEmrDrawerOpen}
        onClose={() => setIsEmrDrawerOpen(false)}
      />

      {/* Printable Prescription Modal */}
      <PrescriptionPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        record={initialRecord}
      />

      {/* Medical Incident & Risk Audit Modal */}
      <IncidentReportModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        medicalRecordId={initialRecord.id}
        petId={initialRecord.petId}
      />
    </main>
  );
}
