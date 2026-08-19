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
  userId: z.string().trim(),

  fullName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập họ tên')
    .max(150, 'Họ tên không được vượt quá 150 ký tự'),

  phone: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || /^[0-9+()\-\s]{8,20}$/.test(value),
      'Số điện thoại không hợp lệ'
    ),

  roleType: z.enum(STAFF_ROLE_TYPES, {
    error: 'Vui lòng chọn vai trò',
  }),

  licenseNumber: z.string().trim().max(100, 'Số chứng chỉ không được vượt quá 100 ký tự'),

  baseSalary: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập lương cơ bản')
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      'Lương cơ bản phải từ 0 trở lên'
    ),

  commissionRate: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tỷ lệ hoa hồng')
    .refine((value) => {
      const number = Number(value);

      return Number.isFinite(number) && number >= 0 && number <= 100;
    }, 'Hoa hồng phải từ 0 đến 100'),

  active: z.boolean(),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
