import { z } from 'zod';

export const petFormSchema = z.object({
  name: z.string().trim().min(1, 'Tên thú cưng là bắt buộc').max(100),
  species: z.enum(['DOG', 'CAT']),
  breed: z.string().trim().max(100).optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional().nullable(),
  birthDate: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || v <= new Date().toISOString().slice(0, 10), {
      message: 'Ngày sinh không thể ở tương lai',
    }),
  weightKg: z.number().positive('Cân nặng phải lớn hơn 0').max(200).optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
});

export type PetFormValues = z.infer<typeof petFormSchema>;
