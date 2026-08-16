import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Tên không được để trống').max(100, 'Tên tối đa 100 ký tự'),
  username: z
    .string()
    .min(6, 'Username phải từ 6 ký tự trở lên')
    .max(50, 'Username tối đa 50 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ chứa chữ, số và dấu gạch dưới'),
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ (VD: 0987654321)'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải từ 6 ký tự trở lên')
    .max(100, 'Mật khẩu tối đa 100 ký tự'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
