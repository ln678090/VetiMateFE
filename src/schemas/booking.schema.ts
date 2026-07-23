import { z } from 'zod';

export const bookingSchema = z.object({
  petId: z.string().uuid({ message: 'Vui lòng chọn thú cưng' }),
  serviceId: z.string().uuid({ message: 'Vui lòng chọn dịch vụ' }),
  startAt: z
    .string()
    .min(1, { message: 'Vui lòng chọn thời gian' })
    .refine((v) => new Date(v).getTime() > Date.now(), {
      message: 'Thời gian phải ở tương lai',
    }),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
