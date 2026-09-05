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

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
});

export const verifyOtpSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  otp: z
    .string()
    .min(1, 'Mã OTP không được để trống')
    .length(6, 'Mã OTP gồm 6 chữ số')
    .regex(/^\d+$/, 'Mã OTP chỉ bao gồm số'),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
    otp: z
      .string()
      .min(1, 'Mã OTP không được để trống')
      .length(6, 'Mã OTP gồm 6 chữ số')
      .regex(/^\d+$/, 'Mã OTP chỉ bao gồm số'),
    newPassword: z
      .string()
      .min(6, 'Mật khẩu mới phải từ 6 ký tự trở lên')
      .max(100, 'Mật khẩu tối đa 100 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp',
    path: ['confirmPassword'],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
