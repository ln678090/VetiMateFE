'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

import { examinationApi } from '@/features/examination/api/examination.api';
import { EXAMINATION_QUERY_KEYS } from '@/features/examination/hooks/use-examination';
import { ExaminationForm } from '@/features/examination/components/ExaminationForm';

export default function DoctorExaminationDetailPage() {
  const params = useParams<{ appointmentId?: string }>();
  const appointmentId = params?.appointmentId ?? '';

  const recordQuery = useQuery({
    queryKey: [...EXAMINATION_QUERY_KEYS.medicalRecords(), 'open', appointmentId],

    queryFn: () => {
      if (!appointmentId) {
        throw new Error('Thiếu mã lịch hẹn.');
      }

      return examinationApi.openExamination(appointmentId);
    },

    enabled: Boolean(appointmentId),

    /*
     * openExamination là idempotent theo appointment.
     * Query cache tránh POST trùng trong Strict Mode.
     */
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
        <Link href="/doctor/examinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Quay lại danh sách khám
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Không thể mở hồ sơ khám: {recordQuery.error?.message ?? 'Không tìm thấy dữ liệu'}
        </div>
      </main>
    );
  }

  return <ExaminationForm key={recordQuery.data.id} initialRecord={recordQuery.data} />;
}
