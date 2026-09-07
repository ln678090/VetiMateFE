'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Calendar, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatVND } from '@/lib/utils';
import { bookingSchema, type BookingFormValues } from '@/schemas/booking.schema';

import {
  useActiveServices,
  useAvailableSlots,
  useCreateAppointment,
  useMyPets,
} from '../hooks/use-clinic';

interface BookingFormProps {
  customerId: string;
}

const CREATE_PET_HREF = '/profile/pets/new?returnTo=%2Fbooking';

function getLocalDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function BookingForm({ customerId }: BookingFormProps) {
  const { data: services, isLoading: loadingServices } = useActiveServices();

  const { data: pets, isLoading: loadingPets } = useMyPets(customerId);

  const { mutate: createAppointment, isPending } = useCreateAppointment(customerId);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onBlur',
    defaultValues: {
      petId: '',
      serviceId: '',
      startAt: '',
      note: '',
    },
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const selectedServiceId = watch('serviceId');

  const selectedService = services?.find((service) => service.id === selectedServiceId);

  const {
    data: slots,
    isLoading: loadingSlots,
    isError: slotsError,
  } = useAvailableSlots(selectedServiceId, selectedDate);

  const availableSlots = useMemo(() => slots?.filter((slot) => slot.available) ?? [], [slots]);

  const dogs = useMemo(() => pets?.filter((pet) => pet.species === 'DOG') ?? [], [pets]);

  const cats = useMemo(() => pets?.filter((pet) => pet.species === 'CAT') ?? [], [pets]);

  const hasBookablePet = dogs.length > 0 || cats.length > 0;
  const today = getLocalDateValue(new Date());

  function handleSlotSelect(startTime: string): void {
    if (!selectedDate) {
      return;
    }

    setSelectedSlot(startTime);

    setValue('startAt', `${selectedDate}T${startTime}`, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function handleDateChange(date: string): void {
    setSelectedDate(date);
    setSelectedSlot('');

    setValue('startAt', '', {
      shouldDirty: true,
      shouldValidate: false,
    });
  }

  function onSubmit(values: BookingFormValues): void {
    const startAt = new Date(values.startAt);

    if (Number.isNaN(startAt.getTime())) {
      return;
    }

    createAppointment(
      {
        petId: values.petId,
        serviceId: values.serviceId,
        startAt: startAt.toISOString(),
        note: values.note?.trim() || undefined,
      },
      {
        onSuccess: () => {
          reset();
          setSelectedDate('');
          setSelectedSlot('');
        },
      }
    );
  }

  if (loadingServices || loadingPets) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="booking-pet" className="text-sm font-medium">
            Thú cưng <span className="text-rose-500">*</span>
          </label>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <Link href={CREATE_PET_HREF}>
              <Plus className="mr-1 h-4 w-4" />
              Thêm thú cưng
            </Link>
          </Button>
        </div>

        <select
          id="booking-pet"
          {...register('petId')}
          disabled={!hasBookablePet}
          aria-invalid={Boolean(errors.petId)}
          className="w-full rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
        >
          <option value="" disabled>
            -- Chọn thú cưng --
          </option>

          {dogs.length > 0 && (
            <optgroup label="Chó">
              {dogs.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                  {pet.breed ? ` — ${pet.breed}` : ''}
                </option>
              ))}
            </optgroup>
          )}

          {cats.length > 0 && (
            <optgroup label="Mèo">
              {cats.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                  {pet.breed ? ` — ${pet.breed}` : ''}
                </option>
              ))}
            </optgroup>
          )}
        </select>

        {!hasBookablePet && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <p className="text-sm text-amber-700">Bạn chưa có chó hoặc mèo để đặt lịch.</p>
            </div>

            <Button
              asChild
              size="sm"
              className="mt-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white"
            >
              <Link href={CREATE_PET_HREF}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm thú cưng mới
              </Link>
            </Button>
          </div>
        )}

        {errors.petId && <p className="text-sm text-rose-500">{errors.petId.message}</p>}
      </div>

      {/* Dịch vụ */}
      <div className="space-y-1.5">
        <label htmlFor="booking-service" className="text-sm font-medium">
          Dịch vụ <span className="text-rose-500">*</span>
        </label>

        <select
          id="booking-service"
          {...register('serviceId')}
          aria-invalid={Boolean(errors.serviceId)}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="" disabled>
            -- Chọn dịch vụ --
          </option>

          {services?.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} — {formatVND(service.price)} ({service.durationMin} phút)
            </option>
          ))}
        </select>

        {selectedService && (
          <p className="text-xs text-zinc-500">
            Thời lượng dự kiến: {selectedService.durationMin} phút
          </p>
        )}

        {errors.serviceId && <p className="text-sm text-rose-500">{errors.serviceId.message}</p>}
      </div>

      {/* Ngày khám */}
      <div className="space-y-1.5">
        <label htmlFor="booking-date" className="flex items-center gap-1.5 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          Ngày khám <span className="text-rose-500">*</span>
        </label>

        <input
          id="booking-date"
          type="date"
          value={selectedDate}
          min={today}
          disabled={!selectedServiceId}
          onChange={(event) => handleDateChange(event.target.value)}
          className="w-full rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-100"
        />

        {!selectedServiceId && (
          <p className="text-xs text-zinc-400">Vui lòng chọn dịch vụ trước.</p>
        )}
      </div>

      {/* Khung giờ */}
      {selectedServiceId && selectedDate && (
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Khung giờ trống <span className="text-rose-500">*</span>
          </label>

          {loadingSlots && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          )}

          {slotsError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Không thể tải khung giờ. Vui lòng thử lại.
            </div>
          )}

          {!loadingSlots && !slotsError && availableSlots.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Không còn khung giờ trống trong ngày này. Vui lòng chọn ngày khác.
            </div>
          )}

          {!loadingSlots && !slotsError && availableSlots.length > 0 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot.startTime;

                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSlotSelect(slot.startTime)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500 text-white shadow-md'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 hover:bg-rose-50'
                    }`}
                  >
                    {slot.startTime}
                  </button>
                );
              })}
            </div>
          )}

          {selectedSlot && selectedService && (
            <p className="text-xs text-zinc-500">
              Đã chọn: {selectedSlot} –{' '}
              {slots?.find((slot) => slot.startTime === selectedSlot)?.endTime} (
              {selectedService.durationMin} phút)
            </p>
          )}

          {errors.startAt && <p className="text-sm text-rose-500">{errors.startAt.message}</p>}
        </div>
      )}

      <input type="hidden" {...register('startAt')} />

      {/* Ghi chú */}
      <div className="space-y-1.5">
        <label htmlFor="booking-note" className="text-sm font-medium">
          Ghi chú
        </label>

        <textarea
          id="booking-note"
          {...register('note')}
          rows={3}
          maxLength={1000}
          className="w-full resize-y rounded-lg border px-3 py-2"
          placeholder="Triệu chứng, yêu cầu đặc biệt..."
        />

        {errors.note && <p className="text-sm text-rose-500">{errors.note.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isPending || !hasBookablePet || !selectedSlot}
        className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white"
      >
        {isPending ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
      </Button>
    </form>
  );
}
