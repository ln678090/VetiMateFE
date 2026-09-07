'use client';

import {
  ArrowLeft,
  CalendarClock,
  Cat,
  Dog,
  RefreshCw,
  Scale,
  Search,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useManagementPets } from '@/features/pets/hooks/use-pet-management';

interface StaffCustomerPetsPageProps {
  params: Promise<{
    customerId: string;
  }>;
}

type SpeciesFilter = 'ALL' | 'DOG' | 'CAT';

const PAGE_SIZE = 12;

const HEALTH_STATUS_LABELS: Record<string, string> = {
  HEALTHY: 'Khỏe mạnh',
  MONITORING: 'Cần theo dõi',
  TREATMENT: 'Đang điều trị',
  CRITICAL: 'Nguy kịch',
  RECOVERING: 'Đang hồi phục',
};

const HEALTH_STATUS_STYLES: Record<string, string> = {
  HEALTHY: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  MONITORING: 'border-amber-200 bg-amber-50 text-amber-700',
  TREATMENT: 'border-blue-200 bg-blue-50 text-blue-700',
  CRITICAL: 'border-rose-200 bg-rose-50 text-rose-700',
  RECOVERING: 'border-violet-200 bg-violet-50 text-violet-700',
};

function formatSpecies(species: string): string {
  if (species === 'DOG') return 'Chó';
  if (species === 'CAT') return 'Mèo';

  return species || 'Chưa cập nhật';
}

function formatGender(gender?: string | null): string {
  if (gender === 'MALE') return 'Đực';
  if (gender === 'FEMALE') return 'Cái';

  return 'Chưa xác định';
}

function formatWeight(weightKg?: number | null): string {
  if (weightKg == null) {
    return 'Chưa cập nhật';
  }

  return `${new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2,
  }).format(weightKg)} kg`;
}

function formatDate(value?: string | null): string {
  if (!value) {
    return 'Chưa khám';
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

function PetGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-72 rounded-xl" />
      ))}
    </div>
  );
}

export default function StaffCustomerPetsPage({ params }: StaffCustomerPetsPageProps) {
  const { customerId } = use(params);

  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [species, setSpecies] = useState<SpeciesFilter>('ALL');

  const [debouncedKeyword] = useDebounce(keyword, 400);

  const petsQuery = useManagementPets(
    {
      customerId,
      keyword: debouncedKeyword.trim() || undefined,
      species: species === 'ALL' ? undefined : species,
      deleted: false,
      page,
      size: PAGE_SIZE,
      sort: 'name,asc',
    },
    Boolean(customerId)
  );

  const pets = petsQuery.data?.content ?? [];
  const totalPages = petsQuery.data?.totalPages ?? 0;

  const customerName = pets[0]?.customerName || 'Khách hàng';

  function handleSpeciesChange(value: SpeciesFilter): void {
    setSpecies(value);
    setPage(0);
  }

  return (
    <div className="space-y-6">
      <header>
        <Button asChild variant="ghost" className="-ml-3 mb-2">
          <Link href="/staff/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Danh sách khách hàng
          </Link>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight">Thú cưng của {customerName}</h1>

        <p className="mt-1 text-sm text-zinc-500">
          Tra cứu hồ sơ và tình trạng sức khỏe hiện tại của thú cưng.
        </p>
      </header>

      {/* Bộ lọc */}
      <section className="rounded-xl border bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <Input
              value={keyword}
              maxLength={100}
              placeholder="Tìm theo tên hoặc giống thú cưng..."
              className="pl-9"
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(0);
              }}
            />
          </div>

          <select
            value={species}
            aria-label="Lọc theo loài"
            className="h-10 rounded-md border bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            onChange={(event) => handleSpeciesChange(event.target.value as SpeciesFilter)}
          >
            <option value="ALL">Tất cả loài</option>
            <option value="DOG">Chó</option>
            <option value="CAT">Mèo</option>
          </select>
        </div>
      </section>

      {petsQuery.isLoading && <PetGridSkeleton />}

      {petsQuery.isError && (
        <Card className="border-rose-200">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <p className="font-medium text-rose-700">Không thể tải danh sách thú cưng</p>

            <p className="mt-2 text-sm text-zinc-500">{petsQuery.error.message}</p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              disabled={petsQuery.isFetching}
              onClick={() => void petsQuery.refetch()}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${petsQuery.isFetching ? 'animate-spin' : ''}`} />
              Thử lại
            </Button>
          </CardContent>
        </Card>
      )}

      {!petsQuery.isLoading && !petsQuery.isError && pets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-zinc-500">
            Không tìm thấy thú cưng phù hợp.
          </CardContent>
        </Card>
      )}

      {!petsQuery.isLoading && !petsQuery.isError && pets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => {
            const SpeciesIcon = pet.species === 'DOG' ? Dog : Cat;

            const healthStatus = pet.currentHealthStatus;

            return (
              <Card key={pet.id} className="overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-rose-500 to-amber-400" />

                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <SpeciesIcon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-lg">{pet.name}</CardTitle>

                      <p className="mt-1 text-sm text-zinc-500">
                        {formatSpecies(pet.species)}
                        {pet.breed ? ` · ${pet.breed}` : ''}
                      </p>
                    </div>

                    {healthStatus && (
                      <Badge variant="outline" className={HEALTH_STATUS_STYLES[healthStatus] ?? ''}>
                        {HEALTH_STATUS_LABELS[healthStatus] ?? healthStatus}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                      <p className="text-xs text-zinc-500">Giới tính</p>

                      <p className="mt-1 font-medium">{formatGender(pet.gender)}</p>
                    </div>

                    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                      <p className="flex items-center text-xs text-zinc-500">
                        <Scale className="mr-1 h-3.5 w-3.5" />
                        Cân nặng
                      </p>

                      <p className="mt-1 font-medium">{formatWeight(pet.weightKg)}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="flex items-center text-xs text-zinc-500">
                      <CalendarClock className="mr-1 h-3.5 w-3.5" />
                      Lần khám gần nhất
                    </p>

                    <p className="mt-1 text-sm font-medium">{formatDate(pet.lastExaminedAt)}</p>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={`/staff/customers/${encodeURIComponent(
                        customerId
                      )}/pets/${encodeURIComponent(pet.id)}`}
                    >
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            Trang {page + 1}/{totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page === 0 || petsQuery.isFetching}
              onClick={() => setPage((current) => Math.max(current - 1, 0))}
            >
              Trước
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPages - 1 || petsQuery.isFetching}
              onClick={() => setPage((current) => Math.min(current + 1, totalPages - 1))}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
