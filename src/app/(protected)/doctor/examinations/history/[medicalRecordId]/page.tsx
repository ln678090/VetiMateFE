'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

import { ExaminationForm } from '@/features/examination/components/ExaminationForm';
import { useMedicalRecord } from '@/features/examination/hooks/use-examination';

export default function MedicalRecordHistoryDetailPage() {
  const params = useParams<{ medicalRecordId?: string }>();
  const medicalRecordId = params?.medicalRecordId ?? null;

  const recordQuery = useMedicalRecord(medicalRecordId);

  if (!medicalRecordId) {
    return (
      <main className="mx-auto max-w-6xl py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Thiếu mã hồ sơ khám bệnh.
        </div>
      </main>
    );
  }

  if (recordQuery.isPending) {
    return (
      <main className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-8 animate-spin text-rose-600" />
          <p className="mt-3 text-sm text-muted-foreground">Đang tải chi tiết hồ sơ bệnh án...</p>
        </div>
      </main>
    );
  }

  if (recordQuery.isError || !recordQuery.data) {
    return (
      <main className="mx-auto max-w-6xl space-y-4 py-8">
        <Link href="/doctor/examinations?tab=history" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Quay lại lịch sử khám
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Không thể tải chi tiết hồ sơ bệnh án: {recordQuery.error?.message ?? 'Không tìm thấy dữ liệu'}
        </div>
      </main>
    );
  }

  return <ExaminationForm key={recordQuery.data.id} initialRecord={recordQuery.data} />;
}
