'use client';

import {
  Activity,
  ArrowLeft,
  CalendarClock,
  Cat,
  ChevronLeft,
  ChevronRight,
  Dog,
  RefreshCw,
  Scale,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useStaffPetAppointmentStatuses,
  useStaffPetCompletedHistory,
} from '@/features/customers/hooks/use-staff-pet-history';
import { useManagementPet } from '@/features/pets/hooks/use-pet-management';
import type { AppointmentStatus, PetHealthStatus } from '@/types/owner-pet-history';

interface StaffPetDetailPageProps {
  params: Promise<{
    customerId: string;
    petId: string;
  }>;
}

interface DetailItemProps {
  label: string;
  value: string;
}

const HISTORY_PAGE_SIZE = 5;

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Đã đặt lịch',
  CONFIRMED: 'Đã xác nhận',
  DONE: 'Đã khám xong',
  CANCELLED: 'Đã hủy',
  NO_SHOW: 'Không đến',
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  SCHEDULED: 'border-blue-200 bg-blue-50 text-blue-700',
  CONFIRMED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  DONE: 'border-zinc-200 bg-zinc-100 text-zinc-700',
  CANCELLED: 'border-rose-200 bg-rose-50 text-rose-700',
  NO_SHOW: 'border-amber-200 bg-amber-50 text-amber-700',
};

const HEALTH_LABELS: Record<PetHealthStatus, string> = {
  HEALTHY: 'Khỏe mạnh',
  MONITORING: 'Cần theo dõi',
  TREATMENT: 'Đang điều trị',
  CRITICAL: 'Nguy kịch',
  RECOVERING: 'Đang hồi phục',
};

const HEALTH_STYLES: Record<PetHealthStatus, string> = {
  HEALTHY: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  MONITORING: 'border-amber-200 bg-amber-50 text-amber-700',
  TREATMENT: 'border-blue-200 bg-blue-50 text-blue-700',
  CRITICAL: 'border-rose-200 bg-rose-50 text-rose-700',
  RECOVERING: 'border-violet-200 bg-violet-50 text-violet-700',
};

function formatSpecies(value: string): string {
  if (value === 'DOG') return 'Chó';
  if (value === 'CAT') return 'Mèo';

  return value || 'Chưa cập nhật';
}

function formatGender(value?: string | null): string {
  if (value === 'MALE') return 'Đực';
  if (value === 'FEMALE') return 'Cái';
  if (value === 'UNKNOWN') return 'Chưa xác định';

  return 'Chưa cập nhật';
}

function formatWeight(value?: number | null): string {
  if (value == null) {
    return 'Chưa cập nhật';
  }

  return `${new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2,
  }).format(value)} kg`;
}

