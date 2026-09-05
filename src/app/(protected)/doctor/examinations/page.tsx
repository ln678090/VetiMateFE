'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  History,
  Stethoscope,
  AlertTriangle,
  UserPlus,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Activity,
} from 'lucide-react';

import { useManagementAppointments } from '@/features/booking/hooks/use-clinic';
import { useExaminationHistory } from '@/features/examination/hooks/use-examination';
import {
  useIncidents,
  useSlaReminders,
} from '@/features/examination/hooks/use-doctor-clinical';
import { WalkInReceptionModal } from '@/features/examination/components/WalkInReceptionModal';
import { formatDateTime } from '@/lib/utils';

import type { PetHealthStatus, MedicalIncident } from '@/types/examination';

type ExaminationTab = 'waiting' | 'history' | 'incidents';

const PAGE_SIZE = 20;

const HEALTH_STATUS_LABELS: Record<PetHealthStatus, string> = {
  HEALTHY: 'Khỏe mạnh',
  MONITORING: 'Cần theo dõi',
  TREATMENT: 'Đang điều trị',
  CRITICAL: 'Nghiêm trọng',
  RECOVERING: 'Đang hồi phục',
};

const INCIDENT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  DRUG_SHOCK: { label: 'Shock phản vệ / Thuốc', color: 'bg-red-100 text-red-700 border-red-200' },
  DEATH: { label: 'Tử vong', color: 'bg-black text-white border-zinc-900' },
  SURGICAL_COMPLICATION: { label: 'Biến chứng phẫu thuật', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  CUSTOMER_COMPLAINT: { label: 'Khiếu nại khách hàng', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  MEDICATION_ERROR: { label: 'Sai sót dùng thuốc', color: 'bg-orange-100 text-orange-700 border-orange-200' },
};

const SEVERITY_LABELS: Record<string, { label: string; color: string }> = {
  CRITICAL: { label: 'Cực kỳ nghiêm trọng', color: 'bg-red-600 text-white' },
  HIGH: { label: 'Nghiêm trọng', color: 'bg-rose-500 text-white' },
  MEDIUM: { label: 'Trung bình', color: 'bg-amber-500 text-white' },
  LOW: { label: 'Nhẹ', color: 'bg-zinc-500 text-white' },
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
        <div key={index} className="h-32 animate-pulse rounded-3xl bg-muted" />
      ))}
    </div>
  );
}

