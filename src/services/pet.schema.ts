// src/schemas/pet.schema.ts
// Zod schemas cho Pet CRUD forms

import { z } from 'zod';

// Schema cho form tạo/sửa pet
export const petFormSchema = z.object({
  name: z.string().min(1, 'Tên thú cưng là bắt buộc').max(100, 'Tên tối đa 100 ký tự'),
  species: z.enum(['DOG', 'CAT'], {
    message: 'Vui lòng chọn loài',
  }),
  breed: z
    .string()
    .max(100, 'Giống tối đa 100 ký tự')
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional().nullable(),
  birthDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return date <= new Date();
      },
      { message: 'Ngày sinh không thể ở tương lai' }
    ),
  weightKg: z
    .number()
    .positive('Cân nặng phải lớn hơn 0')
    .max(200, 'Cân nặng tối đa 200kg')
    .optional()
    .nullable(),
  note: z
    .string()
    .max(500, 'Ghi chú tối đa 500 ký tự')
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
});

export type PetFormValues = z.infer<typeof petFormSchema>;
