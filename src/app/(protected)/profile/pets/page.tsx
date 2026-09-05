'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyCustomer, useMyPets } from '@/features/booking/hooks/use-clinic';
import type { PetDto } from '@/types/clinic';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Heart,
  PawPrint,
  Plus,
  Scale,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

function calculateAge(birthDate?: string | null): string {
  if (!birthDate) return 'Chưa rõ';
  try {
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    const totalMonths = years * 12 + months;

    if (totalMonths < 1) return 'Dưới 1 tháng';
    if (totalMonths < 12) return `${totalMonths} tháng tuổi`;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return m > 0 ? `${y} tuổi ${m} tháng` : `${y} tuổi`;
  } catch {
    return 'Chưa rõ';
  }
}

function getGenderText(gender?: string | null): string {
  switch (gender) {
    case 'MALE':
      return 'Đực ♂';
    case 'FEMALE':
      return 'Cái ♀';
    default:
      return 'Không xác định';
  }
}

export default function MyPetsPage() {
  const { data: customer, isLoading: isCustomerLoading } = useMyCustomer();
  const { data: pets, isLoading: isPetsLoading, isError, refetch } = useMyPets(customer?.id);

  const isLoading = isCustomerLoading || isPetsLoading;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <Link href="/profile">
            <ArrowLeft className="size-4" />
            <span>Quay lại hồ sơ cá nhân</span>
          </Link>
        </Button>

        <Button asChild size="sm" className="gap-1.5 shadow-xs">
          <Link href="/profile/pets/new">
            <Plus className="size-4" />
            <span>Thêm thú cưng mới</span>
          </Link>
        </Button>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-sm dark:border-emerald-900/40">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            <span>Thành viên gia đình 4 chân</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Thú cưng của tôi
          </h1>
          <p className="max-w-xl text-sm text-emerald-50">
            Quản lý thông tin, theo dõi hồ sơ sức khỏe và dễ dàng đặt lịch khám hoặc grooming cho bé cưng của bạn.
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            Không thể tải danh sách thú cưng
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            Thử lại
          </Button>
        </div>
      ) : !pets || pets.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-white/60 py-16 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <PawPrint className="size-8 stroke-[1.75]" />
          </div>
          <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
            Bạn chưa thêm bé thú cưng nào
          </h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Hãy thêm thông tin chó hoặc mèo của bạn để dễ dàng đặt lịch khám, tiêm chủng và lưu hồ sơ y tế.
          </p>
          <Button asChild className="mt-5 gap-2" size="sm">
            <Link href="/profile/pets/new">
              <Plus className="size-4" />
              <span>Thêm thú cưng đầu tiên</span>
            </Link>
          </Button>
        </div>
      ) : (
        /* Pets Grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet: PetDto) => {
            const isDog = pet.species === 'DOG';
            return (
              <Card
                key={pet.id}
                className="group relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-emerald-700"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-400">
                      <PawPrint className="size-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                        {pet.name}
                      </CardTitle>
                      <span className="inline-block text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {isDog ? '🐶 Chó' : '🐱 Mèo'} {pet.breed ? `• ${pet.breed}` : ''}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {getGenderText(pet.gender)}
                  </span>
                </CardHeader>

                <CardContent className="space-y-2 p-5 pt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center justify-between rounded-xl bg-zinc-50/80 px-3 py-2 dark:bg-zinc-800/50">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <Calendar className="size-3.5" />
                      <span>Tuổi:</span>
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {calculateAge(pet.birthDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-zinc-50/80 px-3 py-2 dark:bg-zinc-800/50">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <Scale className="size-3.5" />
                      <span>Cân nặng:</span>
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {pet.weightKg ? `${pet.weightKg} kg` : 'Chưa cập nhật'}
                    </span>
                  </div>

                  {pet.note && (
                    <div className="rounded-xl border border-zinc-100 bg-white p-2.5 text-[11px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                      <strong>Ghi chú:</strong> {pet.note}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-2 border-t border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-900/50">
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                    <Link href={`/profile/pets/${pet.id}/edit`}>
                      <Edit className="size-3.5" />
                      <span>Sửa</span>
                    </Link>
                  </Button>

                  <Button asChild size="sm" className="gap-1.5 bg-emerald-600 text-xs font-semibold hover:bg-emerald-700">
                    <Link href={`/booking?petId=${pet.id}`}>
                      <Heart className="size-3.5" />
                      <span>Đặt lịch khám</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
