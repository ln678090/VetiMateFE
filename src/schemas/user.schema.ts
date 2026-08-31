import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Tên không được để trống').max(100, 'Tên tối đa 100 ký tự'),
  username: z.string().min(3, 'Username tối thiểu 3 ký tự').max(50, 'Username tối đa 50 ký tự'),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/, 'Số điện thoại Việt Nam không hợp lệ')
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
