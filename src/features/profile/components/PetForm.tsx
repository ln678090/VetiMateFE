'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RequiredLabel } from '@/components/shared/RequiredLabel';
import { getApiErrorMessage } from '@/lib/axios';
import { EMPTY_PET_FORM_VALUES, petFormSchema, type PetFormValues } from '@/schemas/pet.schema';
import { PET_GENDER_OPTIONS, PET_SPECIES_OPTIONS, type PetDto } from '@/types/clinic';

interface PetFormProps {
  // Props của Dung
  mode?: 'create' | 'edit';
  pet?: PetDto;
  customerId?: string;
  onSubmitPet?: (values: PetFormValues) => Promise<void>;
  
  // Props của Lâm
  initialValues?: PetFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit?: (values: PetFormValues) => Promise<void>;
}

export function PetForm({ 
  mode, 
  pet, 
  customerId, 
  onSubmitPet,
  initialValues,
  isSubmitting: externalIsSubmitting,
  submitLabel,
  onCancel,
  onSubmit 
}: PetFormProps) {
  const router = useRouter();

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: initialValues || EMPTY_PET_FORM_VALUES,
  });

  useEffect(() => {
    if (pet) {
      form.reset({
        name: pet.name,
        species: pet.species as 'DOG' | 'CAT',
        breed: pet.breed ?? null,
        gender: (pet.gender as 'MALE' | 'FEMALE' | 'UNKNOWN') ?? 'UNKNOWN',
        birthDate: pet.birthDate ?? null,
        weightKg: pet.weightKg ?? null,
        note: (pet as any).note ?? null,
      } as any);
    } else if (initialValues) {
      form.reset(initialValues);
    }
  }, [pet, initialValues, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    // Nếu có onSubmit của Lâm truyền vào thì dùng luôn
    if (onSubmit) {
      await onSubmit(values);
      return;
    }

    // Nếu không thì dùng logic cũ của Dung
    if (!customerId) {
      toast.error('Không tìm thấy thông tin khách hàng');
      return;
    }

    try {
      if (onSubmitPet) await onSubmitPet(values);
      toast.success(mode === 'create' ? 'Đã thêm thú cưng' : 'Đã cập nhật thú cưng');
      router.push('/profile/pets');
    } catch (error) {
      toast.error('Không thể lưu thú cưng', {
        description: getApiErrorMessage(error),
      });
    }
  });

  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : form.formState.isSubmitting;
  const finalSubmitLabel = submitLabel || (mode === 'create' ? 'Thêm' : 'Lưu');

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <RequiredLabel htmlFor="name">Tên thú cưng</RequiredLabel>
          <Input id="name" {...form.register('name')} placeholder="VD: Miu, Lucky..." />
          <p className="text-sm text-red-500">{form.formState.errors.name?.message}</p>
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="species">Loài</RequiredLabel>
          <select
            id="species"
            {...form.register('species')}
            className="h-10 w-full rounded-md border px-3 text-sm"
          >
            {PET_SPECIES_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-red-500">{form.formState.errors.species?.message}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="breed">Giống</Label>
          <Input
            id="breed"
            {...form.register('breed')}
            placeholder="VD: Poodle, Anh lông ngắn..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            {...form.register('gender')}
            className="h-10 w-full rounded-md border px-3 text-sm"
          >
            {PET_GENDER_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Ngày sinh</Label>
          <Input id="birthDate" type="date" {...form.register('birthDate')} />
          <p className="text-sm text-red-500">{form.formState.errors.birthDate?.message}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weightKg">Cân nặng kg</Label>
          <Input
            id="weightKg"
            type="number"
            step="0.1"
            min="0"
            {...form.register('weightKg')}
          />
          <p className="text-sm text-red-500">{form.formState.errors.weightKg?.message}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel || (() => router.back())}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Đang xử lý...' : finalSubmitLabel}
        </Button>
      </div>
    </form>
  );
}
