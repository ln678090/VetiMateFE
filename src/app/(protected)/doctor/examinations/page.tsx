'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Eye, History, Stethoscope } from 'lucide-react';

import { useManagementAppointments } from '@/features/booking/hooks/use-clinic';
import { useExaminationHistory } from '@/features/examination/hooks/use-examination';
import { formatDateTime } from '@/lib/utils';

import type { PetHealthStatus } from '@/types/examination';

type ExaminationTab = 'waiting' | 'history';

const PAGE_SIZE = 20;

const HEALTH_STATUS_LABELS: Record<PetHealthStatus, string> = {
  HEALTHY: 'Khỏe mạnh',
  MONITORING: 'Cần theo dõi',
  TREATMENT: 'Đang điều trị',
  CRITICAL: 'Nghiêm trọng',
  RECOVERING: 'Đang hồi phục',
};

function getLocalDate(): string {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

function LoadingList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

export default function DoctorExaminationsPage() {
  const [activeTab, setActiveTab] = useState<ExaminationTab>('waiting');

  const [date, setDate] = useState(getLocalDate);

  const [waitingPage, setWaitingPage] = useState(0);

  const [historyPage, setHistoryPage] = useState(0);

  const examinationsQuery = useManagementAppointments({
    startDate: date,
    endDate: date,
    status: 'CONFIRMED',
    page: waitingPage,
    size: PAGE_SIZE,
  });

  const historyQuery = useExaminationHistory(historyPage, PAGE_SIZE, activeTab === 'history');

  const examinations = useMemo(
    () =>
      [...(examinationsQuery.data?.content ?? [])].sort(
        (first, second) => new Date(first.startAt).getTime() - new Date(second.startAt).getTime()
      ),
    [examinationsQuery.data?.content]
  );

  const historyRecords = historyQuery.data?.content ?? [];

  const waitingTotalPages = examinationsQuery.data?.totalPages ?? 0;

  const waitingTotalElements = examinationsQuery.data?.totalElements ?? 0;

  const historyTotalPages = historyQuery.data?.totalPages ?? 0;

  const historyTotalElements = historyQuery.data?.totalElements ?? 0;

  function changeDate(value: string): void {
    setDate(value);
    setWaitingPage(0);
  }

  function changeTab(tab: ExaminationTab): void {
    setActiveTab(tab);

    if (tab === 'history') {
      setHistoryPage(0);
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-3xl font-bold text-transparent">
            Ca khám của bác sĩ
          </h1>

          <p className="mt-1 text-muted-foreground">
            Khám bệnh và tra cứu các hồ sơ đã hoàn thành.
          </p>
        </div>

        <div className="rounded-xl bg-rose-50 px-5 py-2 text-center">
          <p className="text-2xl font-bold text-rose-600">
            {activeTab === 'waiting' ? waitingTotalElements : historyTotalElements}
          </p>

          <p className="text-xs text-rose-700">
            {activeTab === 'waiting' ? 'Ca chờ khám' : 'Ca đã khám'}
          </p>
        </div>
      </header>

      <nav className="inline-flex rounded-xl border bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => changeTab('waiting')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === 'waiting'
              ? 'bg-rose-600 text-white'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Stethoscope className="size-4" />
          Chờ khám
        </button>

        <button
          type="button"
          onClick={() => changeTab('history')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === 'history'
              ? 'bg-rose-600 text-white'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <History className="size-4" />
          Lịch sử khám
        </button>
      </nav>

      {activeTab === 'waiting' && (
        <>
          <section className="rounded-2xl border bg-white/80 p-5 shadow-sm">
            <label className="block max-w-xs space-y-2">
              <span className="text-sm font-medium">Ngày khám</span>

              <input
                type="date"
                value={date}
                onChange={(event) => changeDate(event.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              />
            </label>
          </section>

          {examinationsQuery.isLoading && <LoadingList />}

          {examinationsQuery.isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              Không tải được danh sách ca khám: {examinationsQuery.error.message}
            </div>
          )}

          {!examinationsQuery.isLoading &&
            !examinationsQuery.isError &&
            examinations.length === 0 && (
              <div className="rounded-2xl border border-dashed p-12 text-center">
                <CalendarDays className="mx-auto size-10 text-muted-foreground" />

                <p className="mt-3 font-medium">Không có bệnh nhân chờ khám</p>

                <p className="text-sm text-muted-foreground">
                  Chỉ lịch đã được xác nhận mới xuất hiện.
                </p>
              </div>
            )}

          <section className="space-y-3">
            {examinations.map((appointment) => (
              <article
                key={appointment.id}
                className="grid gap-4 rounded-2xl border bg-white/80 p-5 shadow-sm md:grid-cols-[1fr_auto]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold">{appointment.petName}</h2>

                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                      Chờ khám
                    </span>
                  </div>

                  <div className="grid gap-1 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-muted-foreground">Chủ nuôi:</span>{' '}
                      {appointment.customerName}
                    </p>

                    <p>
                      <span className="text-muted-foreground">Thời gian:</span>{' '}
                      {formatDateTime(appointment.startAt)}
                    </p>

                    <p>
                      <span className="text-muted-foreground">Dịch vụ:</span>{' '}
                      {appointment.serviceName}
                    </p>

                    <p>
                      <span className="text-muted-foreground">Thời lượng:</span>{' '}
                      {appointment.durationMin} phút
                    </p>
                  </div>

                  {appointment.note && (
                    <p className="text-sm text-muted-foreground">Ghi chú: {appointment.note}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <Link
                    href={`/doctor/examinations/${encodeURIComponent(appointment.id)}`}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white"
                  >
                    <Stethoscope className="size-4" />
                    Bắt đầu khám
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {waitingTotalPages > 1 && (
            <nav className="flex items-center justify-between">
              <button
                type="button"
                disabled={waitingPage === 0}
                onClick={() => setWaitingPage((current) => current - 1)}
                className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
                Trang trước
              </button>

              <span className="text-sm text-muted-foreground">
                Trang {waitingPage + 1}/{waitingTotalPages}
              </span>

              <button
                type="button"
                disabled={waitingPage + 1 >= waitingTotalPages}
                onClick={() => setWaitingPage((current) => current + 1)}
                className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm disabled:opacity-50"
              >
                Trang sau
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <>
          {historyQuery.isLoading && <LoadingList />}

          {historyQuery.isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              Không tải được lịch sử khám: {historyQuery.error.message}
            </div>
          )}

          {!historyQuery.isLoading && !historyQuery.isError && historyRecords.length === 0 && (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <History className="mx-auto size-10 text-muted-foreground" />

              <p className="mt-3 font-medium">Chưa có lịch sử khám</p>
            </div>
          )}

          <section className="space-y-3">
            {historyRecords.map((record) => (
              <article key={record.id} className="rounded-2xl border bg-white/80 p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{record.petName}</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Hoàn thành: {formatDateTime(record.completedAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {HEALTH_STATUS_LABELS[record.healthStatus]}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-muted/60 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Chẩn đoán</p>

                    <p className="mt-1 text-sm">
                      {record.diagnosis?.trim() || 'Chưa ghi chẩn đoán'}
                    </p>
                  </div>

                  <div className="rounded-xl bg-muted/60 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Cân nặng</p>

                    <p className="mt-1 text-sm">
                      {record.weightKg !== null ? `${record.weightKg} kg` : 'Chưa ghi nhận'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/doctor/examinations/history/${encodeURIComponent(record.id)}`}
                    className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium"
                  >
                    <Eye className="size-4" />
                    Xem bệnh án
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {historyTotalPages > 1 && (
            <nav className="flex items-center justify-between">
              <button
                type="button"
                disabled={historyPage === 0}
                onClick={() => setHistoryPage((current) => current - 1)}
                className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
                Trang trước
              </button>

              <span className="text-sm text-muted-foreground">
                Trang {historyPage + 1}/{historyTotalPages}
              </span>

              <button
                type="button"
                disabled={historyPage + 1 >= historyTotalPages}
                onClick={() => setHistoryPage((current) => current + 1)}
                className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm disabled:opacity-50"
              >
                Trang sau
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
