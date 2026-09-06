import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(50, 'Họ tên quá dài'),
  phone: z
    .string()
    .min(10, 'Số điện thoại không hợp lệ')
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không đúng định dạng Việt Nam'),
  city: z.string().min(1, 'Vui lòng chọn Tỉnh / Thành phố'),
  district: z.string().min(1, 'Vui lòng chọn Phường / Xã'),
  specificAddress: z.string().min(5, 'Vui lòng nhập địa chỉ chi tiết (ít nhất 5 ký tự)'),
  note: z.string().optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'VNPAY', 'MOMO']),
  userVoucherId: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
