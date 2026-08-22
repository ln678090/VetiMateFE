import { z } from 'zod';

export const STAFF_ROLE_TYPES = [
  'DOCTOR',
  'RECEPTIONIST',
  'MANAGER',
  'ACCOUNTANT',
  'WAREHOUSE',
  'SHOP_STAFF',
] as const;

export const staffFormSchema = z.object({
  userId: z.string().min(1, 'Vui lòng chọn tài khoản').uuid('Tài khoản không hợp lệ'),

  roleType: z.enum(STAFF_ROLE_TYPES, {
    error: 'Vui lòng chọn vai trò',
  }),

  active: z.boolean(),

  reason: z
    .string()
    .trim()
    .min(10, 'Lý do phải có ít nhất 10 ký tự')
    .max(500, 'Lý do không được quá 500 ký tự'),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
