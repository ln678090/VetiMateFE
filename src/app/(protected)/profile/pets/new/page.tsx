'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { PetForm } from '@/features/profile/components/PetForm';
import { useCreateOwnerPet } from '@/features/pets/hooks/use-pet-management';
import { getApiErrorMessage } from '@/lib/axios';

export default function NewPetPage() {
  const router = useRouter();
  const createPet = useCreateOwnerPet();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/profile/pets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách
      </Link>

      <header>
        <h1 className="text-3xl font-bold">Thêm thú cưng</h1>
        <p className="mt-2 text-muted-foreground">Tạo hồ sơ mới cho thú cưng của bạn.</p>
      </header>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <PetForm
          isSubmitting={createPet.isPending}
          submitLabel="Thêm thú cưng"
          onCancel={() => router.push('/profile/pets')}
          onSubmit={async (request) => {
            try {
              const pet = await createPet.mutateAsync(request);

              toast.success('Đã thêm thú cưng thành công');

              router.push(`/profile/pets/${pet.id}`);
            } catch (error) {
              toast.error(getApiErrorMessage(error));
            }
          }}
        />
      </div>
    </div>
  );
}
