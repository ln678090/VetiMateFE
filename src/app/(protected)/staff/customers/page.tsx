'use client';

import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Mail,
  PawPrint,
  Phone,
  RefreshCw,
  Search,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useStaffCustomers } from '@/features/customers/hooks/use-staff-customers';
import type { AppointmentStatus, StaffCustomerFilter } from '@/types/staff-customer';

const PAGE_SIZE = 12;

const FILTER_OPTIONS: Array<{
  value: StaffCustomerFilter;
  label: string;
}> = [
  {
    value: 'ALL',
    label: 'Tất cả khách hàng',
  },
  {
    value: 'TODAY',
    label: 'Có lịch hôm nay',
  },
  {
    value: 'UPCOMING',
    label: 'Có lịch sắp tới',
  },
  {
    value: 'COMPLETED',
    label: 'Đã từng khám',
  },
  {
    value: 'NO_APPOINTMENT',
    label: 'Chưa từng đặt lịch',
  },
];

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

function formatDateTime(value: string | null): string {
  if (!value) {
    return 'Chưa có lịch';
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

function CustomerGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>

          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-16 w-full" />
          </CardContent>

          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function StaffCustomersPage() {
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<StaffCustomerFilter>('ALL');
  const [page, setPage] = useState(0);

  const [debouncedKeyword] = useDebounce(keyword, 400);

  const customerQuery = useStaffCustomers({
    keyword: debouncedKeyword,
    filter,
    page,
    size: PAGE_SIZE,
  });

  const customers = customerQuery.data?.content ?? [];

  const totalPages = customerQuery.data?.totalPages ?? 0;

  function handleFilterChange(value: StaffCustomerFilter): void {
    setFilter(value);
    setPage(0);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Khách hàng và thú cưng
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Tra cứu khách hàng, số lượng thú cưng và trạng thái lịch khám gần nhất.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <Input
              value={keyword}
              maxLength={100}
              placeholder="Tìm theo tên, số điện thoại hoặc email..."
              className="pl-9"
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(0);
              }}
            />
          </div>

          <select
            value={filter}
            aria-label="Lọc khách hàng"
            className="h-10 rounded-md border bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            onChange={(event) => handleFilterChange(event.target.value as StaffCustomerFilter)}
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {customerQuery.isLoading && <CustomerGridSkeleton />}

      {customerQuery.isError && (
        <Card className="border-rose-200">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <p className="font-medium text-rose-700">Không thể tải danh sách khách hàng</p>

            <p className="mt-2 text-sm text-zinc-500">{customerQuery.error.message}</p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              disabled={customerQuery.isFetching}
              onClick={() => void customerQuery.refetch()}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${customerQuery.isFetching ? 'animate-spin' : ''}`}
              />
              Thử lại
            </Button>
          </CardContent>
        </Card>
      )}

      {!customerQuery.isLoading && !customerQuery.isError && customers.length === 0 && (
        <div className="rounded-xl border bg-white p-12 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
          Không tìm thấy khách hàng phù hợp.
        </div>
      )}

      {!customerQuery.isLoading && !customerQuery.isError && customers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {customers.map((customer) => {
            const status = customer.latestAppointmentStatus;

            return (
              <Card
                key={customer.id}
                className="overflow-hidden transition hover:border-indigo-300 hover:shadow-md"
              >
                <CardHeader className="border-b bg-zinc-50/60 pb-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold">
                        {customer.fullName || 'Chưa cập nhật tên'}
                      </h2>

                      <p className="mt-1 flex items-center text-xs text-zinc-500">
                        <UserRound className="mr-1 h-3.5 w-3.5" />
                        Mã khách hàng: {customer.id.split('-')[0].toUpperCase()}
                      </p>
                    </div>

                    <Badge variant="secondary">
                      <PawPrint className="mr-1 h-3.5 w-3.5" />
                      {customer.petCount} pet
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 py-4">
                  <p className="flex items-center text-sm text-zinc-600 dark:text-zinc-300">
                    <Phone className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
                    {customer.phone || 'Chưa cập nhật SĐT'}
                  </p>

                  <p className="flex items-center text-sm text-zinc-600 dark:text-zinc-300">
                    <Mail className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />

                    <span className="truncate">{customer.email || 'Chưa cập nhật email'}</span>
                  </p>

                  <div className="rounded-lg border bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center text-xs font-medium text-zinc-500">
                        <CalendarClock className="mr-1 h-3.5 w-3.5" />
                        Lịch gần nhất
                      </span>

                      {status ? (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}
                        >
                          {STATUS_LABELS[status]}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">Chưa có lịch</span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {formatDateTime(customer.latestAppointmentAt)}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-zinc-50/50 py-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/staff/customers/${encodeURIComponent(customer.id)}`}>
                      <PawPrint className="mr-2 h-4 w-4" />
                      Xem thú cưng
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-zinc-500">
            Trang {page + 1}/{totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page === 0 || customerQuery.isFetching}
              onClick={() => setPage((current) => Math.max(current - 1, 0))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Trước
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1 || customerQuery.isFetching}
              onClick={() => setPage((current) => Math.min(current + 1, totalPages - 1))}
            >
              Tiếp
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
