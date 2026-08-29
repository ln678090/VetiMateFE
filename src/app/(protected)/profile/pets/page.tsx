'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, PawPrint, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteOwnerPet, useOwnerPets } from '@/features/pets/hooks/use-pet-management';
import type { OwnerPet } from '@/types/pet-management';

const PAGE_SIZE = 9;

function formatPetDate(value: string | null | undefined): string {
  if (!value) {
    return 'Chưa cập nhật';
  }

  return new Intl.DateTimeFormat('vi-VN').format(new Date(`${value}T00:00:00`));
}

function getSpeciesLabel(species: OwnerPet['species']): string {
  return species === 'DOG' ? 'Chó' : 'Mèo';
}

function getGenderLabel(gender: OwnerPet['gender']): string {
  if (gender === 'MALE') return 'Đực';
  if (gender === 'FEMALE') return 'Cái';
  return 'Chưa xác định';
}

function PetCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export default function OwnerPetsPage() {
  const [page, setPage] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const petsQuery = useOwnerPets(page, PAGE_SIZE, true);
  const deletePetMutation = useDeleteOwnerPet();

  const pets = petsQuery.data?.content ?? [];
  const totalPages = petsQuery.data?.totalPages ?? 0;
  const totalElements = petsQuery.data?.totalElements ?? 0;

  async function handleDelete(petId: string) {
    await deletePetMutation.mutateAsync(petId);
    setDeleteTargetId(null);

    if (pets.length === 1 && page > 0) {
      setPage((currentPage) => currentPage - 1);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thú cưng của tôi</h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý hồ sơ chó và mèo phục vụ đặt lịch khám.
          </p>
        </div>

        <Button asChild>
          <Link href="/profile/pets/new">
            <Plus className="mr-2 size-4" />
            Thêm thú cưng
          </Link>
        </Button>
      </header>

      {petsQuery.isLoading && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <PetCardSkeleton key={index} />
          ))}
        </section>
      )}

      {petsQuery.isError && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Không thể tải danh sách thú cưng</CardTitle>
            <CardDescription>
              {petsQuery.error instanceof Error ? petsQuery.error.message : 'Vui lòng thử lại sau.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void petsQuery.refetch()}>
              Thử lại
            </Button>
          </CardContent>
        </Card>
      )}

      {!petsQuery.isLoading && !petsQuery.isError && pets.length === 0 && (
        <Card className="border-dashed py-10 text-center">
          <CardContent className="space-y-4">
            <PawPrint className="mx-auto size-12 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">Bạn chưa có hồ sơ thú cưng</h2>
              <p className="mt-1 text-muted-foreground">Thêm thú cưng để bắt đầu đặt lịch khám.</p>
            </div>

            <Button asChild>
              <Link href="/profile/pets/new">
                <Plus className="mr-2 size-4" />
                Thêm thú cưng đầu tiên
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {pets.length > 0 && (
        <>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pets.map((pet) => {
              const isConfirmingDelete = deleteTargetId === pet.id;

              return (
                <Card key={pet.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle>{pet.name}</CardTitle>
                        <CardDescription>
                          {getSpeciesLabel(pet.species)}
                          {pet.breed ? ` · ${pet.breed}` : ''}
                        </CardDescription>
                      </div>

                      <PawPrint className="size-6 text-rose-500" />
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col">
                    <dl className="grid flex-1 grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Giới tính</dt>
                        <dd className="font-medium">{getGenderLabel(pet.gender)}</dd>
                      </div>

                      <div>
                        <dt className="text-muted-foreground">Ngày sinh</dt>
                        <dd className="font-medium">{formatPetDate(pet.birthDate)}</dd>
                      </div>

                      <div>
                        <dt className="text-muted-foreground">Cân nặng</dt>
                        <dd className="font-medium">
                          {pet.weightKg != null
                            ? `${Number(pet.weightKg).toLocaleString('vi-VN')} kg`
                            : 'Chưa cập nhật'}
                        </dd>
                      </div>
                    </dl>

                    {isConfirmingDelete ? (
                      <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                        <p className="text-sm font-medium">Xóa hồ sơ của {pet.name}?</p>

                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={deletePetMutation.isPending}
                            onClick={() => setDeleteTargetId(null)}
                          >
                            Hủy
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletePetMutation.isPending}
                            onClick={() => void handleDelete(pet.id)}
                          >
                            {deletePetMutation.isPending ? 'Đang xóa...' : 'Xác nhận xóa'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/profile/pets/${pet.id}`}>
                            <Eye className="mr-2 size-4" />
                            Xem
                          </Link>
                        </Button>

                        <Button asChild size="sm" variant="outline">
                          <Link href={`/profile/pets/${pet.id}/edit`}>
                            <Pencil className="mr-2 size-4" />
                            Sửa
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTargetId(pet.id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Xóa
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Tổng cộng {totalElements} thú cưng</p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0 || petsQuery.isFetching}
                onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
              >
                <ChevronLeft className="mr-1 size-4" />
                Trước
              </Button>

              <span className="min-w-24 text-center text-sm">
                Trang {page + 1}/{Math.max(totalPages, 1)}
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={page + 1 >= totalPages || petsQuery.isFetching}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Sau
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
