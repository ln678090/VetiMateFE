import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Tên không được để trống').max(100, 'Tên tối đa 100 ký tự'),
    username: z
      .string()
      .min(6, 'Username phải từ 6 ký tự trở lên')
      .max(50, 'Username tối đa 50 ký tự')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ chứa chữ, số và dấu gạch dưới'),
    email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
    phone: z
      .string()
      .trim()
      .regex(/^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/, 'Số điện thoại Việt Nam không hợp lệ'),
    password: z
      .string()
      .min(6, 'Mật khẩu phải từ 6 ký tự trở lên')
      .max(100, 'Mật khẩu tối đa 100 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp',
    path: ['confirmPassword'],
  });
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Mật khẩu cũ không được để trống'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu mới phải từ 8 ký tự trở lên')
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()_\-]).{8,}$/,
        'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
      ),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu mới'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