function formatDate(value?: string | null): string {
  if (!value) {
    return 'Chưa cập nhật';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Chưa cập nhật';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value?: string | null): string {
  if (!value) {
    return 'Chưa cập nhật';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Chưa cập nhật';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function isPetHealthStatus(value: unknown): value is PetHealthStatus {
  return (
    value === 'HEALTHY' ||
    value === 'MONITORING' ||
    value === 'TREATMENT' ||
    value === 'CRITICAL' ||
    value === 'RECOVERING'
  );
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-xl border bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="h-72 rounded-xl" />
      <Skeleton className="h-60 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}

export default function StaffPetDetailPage({ params }: StaffPetDetailPageProps) {
  const { customerId, petId } = use(params);

  const [historyPage, setHistoryPage] = useState(0);

  const enabled = customerId.length > 0 && petId.length > 0;

  const petQuery = useManagementPet(petId, enabled);

  const statusesQuery = useStaffPetAppointmentStatuses(customerId, petId, enabled);

  const historyQuery = useStaffPetCompletedHistory(
    customerId,
    petId,
    historyPage,
    HISTORY_PAGE_SIZE,
    enabled
  );

  if (petQuery.isLoading) {
    return <PageSkeleton />;
  }

  if (petQuery.isError || !petQuery.data) {
    return (
      <Card className="mx-auto max-w-xl border-rose-200">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <p className="font-semibold text-rose-700">Không thể tải hồ sơ thú cưng</p>

          <p className="mt-2 text-sm text-zinc-500">
            {petQuery.error instanceof Error ? petQuery.error.message : 'Không tìm thấy thú cưng.'}
          </p>

          <div className="mt-5 flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={petQuery.isFetching}
              onClick={() => void petQuery.refetch()}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${petQuery.isFetching ? 'animate-spin' : ''}`} />
              Thử lại
            </Button>

            <Button asChild>
              <Link href={`/staff/customers/${encodeURIComponent(customerId)}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pet = petQuery.data;
  const SpeciesIcon = pet.species === 'DOG' ? Dog : Cat;

  const currentHealthStatus = isPetHealthStatus(pet.currentHealthStatus)
    ? pet.currentHealthStatus
    : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href={`/staff/customers/${encodeURIComponent(customerId)}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Danh sách thú cưng
        </Link>
      </Button>

      {/* Hồ sơ thú cưng */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-rose-500 to-amber-400" />

        <CardHeader>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <SpeciesIcon className="h-8 w-8" />
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-2xl">{pet.name}</CardTitle>

              <p className="mt-1 text-sm text-zinc-500">
                {formatSpecies(pet.species)}
                {pet.breed ? ` · ${pet.breed}` : ''}
              </p>

              <p className="mt-2 flex items-center text-sm text-zinc-500">
                <UserRound className="mr-1.5 h-4 w-4" />
                Chủ pet: {pet.customerName || 'Chưa cập nhật'}
              </p>
            </div>

            {currentHealthStatus && (
              <Badge variant="outline" className={HEALTH_STYLES[currentHealthStatus]}>
                {HEALTH_LABELS[currentHealthStatus]}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Loài" value={formatSpecies(pet.species)} />

            <DetailItem label="Giống" value={pet.breed || 'Chưa cập nhật'} />

            <DetailItem label="Giới tính" value={formatGender(pet.gender)} />

            <DetailItem label="Ngày sinh" value={formatDate(pet.birthDate)} />

            <DetailItem label="Cân nặng" value={formatWeight(pet.weightKg)} />

            <DetailItem label="Khám gần nhất" value={formatDateTime(pet.lastExaminedAt)} />

            <DetailItem
              label="Số điện thoại chủ pet"
              value={pet.customerPhone || 'Chưa cập nhật'}
            />

            <DetailItem label="Email chủ pet" value={pet.customerEmail || 'Chưa cập nhật'} />
          </div>

          {pet.currentHealthNote && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">Lưu ý sức khỏe</p>

              <p className="mt-1 whitespace-pre-wrap text-sm text-amber-800">
                {pet.currentHealthNote}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trạng thái lịch khám */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-rose-600" />
            Trạng thái lịch khám
          </CardTitle>
        </CardHeader>

        <CardContent>
          {statusesQuery.isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {statusesQuery.isError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm text-rose-700">Không thể tải trạng thái lịch khám.</p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => void statusesQuery.refetch()}
              >
                Thử lại
              </Button>
            </div>
          )}

          {!statusesQuery.isLoading &&
            !statusesQuery.isError &&
            statusesQuery.data?.length === 0 && (
              <p className="rounded-xl bg-zinc-50 p-5 text-sm text-zinc-500">
                Thú cưng chưa có lịch khám.
              </p>
            )}

          {statusesQuery.data && statusesQuery.data.length > 0 && (
            <div className="space-y-3">
              {statusesQuery.data.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                >
                  <div>
                    <p className="font-medium">{appointment.serviceName}</p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {formatDateTime(appointment.startAt)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLES[appointment.status]
                    }`}
                  >
                    {STATUS_LABELS[appointment.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lịch sử khám */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-rose-600" />
            Lịch sử khám hoàn tất
          </CardTitle>
        </CardHeader>

        <CardContent>
          {historyQuery.isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          )}

          {historyQuery.isError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm text-rose-700">Không thể tải lịch sử khám.</p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => void historyQuery.refetch()}
              >
                Thử lại
              </Button>
            </div>
          )}

          {!historyQuery.isLoading && !historyQuery.isError && historyQuery.data?.empty && (
            <p className="rounded-xl bg-zinc-50 p-5 text-sm text-zinc-500">
              Chưa có lần khám nào hoàn tất.
            </p>
          )}

          {historyQuery.data && !historyQuery.data.empty && (
            <>
              <div className="space-y-5">
                {historyQuery.data.content.map((visit) => {
                  const visitHealthStatus = isPetHealthStatus(visit.healthStatus)
                    ? visit.healthStatus
                    : null;

                  return (
                    <article key={visit.medicalRecordId} className="rounded-xl border p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{visit.serviceName}</p>

                          <p className="mt-1 text-sm text-zinc-500">
                            Hoàn tất: {formatDateTime(visit.completedAt)}
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">Bác sĩ: {visit.doctorName}</p>
                        </div>

                        {visitHealthStatus && (
                          <Badge variant="outline" className={HEALTH_STYLES[visitHealthStatus]}>
                            {HEALTH_LABELS[visitHealthStatus]}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <DetailItem label="Ngày khám" value={formatDateTime(visit.examinedAt)} />

                        <DetailItem label="Cân nặng" value={formatWeight(visit.weightKg)} />
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                          <p className="flex items-center gap-2 text-sm font-semibold">
                            <Activity className="h-4 w-4 text-rose-600" />
                            Chẩn đoán
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">
                            {visit.diagnosis?.trim() || 'Chưa cập nhật'}
                          </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                            Hướng điều trị
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm text-blue-800 dark:text-blue-300">
                            {visit.treatmentPlan?.trim() || 'Chưa cập nhật'}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={historyQuery.data.first || historyQuery.isFetching}
                  onClick={() => setHistoryPage((current) => Math.max(current - 1, 0))}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Trước
                </Button>

                <span className="text-sm text-zinc-500">
                  Trang {historyQuery.data.number + 1}/{historyQuery.data.totalPages}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  disabled={historyQuery.data.last || historyQuery.isFetching}
                  onClick={() => setHistoryPage((current) => current + 1)}
                >
                  Sau
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
