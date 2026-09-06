'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, LoaderCircle, Pill, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { examinationApi } from '@/features/examination/api/examination.api';
import { ServiceIndicationPanel } from '@/features/examination/components/ServiceIndicationPanel';
import { EXAMINATION_QUERY_KEYS } from '@/features/examination/hooks/use-examination';
import type { MedicalRecordResponse, PetHealthStatus } from '@/types/examination';

const HEALTH_STATUS_LABELS: Record<PetHealthStatus, string> = {
  HEALTHY: 'Khỏe mạnh',
  MONITORING: 'Cần theo dõi',
  TREATMENT: 'Đang điều trị',
  CRITICAL: 'Nghiêm trọng',
  RECOVERING: 'Đang hồi phục',
};

interface DetailItemProps {
  label: string;
  value?: string | number | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  const displayValue =
    value === null || value === undefined || value === '' ? 'Không có thông tin' : String(value);

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">{label}</p>

      <p className="whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">{displayValue}</p>
    </div>
  );
}

export default function ExaminationHistoryDetailPage() {
  const params = useParams<{
    medicalRecordId: string;
  }>();

  const medicalRecordId =
    typeof params.medicalRecordId === 'string' ? params.medicalRecordId : null;

  const recordQuery = useQuery<MedicalRecordResponse, Error>({
    queryKey: EXAMINATION_QUERY_KEYS.medicalRecord(medicalRecordId ?? 'missing'),
    queryFn: () => {
      if (!medicalRecordId) {
        throw new Error('Thiếu mã bệnh án.');
      }

      return examinationApi.getMedicalRecord(medicalRecordId);
    },
    enabled: Boolean(medicalRecordId),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (!medicalRecordId) {
    return (
      <main className="mx-auto max-w-6xl py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Thiếu mã bệnh án.
        </div>
      </main>
    );
  }

  if (recordQuery.isPending) {
    return (
      <main className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-8 animate-spin text-rose-600" />

          <p className="mt-3 text-sm text-muted-foreground">Đang tải bệnh án...</p>
        </div>
      </main>
    );
  }

  if (recordQuery.isError || !recordQuery.data) {
    return (
      <main className="mx-auto max-w-6xl space-y-4 py-8">
        <Link
          href="/doctor/examinations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách khám
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Không thể tải bệnh án: {recordQuery.error?.message ?? 'Không tìm thấy dữ liệu'}
        </div>
      </main>
    );
  }

  const record = recordQuery.data;
  const prescriptions = record.prescriptions ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-6 py-8">
      <Link
        href="/doctor/examinations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Quay lại lịch sử khám
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="size-7 text-rose-600" />

            <h1 className="text-3xl font-bold">Chi tiết bệnh án</h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">Mã bệnh án: {record.id}</p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
          {record.status === 'COMPLETED' ? 'Đã hoàn tất' : record.status}
        </span>
      </header>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Đây là bệnh án lịch sử và chỉ được xem. Mọi thay đổi sức khỏe mới phải được ghi nhận trong
        lần khám mới.
      </div>

      <section className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-zinc-950">
        <div className="mb-6 flex items-center gap-2">
          <Stethoscope className="size-5 text-rose-600" />

          <h2 className="text-lg font-semibold">Thông tin khám</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DetailItem
            label="Tình trạng sức khỏe"
            value={record.healthStatus ? HEALTH_STATUS_LABELS[record.healthStatus] : null}
          />

          <DetailItem
            label="Cân nặng"
            value={record.weightKg != null ? `${record.weightKg} kg` : null}
          />

          <div className="md:col-span-2">
            <DetailItem label="Triệu chứng" value={record.symptoms} />
          </div>

          <div className="md:col-span-2">
            <DetailItem label="Chẩn đoán" value={record.diagnosis} />
          </div>

          <div className="md:col-span-2">
            <DetailItem label="Phác đồ điều trị" value={record.treatmentPlan} />
          </div>

          <div className="md:col-span-2">
            <DetailItem label="Ghi chú bác sĩ" value={record.doctorNote} />
          </div>
        </div>
      </section>

      <ServiceIndicationPanel medicalRecordId={record.id} services={[]} editable={false} />

      <section className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <Pill className="size-5 text-rose-600" />

          <h2 className="text-lg font-semibold">Đơn thuốc</h2>
        </div>

        {prescriptions.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Lần khám này không kê thuốc.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {prescriptions.map((prescription, index) => (
              <article key={prescription.id} className="rounded-xl border p-4">
                <h3 className="font-semibold">Thuốc {index + 1}</h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <DetailItem label="Mã thuốc" value={prescription.medicineId} />

                  <DetailItem label="Số lượng" value={prescription.quantity} />

                  <DetailItem label="Số ngày" value={prescription.durationDays} />

                  <DetailItem label="Liều dùng" value={prescription.dosage} />

                  <div className="md:col-span-2">
                    <DetailItem label="Ghi chú" value={prescription.note} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
