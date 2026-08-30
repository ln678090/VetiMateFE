import { z } from 'zod';
//
// export const petFormSchema = z.object({
//   name: z.string().trim().min(1, 'Tên thú cưng là bắt buộc').max(100),
//   species: z.enum(['DOG', 'CAT']),
//   breed: z.string().trim().max(100).optional().nullable(),
//   gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional().nullable(),
//   birthDate: z
//     .string()
//     .optional()
//     .nullable()
//     .refine((v) => !v || v <= new Date().toISOString().slice(0, 10), {
//       message: 'Ngày sinh không thể ở tương lai',
//     }),
//   weightKg: z.number().positive('Cân nặng phải lớn hơn 0').max(200).optional().nullable(),
//   note: z.string().trim().max(500).optional().nullable(),
// });
//
//

import type {
  ManagementPetRequest,
  OwnerPet,
  OwnerPetRequest,
  PetManagementSummary,
} from '@/types/pet-management';

const optionalText = (maxLength: number) => z.string().trim().max(maxLength);

const petBaseShape = {
  name: z
    .string()
    .trim()
    .min(1, 'Tên thú cưng là bắt buộc')
    .max(100, 'Tên không được vượt quá 100 ký tự'),

  species: z.enum(['DOG', 'CAT'], {
    message: 'Vui lòng chọn loài',
  }),

  breed: optionalText(100),

  gender: optionalText(20),

  birthDate: z
    .string()
    .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Ngày sinh không hợp lệ')
    .refine(
      (value) => value === '' || new Date(`${value}T00:00:00`).getTime() <= Date.now(),
      'Ngày sinh không được ở tương lai'
    ),

  weightKg: z
    .string()
    .trim()
    .refine((value) => {
      if (value === '') {
        return true;
      }

      const weight = Number(value);

      return Number.isFinite(weight) && weight > 0 && weight <= 9999.99;
    }, 'Cân nặng phải lớn hơn 0'),
};

export const petFormSchema = z.object(petBaseShape);

export const managementPetFormSchema = z.object({
  customerId: z.string().uuid('Chủ nuôi không hợp lệ'),

  ...petBaseShape,
});

export type PetFormValues = z.infer<typeof petFormSchema>;

export type ManagementPetFormValues = z.infer<typeof managementPetFormSchema>;

export const EMPTY_PET_FORM_VALUES: PetFormValues = {
  name: '',
  species: 'DOG',
  breed: '',
  gender: '',
  birthDate: '',
  weightKg: '',
};

export const EMPTY_MANAGEMENT_PET_FORM_VALUES: ManagementPetFormValues = {
  customerId: '',
  ...EMPTY_PET_FORM_VALUES,
};

function nullableText(value: string): string | null {
  const normalized = value.trim();
  return normalized === '' ? null : normalized;
}

function nullableWeight(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  return Number(value);
}

export function toOwnerPetRequest(values: PetFormValues): OwnerPetRequest {
  return {
    name: values.name.trim(),
    species: values.species,
    breed: nullableText(values.breed),
    gender: nullableText(values.gender),
    birthDate: values.birthDate || null,
    weightKg: nullableWeight(values.weightKg),
  };
}

export function toManagementPetRequest(values: ManagementPetFormValues): ManagementPetRequest {
  return {
    ...toOwnerPetRequest(values),
    customerId: values.customerId,
  };
}

export function ownerPetToFormValues(pet: OwnerPet): PetFormValues {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? '',
    gender: pet.gender ?? '',
    birthDate: pet.birthDate ?? '',
    weightKg: pet.weightKg === null ? '' : String(pet.weightKg),
  };
}

export function managementPetToFormValues(pet: PetManagementSummary): ManagementPetFormValues {
  return {
    customerId: pet.customerId,
    ...ownerPetToFormValues(pet),
  };
}
