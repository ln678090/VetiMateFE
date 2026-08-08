'use client';

import { PetForm } from '@/features/profile/components/PetForm';
import { useCreatePet, useMyCustomer } from '@/features/booking/hooks/use-clinic';
import type { PetFormValues } from '@/schemas/pet.schema';

export default function NewPetPage() {
  const { data: customer, isLoading } = useMyCustomer();
  const createPet = useCreatePet(customer?.id ?? '');

  if (isLoading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Thêm thú cưng</h1>

      <PetForm
        mode="create"
        customerId={customer?.id ?? ''}
        onSubmitPet={async (values) => {
          await createPet.mutateAsync({
            ...values,
            customerId: customer!.id,
          });
        }}
      />
    </div>
  );
}
