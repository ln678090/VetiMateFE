'use client';

import { useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, CircleCheck, X } from 'lucide-react';

import {
  useManagementAppointments,
  useUpdateAppointmentStatus,
} from '@/features/booking/hooks/use-clinic';
import { formatDateTime, formatVND } from '@/lib/utils';
import type { AppointmentStatus } from '@/types/clinic';

type StatusFilter = AppointmentStatus | 'ALL';

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  ARRIVED: 'Đã đến',
  DONE: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  NO_SHOW: 'Không đến',
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  SCHEDULED: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  ARRIVED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  DONE: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  NO_SHOW: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
};

function getLocalDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function ManagementAppointmentsPage() {
  const [date, setDate] = useState(getLocalDate);
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(0);

  const appointmentsQuery = useManagementAppointments({
    startDate: date,
    endDate: date,
    status: status === 'ALL' ? undefined : status,
    page,
    size: 20,
  });

  const updateStatusMutation = useUpdateAppointmentStatus();

  const appointments = appointmentsQuery.data?.content ?? [];
  const totalPages = appointmentsQuery.data?.totalPages ?? 0;
  const totalElements = appointmentsQuery.data?.totalElements ?? 0;

  function changeStatusFilter(value: StatusFilter) {
    setStatus(value);
    setPage(0);
  }

  function changeDate(value: string) {
    setDate(value);
    setPage(0);
  }

  function updateStatus(appointmentId: string, nextStatus: AppointmentStatus) {
    updateStatusMutation.mutate({
      appointmentId,
      status: nextStatus,
    });
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 py-8">
      <header>
        <h1 className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-3xl font-bold text-transparent">
          Quản lý lịch khám
        </h1>

        <p className="mt-1 text-muted-foreground">Theo dõi và xử lý lịch hẹn của khách hàng.</p>
      </header>

      <section className="grid gap-4 rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur-xl md:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium">Ngày khám</span>

          <input
            type="date"
            value={date}
            onChange={(event) => changeDate(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Trạng thái</span>

          <select
            value={status}
            onChange={(event) => changeStatusFilter(event.target.value as StatusFilter)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="SCHEDULED">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="DONE">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="NO_SHOW">Không đến</option>
          </select>
        </label>

        <div className="flex items-end">
          <div className="rounded-xl bg-rose-50 px-5 py-2 text-center">
            <p className="text-2xl font-bold text-rose-600">{totalElements}</p>
            <p className="text-xs text-rose-700">Lịch hẹn</p>
          </div>
        </div>
      </section>

      {appointmentsQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      )}

      {appointmentsQuery.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Không tải được danh sách lịch khám. Hãy kiểm tra quyền tài khoản và kết nối backend.
        </div>
      )}

      {!appointmentsQuery.isLoading && !appointmentsQuery.isError && appointments.length === 0 && (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <CalendarDays className="mx-auto size-10 text-muted-foreground" />

          <p className="mt-3 font-medium">Không có lịch khám phù hợp</p>

          <p className="text-sm text-muted-foreground">Hãy chọn ngày hoặc trạng thái khác.</p>
        </div>
      )}

      <section className="space-y-3">
        {appointments.map((appointment) => (
          <article
            key={appointment.id}
            className="grid gap-4 rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur-xl lg:grid-cols-[1.3fr_1fr_auto]"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{appointment.petName}</h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    STATUS_STYLES[appointment.status]
                  }`}
                >
                  {STATUS_LABELS[appointment.status]}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                Khách hàng: {appointment.customerName}
              </p>

              <p className="text-sm text-muted-foreground">Dịch vụ: {appointment.serviceName}</p>

              {appointment.note && (
                <p className="text-sm text-muted-foreground">Ghi chú: {appointment.note}</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="font-medium">{formatDateTime(appointment.startAt)}</p>

              <p className="text-sm text-muted-foreground">
                Thời lượng: {appointment.durationMin} phút
              </p>

              <p className="font-semibold text-rose-600">{formatVND(appointment.priceSnapshot)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {appointment.status === 'SCHEDULED' && (
                <button
                  type="button"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => updateStatus(appointment.id, 'CONFIRMED')}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Check className="size-4" />
                  Xác nhận
                </button>
              )}

              {appointment.status === 'CONFIRMED' && (
                <>
                  <button
                    type="button"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => updateStatus(appointment.id, 'DONE')}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CircleCheck className="size-4" />
                    Hoàn thành
                  </button>

                  <button
                    type="button"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => updateStatus(appointment.id, 'NO_SHOW')}
                    className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
                  >
                    Không đến
                  </button>
                </>
              )}

              {['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && (
                <button
                  type="button"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => updateStatus(appointment.id, 'CANCELLED')}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <X className="size-4" />
                  Hủy
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      {totalPages > 1 && (
        <nav className="flex items-center justify-between">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
            Trang trước
          </button>

          <span className="text-sm text-muted-foreground">
            Trang {page + 1}/{totalPages}
          </span>

          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm disabled:opacity-50"
          >
            Trang sau
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </main>
  );
}
