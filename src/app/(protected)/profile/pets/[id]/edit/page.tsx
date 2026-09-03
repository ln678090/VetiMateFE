'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { PetForm } from '@/features/profile/components/PetForm';
import { useOwnerPet, useUpdateOwnerPet } from '@/features/pets/hooks/use-pet-management';
import { getApiErrorMessage } from '@/lib/axios';
import { ownerPetToFormValues, toOwnerPetRequest } from '@/schemas/pet.schema';

export default function EditPetPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const petId = params.id;

  const petQuery = useOwnerPet(petId);
  const updatePet = useUpdateOwnerPet();

  const initialValues = useMemo(
    () => (petQuery.data ? ownerPetToFormValues(petQuery.data) : undefined),
    [petQuery.data]
  );

  if (petQuery.isLoading) {
    return <EditPetSkeleton />;
  }

  if (petQuery.isError || !petQuery.data) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h1 className="text-xl font-semibold">Không thể tải thú cưng</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {petQuery.error?.message ?? 'Không tìm thấy thú cưng.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/profile/pets/${petId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Quay lại chi tiết
      </Link>

      <header>
        <h1 className="text-3xl font-bold">Chỉnh sửa {petQuery.data.name}</h1>
        <p className="mt-2 text-muted-foreground">Cập nhật thông tin cơ bản của thú cưng.</p>
      </header>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <PetForm
          initialValues={initialValues}
          isSubmitting={updatePet.isPending}
          submitLabel="Lưu thay đổi"
          onCancel={() => router.push(`/profile/pets/${petId}`)}
          onSubmit={async (request) => {
            try {
              await updatePet.mutateAsync({
                petId,
                request: toOwnerPetRequest(request),
              });

              toast.success('Đã cập nhật thú cưng');

              router.push(`/profile/pets/${petId}`);
            } catch (error) {
              toast.error(getApiErrorMessage(error));
            }
          }}
        />
      </div>
    </div>
  );
}

function EditPetSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-[480px] rounded-2xl" />
    </div>
  );
}
