'use client';

import { use } from 'react';

import { PetForm } from '@/features/profile/components/PetForm';
import { useMyCustomer, usePet, useUpdatePet } from '@/features/booking/hooks/use-clinic';
import type { PetFormValues } from '@/schemas/pet.schema';

interface EditPetPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPetPage({ params }: EditPetPageProps) {
  const { id } = use(params);
  const { data: customer, isLoading: isLoadingCustomer } = useMyCustomer();
  const { data: pet, isLoading: isLoadingPet } = usePet(id);
  const updatePet = useUpdatePet(customer?.id ?? '');
  if (isLoadingCustomer || isLoadingPet) return <div className="p-8">Đang tải...</div>;
  return (
    <div className="container max-w-3xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Chỉnh sửa thú cưng</h1>

      <PetForm
        mode="edit"
        pet={pet}
        customerId={customer?.id ?? ''}
        onSubmitPet={async (values) => {
          await updatePet.mutateAsync({ petId: id, data: values });
        }}
      />
    </div>
  );
}
