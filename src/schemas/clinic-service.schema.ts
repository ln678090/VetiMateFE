import { z } from 'zod';

export const clinicServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên dịch vụ phải có ít nhất 2 ký tự')
    .max(150, 'Tên dịch vụ tối đa 150 ký tự'),

  description: z.string().trim().max(1000, 'Mô tả tối đa 1000 ký tự'),

  price: z
    .number()
    .positive('Giá dịch vụ phải lớn hơn 0')
    .max(1_000_000_000, 'Giá dịch vụ không hợp lệ'),

  durationMin: z
    .number()
    .int('Thời lượng phải là số nguyên')
    .min(5, 'Thời lượng tối thiểu 5 phút')
    .max(1440, 'Thời lượng tối đa 1440 phút'),

  isActive: z.boolean(),
});

export type ClinicServiceFormValues = z.infer<typeof clinicServiceSchema>;
