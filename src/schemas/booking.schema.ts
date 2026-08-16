// src/schemas/booking.schema.ts

import { z } from 'zod';

export const bookingSchema = z.object({
  petId: z.string().uuid({ message: 'Vui lòng chọn thú cưng' }),
  serviceId: z.string().uuid({ message: 'Vui lòng chọn dịch vụ' }),
  startAt: z
    .string()
    .min(1, 'Vui lòng chọn khung giờ')
    .refine(
      (val) => {
        // Parse as local time, không phải UTC
        const selectedTime = new Date(val);
        const now = new Date();

        // So sánh timestamp
        return selectedTime.getTime() > now.getTime();
      },
      { message: 'Thời gian phải ở tương lai' }
    ),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