export default function DoctorExaminationsPage() {
  const [activeTab, setActiveTab] = useState<ExaminationTab>('waiting');
  const [date, setDate] = useState(getLocalDate);
  const [waitingPage, setWaitingPage] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [incidentPage, setIncidentPage] = useState(0);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  // SLA Reminders
  const slaRemindersQuery = useSlaReminders();
  const slaReminders = slaRemindersQuery.data ?? [];

  // Waiting Appointments
  const examinationsQuery = useManagementAppointments({
    date,
    status: 'CONFIRMED',
    page: waitingPage,
    size: PAGE_SIZE,
  });

  // History Records
  const historyQuery = useExaminationHistory(historyPage, PAGE_SIZE, activeTab === 'history');

  // Incidents Query
  const incidentsQuery = useIncidents({
    page: incidentPage,
    size: PAGE_SIZE,
  });

  const examinations = useMemo(
    () =>
      [...(examinationsQuery.data?.content ?? [])].sort(
        (first, second) => new Date(first.startAt).getTime() - new Date(second.startAt).getTime()
      ),
    [examinationsQuery.data?.content]
  );

  const historyRecords = historyQuery.data?.content ?? [];
  const incidentRecords = incidentsQuery.data?.content ?? [];

  const waitingTotalPages = examinationsQuery.data?.totalPages ?? 0;
  const waitingTotalElements = examinationsQuery.data?.totalElements ?? 0;

  const historyTotalPages = historyQuery.data?.totalPages ?? 0;
  const historyTotalElements = historyQuery.data?.totalElements ?? 0;

  const incidentTotalPages = incidentsQuery.data?.totalPages ?? 0;
  const incidentTotalElements = incidentsQuery.data?.totalElements ?? 0;

  function changeDate(value: string): void {
    setDate(value);
    setWaitingPage(0);
  }

  function changeTab(tab: ExaminationTab): void {
    setActiveTab(tab);
    if (tab === 'history') setHistoryPage(0);
    if (tab === 'incidents') setIncidentPage(0);
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 py-8">
      {/* SLA 24h Overdue Warning Banner */}
      {slaReminders.length > 0 && (
        <section className="rounded-3xl border border-red-300 bg-gradient-to-r from-red-500/15 via-rose-500/10 to-amber-500/15 p-5 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm shrink-0">
                <Clock className="size-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-900 dark:text-red-300 flex items-center gap-2">
                  <span>Cảnh báo SLA: Có {slaReminders.length} ca bệnh bất thường chưa có phác đồ điều trị sau 24h!</span>
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                    Khẩn cấp
                  </span>
                </h3>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                  Chỉ số xét nghiệm máu/nước tiểu vượt ngưỡng cảnh báo nhưng chưa được bác sĩ thiết lập phác đồ xử lý.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {slaReminders.map((reminder) => (
                    <Link
                      key={reminder.medicalRecordId}
                      href={`/doctor/examinations/history/${encodeURIComponent(reminder.medicalRecordId)}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-white/90 px-3 py-1 text-xs font-semibold text-red-800 shadow-2xs hover:bg-red-50 dark:bg-zinc-800 dark:text-red-300"
                    >
                      <span>🐾 {reminder.petName} ({reminder.hoursPending}h trễ)</span>
                      <ArrowRight className="size-3 text-red-600" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-3xl font-black tracking-tight text-transparent">
            Quản Lý Khám Bệnh & Bệnh Án
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Bác sĩ tiếp nhận ca khám, kê đơn đối chiếu phác đồ và quản lý rủi ro y tế.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsWalkInModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-rose-600 px-4 text-xs font-bold text-white shadow-md shadow-rose-600/30 hover:bg-rose-700 transition-all"
          >
            <UserPlus className="size-4" />
            + Tiếp nhận ca Walk-in
          </button>

          <div className="rounded-2xl bg-rose-50 px-4 py-2 text-center border border-rose-100 dark:bg-zinc-800 dark:border-zinc-700">
            <p className="text-xl font-black text-rose-600">
              {activeTab === 'waiting'
                ? waitingTotalElements
                : activeTab === 'history'
                ? historyTotalElements
                : incidentTotalElements}
            </p>
            <p className="text-[11px] font-medium text-rose-700 dark:text-rose-400">
              {activeTab === 'waiting' ? 'Chờ khám' : activeTab === 'history' ? 'Hồ sơ đã khám' : 'Sự cố rủi ro'}
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="inline-flex rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => changeTab('waiting')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'waiting'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Stethoscope className="size-4" />
          Hàng chờ khám ({waitingTotalElements})
        </button>

        <button
          type="button"
          onClick={() => changeTab('history')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <History className="size-4" />
          Lịch sử bệnh án ({historyTotalElements})
        </button>

        <button
          type="button"
          onClick={() => changeTab('incidents')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'incidents'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <ShieldAlert className="size-4" />
          Sự cố Y khoa & Rủi ro ({incidentTotalElements})
        </button>
      </nav>

      {/* Tab 1: Waiting Appointments */}
      {activeTab === 'waiting' && (
        <>
          <section className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
            <label className="block max-w-xs space-y-1.5">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Lọc theo ngày khám
              </span>
              <input
                type="date"
                value={date}
                onChange={(event) => changeDate(event.target.value)}
                className="h-10 w-full rounded-xl border bg-background px-3 text-xs font-semibold"
              />
            </label>
          </section>

          {examinationsQuery.isLoading && <LoadingList />}

          {examinationsQuery.isError && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-xs text-red-700">
              Không tải được danh sách ca khám: {examinationsQuery.error.message}
            </div>
          )}

          {!examinationsQuery.isLoading && !examinationsQuery.isError && examinations.length === 0 && (
            <div className="rounded-3xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
              <CalendarDays className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-bold">Không có bệnh nhân chờ khám trong ngày này</p>
              <p className="text-xs text-muted-foreground">
                Lịch đã được lễ tân xác nhận hoặc ca Walk-in mới tiếp nhận sẽ xuất hiện ở đây.
              </p>
            </div>
          )}

          <section className="space-y-3">
            {examinations.map((appointment) => (
              <article
                key={appointment.id}
                className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-rose-300 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-[1fr_auto]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                      🐾 {appointment.petName}
                    </h2>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                      Chờ khám
                    </span>
                  </div>

                  <div className="grid gap-1.5 text-xs sm:grid-cols-2 lg:grid-cols-4 text-zinc-600 dark:text-zinc-400">
                    <p>
                      <span className="text-muted-foreground">Chủ nuôi:</span> <strong>{appointment.customerName}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Thời gian:</span> <strong>{formatDateTime(appointment.startAt)}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Dịch vụ:</span> <strong className="text-rose-600">{appointment.serviceName}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Thời lượng:</span> <strong>{appointment.durationMin} phút</strong>
                    </p>
                  </div>

                  {appointment.note && (
                    <p className="text-xs italic text-muted-foreground">
                      Ghi chú: {appointment.note}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <Link
                    href={`/doctor/examinations/${encodeURIComponent(appointment.id)}`}
                    className="inline-flex h-10 items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                  >
                    <Stethoscope className="size-4" />
                    Bắt đầu khám
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {waitingTotalPages > 1 && (
            <nav className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={waitingPage === 0}
                onClick={() => setWaitingPage((current) => current - 1)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
                Trang trước
              </button>

              <span className="text-xs text-muted-foreground">
                Trang {waitingPage + 1} / {waitingTotalPages}
              </span>

              <button
                type="button"
                disabled={waitingPage + 1 >= waitingTotalPages}
                onClick={() => setWaitingPage((current) => current + 1)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold disabled:opacity-50"
              >
                Trang sau
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </>
      )}

      {/* Tab 2: Examination History */}
      {activeTab === 'history' && (
        <>
          {historyQuery.isLoading && <LoadingList />}

          {historyQuery.isError && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-xs text-red-700">
              Không tải được lịch sử khám: {historyQuery.error.message}
            </div>
          )}

          {!historyQuery.isLoading && !historyQuery.isError && historyRecords.length === 0 && (
            <div className="rounded-3xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
              <History className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-bold">Chưa có lịch sử khám bệnh</p>
            </div>
          )}

          <section className="space-y-3">
            {historyRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                      🐾 {record.petName}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Hoàn tất khám: {formatDateTime(record.completedAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    {HEALTH_STATUS_LABELS[record.healthStatus]}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-zinc-50 p-3.5 dark:bg-zinc-800/50">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Chẩn đoán
                    </p>
                    <p className="mt-1 text-xs font-semibold text-rose-700 dark:text-rose-400">
                      {record.diagnosis?.trim() || 'Chưa ghi chẩn đoán'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-3.5 dark:bg-zinc-800/50">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Cân nặng
                    </p>
                    <p className="mt-1 text-xs font-semibold">
                      {record.weightKg !== null ? `${record.weightKg} kg` : 'Chưa ghi nhận'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/doctor/examinations/history/${encodeURIComponent(record.id)}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-300 px-3.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 transition-colors"
                  >
                    <Eye className="size-4" />
                    Xem chi tiết bệnh án
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {historyTotalPages > 1 && (
            <nav className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={historyPage === 0}
                onClick={() => setHistoryPage((current) => current - 1)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
                Trang trước
              </button>

              <span className="text-xs text-muted-foreground">
                Trang {historyPage + 1} / {historyTotalPages}
              </span>

              <button
                type="button"
                disabled={historyPage + 1 >= historyTotalPages}
                onClick={() => setHistoryPage((current) => current + 1)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold disabled:opacity-50"
              >
                Trang sau
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </>
      )}

      {/* Tab 3: Incidents & Risk Auditing Log */}
      {activeTab === 'incidents' && (
        <>
          {incidentsQuery.isLoading && <LoadingList />}

          {incidentsQuery.isError && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-xs text-red-700">
              Không tải được danh sách sự cố y khoa: {incidentsQuery.error.message}
            </div>
          )}

          {!incidentsQuery.isLoading && !incidentsQuery.isError && incidentRecords.length === 0 && (
            <div className="rounded-3xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
              <ShieldAlert className="mx-auto size-10 text-emerald-600" />
              <p className="mt-3 text-sm font-bold">Không ghi nhận sự cố rủi ro y tế nào</p>
              <p className="text-xs text-muted-foreground">
                Phòng khám duy trì chuẩn an toàn điều trị nghiêm ngặt.
              </p>
            </div>
          )}

          <section className="space-y-4">
            {incidentRecords.map((incident: MedicalIncident) => {
              const typeMeta = INCIDENT_TYPE_LABELS[incident.incidentType] ?? {
                label: incident.incidentType,
                color: 'bg-zinc-100 text-zinc-800 border-zinc-200',
              };
              const sevMeta = SEVERITY_LABELS[incident.severity] ?? {
                label: incident.severity,
                color: 'bg-zinc-500 text-white',
              };

              return (
                <article
                  key={incident.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-lg px-2.5 py-0.5 text-xs font-bold border ${typeMeta.color}`}>
                          {typeMeta.label}
                        </span>
                        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase ${sevMeta.color}`}>
                          {sevMeta.label}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          Mã: #{incident.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        {incident.title}
                      </h3>
                    </div>

                    <div className="text-right text-xs text-muted-foreground">
                      <p>Ngày báo cáo: {formatDateTime(incident.reportedAt || incident.createdAt)}</p>
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Bác sĩ: {incident.doctorName}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <div>
                      <span className="text-muted-foreground">Bệnh nhân:</span> <strong>🐾 {incident.petName}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chủ nuôi:</span> <strong>{incident.customerName}</strong>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-200">
                    <p className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
                      Mô tả diễn biến:
                    </p>
                    <p>{incident.description}</p>
                  </div>

                  {(incident.rootCause || incident.immediateAction || incident.correctiveAction) && (
                    <div className="grid gap-3 sm:grid-cols-3 text-xs">
                      {incident.rootCause && (
                        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-3 dark:border-red-950 dark:bg-red-950/20">
                          <p className="font-bold text-red-700 dark:text-red-400 text-[10px] uppercase">Nguyên nhân gốc:</p>
                          <p className="mt-1 text-zinc-700 dark:text-zinc-300">{incident.rootCause}</p>
                        </div>
                      )}
                      {incident.immediateAction && (
                        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3 dark:border-amber-950 dark:bg-amber-950/20">
                          <p className="font-bold text-amber-700 dark:text-amber-400 text-[10px] uppercase">Xử lý tức thì:</p>
                          <p className="mt-1 text-zinc-700 dark:text-zinc-300">{incident.immediateAction}</p>
                        </div>
                      )}
                      {incident.correctiveAction && (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-950 dark:bg-emerald-950/20">
                          <p className="font-bold text-emerald-700 dark:text-emerald-400 text-[10px] uppercase">Hành động khắc phục:</p>
                          <p className="mt-1 text-zinc-700 dark:text-zinc-300">{incident.correctiveAction}</p>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          {incidentTotalPages > 1 && (
            <nav className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={incidentPage === 0}
                onClick={() => setIncidentPage((current) => current - 1)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
                Trang trước
              </button>

              <span className="text-xs text-muted-foreground">
                Trang {incidentPage + 1} / {incidentTotalPages}
              </span>

              <button
                type="button"
                disabled={incidentPage + 1 >= incidentTotalPages}
                onClick={() => setIncidentPage((current) => current + 1)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold disabled:opacity-50"
              >
                Trang sau
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </>
      )}

      {/* Walk-In Reception Modal */}
      <WalkInReceptionModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
      />
    </main>
  );
}
