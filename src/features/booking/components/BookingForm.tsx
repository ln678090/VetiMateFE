'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingFormValues } from '@/schemas/booking.schema';
import { useActiveServices, useMyPets, useCreateAppointment } from '../hooks/use-clinic';
import { formatVND } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  customerId: string;
}

export function BookingForm({ customerId }: Props) {
  const { data: services, isLoading: loadingServices } = useActiveServices();
  const { data: pets, isLoading: loadingPets } = useMyPets(customerId);
  const { mutate, isPending } = useCreateAppointment(customerId);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onBlur',
  });

  const selectedServiceId = watch('serviceId');
  const selectedService = services?.find((s) => s.id === selectedServiceId);

  const onSubmit = (values: BookingFormValues) => {
    mutate(
      {
        petId: values.petId,
        serviceId: values.serviceId,
        startAt: new Date(values.startAt).toISOString(),
        note: values.note,
      },
      { onSuccess: () => reset() },
    );
  };

  if (loadingServices || loadingPets) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-white/60 bg-white/80 p-6 backdrop-blur-xl"
    >
      {/* Thú cưng */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Thú cưng <span className="text-rose-500">*</span>
        </label>
        <select
          {...register('petId')}
          className="w-full rounded-lg border px-3 py-2"
          defaultValue=""
        >
          <option value="" disabled>
            -- Chọn thú cưng --
          </option>
          {pets?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.species})
            </option>
          ))}
        </select>
        {errors.petId && (
          <p className="text-sm text-rose-500">{errors.petId.message}</p>
        )}
      </div>

      {/* Dịch vụ */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Dịch vụ <span className="text-rose-500">*</span>
        </label>
        <select
          {...register('serviceId')}
          className="w-full rounded-lg border px-3 py-2"
          defaultValue=""
        >
          <option value="" disabled>
            -- Chọn dịch vụ --
          </option>
          {services?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {formatVND(s.price)} ({s.durationMin} phút)
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="text-sm text-rose-500">{errors.serviceId.message}</p>
        )}
      </div>

      {/* Thời gian */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Thời gian <span className="text-rose-500">*</span>
        </label>
        <input
          type="datetime-local"
          {...register('startAt')}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.startAt && (
          <p className="text-sm text-rose-500">{errors.startAt.message}</p>
        )}
      </div>

      {/* Ghi chú */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Ghi chú</label>
        <textarea
          {...register('note')}
          rows={3}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Triệu chứng, yêu cầu đặc biệt..."
        />
        {errors.note && (
          <p className="text-sm text-rose-500">{errors.note.message}</p>
        )}
      </div>

      {/* Tóm tắt giá */}
      {selectedService && (
        <div className="rounded-lg bg-rose-50 p-3 text-sm">
          <p>
            Dịch vụ: <b>{selectedService.name}</b>
          </p>
          <p>
            Giá dự kiến:{' '}
            <b className="text-rose-600">{formatVND(selectedService.price)}</b> ·{' '}
            {selectedService.durationMin} phút
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white"
      >
        {isPending ? 'Đang đặt lịch...' : 'Đặt lịch khám'}
      </Button>
    </form>
  );
}
