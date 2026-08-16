'use client';
// src/features/booking/components/BookingForm.tsx

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingFormValues } from '@/schemas/booking.schema';
import {
  useActiveServices,
  useMyPets,
  useCreateAppointment,
  useCreatePet,
  useAvailableSlots,
} from '../hooks/use-clinic';
import { PET_SPECIES_OPTIONS, type PetSpecies } from '@/types/clinic';
import { formatVND } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

interface Props {
  customerId: string;
}

export function BookingForm({ customerId }: Props) {
  const { data: services, isLoading: loadingServices } = useActiveServices();
  const { data: pets, isLoading: loadingPets } = useMyPets(customerId);
  const { mutate, isPending } = useCreateAppointment(customerId);
  const { mutate: createPetMutate, isPending: creatingPet } = useCreatePet(customerId);

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
  });

  const selectedServiceId = watch('serviceId');
  const selectedService = services?.find((s) => s.id === selectedServiceId);

  // ===== State cho Date + Slot picker =====
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>(''); // "08:00"

  // ===== Fetch available slots khi có service + date =====
  const {
    data: slots,
    isLoading: loadingSlots,
    isError: slotsError,
  } = useAvailableSlots(selectedServiceId, selectedDate);

  // Chỉ hiển thị slots available = true
  const availableSlots = useMemo(
    () => slots?.filter((s) => s.available) ?? [],
    [slots]
  );

  // ===== Chỉ chó & mèo, group theo giống loài =====
  const dogs = pets?.filter((p) => p.species === 'DOG') ?? [];
  const cats = pets?.filter((p) => p.species === 'CAT') ?? [];
  const hasBookablePet = dogs.length > 0 || cats.length > 0;

  // ===== State form "Thêm thú cưng" (inline) =====
  const [showAddPet, setShowAddPet] = useState(false);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<PetSpecies>('DOG');
  const [petBreed, setPetBreed] = useState('');

  // ===== Min date = hôm nay =====
  const today = new Date().toISOString().split('T')[0];

  // ===== Khi chọn slot -> build startAt =====

  const handleSlotSelect = (startTime: string) => {
    setSelectedSlot(startTime);
    if (selectedDate && startTime) {
      // Build ISO string với timezone local
      // Format: "2026-07-21T16:00" (không có :00 cuối - datetime-local format)
      const startAt = `${selectedDate}T${startTime}`;
      setValue('startAt', startAt, { shouldValidate: true });
    }
  };


  // ===== Khi đổi ngày -> reset slot đã chọn =====
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
    setValue('startAt', '', { shouldValidate: false });
  };

  const handleAddPet = () => {
    const trimmedName = petName.trim();
    if (!trimmedName) {
      alert('Vui lòng nhập tên thú cưng');
      return;
    }
    if (!customerId) {
      alert('Chưa xác định được hồ sơ khách hàng. Bạn cần đăng nhập để thêm thú cưng.');
      return;
    }

    createPetMutate(
      {
        customerId,
        name: trimmedName,
        species: petSpecies,
        breed: petBreed.trim() || null,
      },
      {
        onSuccess: () => {
          setPetName('');
          setPetBreed('');
          setPetSpecies('DOG');
          setShowAddPet(false);
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const msg = err?.response?.data?.message ?? err?.message ?? 'Không rõ lỗi';
          if (status === 401) {
            alert('Bạn cần đăng nhập để thêm thú cưng (401).');
          } else {
            alert(`Thêm thú cưng thất bại: ${msg}`);
          }
          console.error('createPet error:', status, err);
        },
      }
    );
  };

  const onSubmit = (values: BookingFormValues) => {
    mutate(
      {
        petId: values.petId,
        serviceId: values.serviceId,
        startAt: new Date(values.startAt).toISOString(),
        note: values.note,
      },
      {
        onSuccess: () => {
          reset();
          setSelectedDate('');
          setSelectedSlot('');
        },
      }
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
      {/* ===== Thú cưng - chỉ chó & mèo, group theo giống ===== */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Thú cưng <span className="text-rose-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowAddPet((v) => !v)}
            className="text-sm font-medium text-rose-600 hover:underline"
          >
            {showAddPet ? 'Đóng' : '+ Thêm thú cưng'}
          </button>
        </div>

        <select
          {...register('petId')}
          className="w-full rounded-lg border px-3 py-2"
          defaultValue=""
          disabled={!hasBookablePet}
        >
          <option value="" disabled>
            -- Chọn thú cưng --
          </option>
          {dogs.length > 0 && (
            <optgroup label="Chó">
              {dogs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.breed ? ` — ${p.breed}` : ''}
                </option>
              ))}
            </optgroup>
          )}
          {cats.length > 0 && (
            <optgroup label="Mèo">
              {cats.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.breed ? ` — ${p.breed}` : ''}
                </option>
              ))}
            </optgroup>
          )}
        </select>

        {!hasBookablePet && !showAddPet && (
          <p className="text-sm text-amber-600">
            Bạn chưa có chó hoặc mèo nào. Hãy bấm "+ Thêm thú cưng".
          </p>
        )}
        {errors.petId && (
          <p className="text-sm text-rose-500">{errors.petId.message}</p>
        )}

        {/* Inline form thêm thú cưng */}
        {showAddPet && (
          <div className="mt-2 space-y-3 rounded-lg border border-rose-200 bg-rose-50/50 p-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">
                  Tên <span className="text-rose-500">*</span>
                </label>
                <input
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  maxLength={100}
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="VD: Milo"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">
                  Loài <span className="text-rose-500">*</span>
                </label>
                <select
                  value={petSpecies}
                  onChange={(e) => setPetSpecies(e.target.value as PetSpecies)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  {PET_SPECIES_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Giống</label>
                <input
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  maxLength={100}
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="VD: Corgi, Anh lông ngắn..."
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={handleAddPet}
              disabled={creatingPet || !petName.trim()}
              className="bg-rose-500 text-white"
            >
              {creatingPet ? 'Đang lưu...' : 'Lưu thú cưng'}
            </Button>
          </div>
        )}
      </div>

      {/* ===== Dịch vụ ===== */}
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
        {selectedService && (
          <p className="text-xs text-gray-500">
            Thời lượng: {selectedService.durationMin} phút
          </p>
        )}
        {errors.serviceId && (
          <p className="text-sm text-rose-500">{errors.serviceId.message}</p>
        )}
      </div>

      {/* ===== Chọn ngày ===== */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          Ngày khám <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          min={today}
          className="w-full rounded-lg border px-3 py-2"
          disabled={!selectedServiceId}
        />
        {!selectedServiceId && (
          <p className="text-xs text-gray-400">Vui lòng chọn dịch vụ trước</p>
        )}
      </div>

      {/* ===== Slot Picker ===== */}
      {selectedServiceId && selectedDate && (
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Khung giờ trống <span className="text-rose-500">*</span>
          </label>

          {loadingSlots && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {slotsError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              Không thể tải khung giờ. Vui lòng thử lại.
            </div>
          )}

          {!loadingSlots && !slotsError && availableSlots.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Không còn khung giờ trống trong ngày này. Vui lòng chọn ngày khác.
            </div>
          )}

          {!loadingSlots && !slotsError && availableSlots.length > 0 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {availableSlots.map((slot) => (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() => handleSlotSelect(slot.startTime)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${selectedSlot === slot.startTime
                    ? 'border-rose-500 bg-rose-500 text-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-rose-300 hover:bg-rose-50'
                    }`}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}

          {selectedSlot && selectedService && (
            <p className="text-xs text-gray-500">
              Đã chọn: {selectedSlot} - {slots?.find(s => s.startTime === selectedSlot)?.endTime}
              ({selectedService.durationMin} phút)
            </p>
          )}

          {errors.startAt && (
            <p className="text-sm text-rose-500">{errors.startAt.message}</p>
          )}
        </div>
      )}

      {/* Hidden field cho react-hook-form */}
      <input type="hidden" {...register('startAt')} />

      {/* ===== Ghi chú ===== */}
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

      {/* ===== Submit Button ===== */}
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
