'use client';

import { FormEvent, useEffect, useState } from 'react';

import {
  ClinicService,
  ManagementPet,
  managementAppointmentApi,
} from '@/features/booking/api/management-appointment.api';

interface ReceptionistAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

function getLocalDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function normalizeTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

export function ReceptionistAppointmentDialog({
  open,
  onClose,
  onCreated,
}: ReceptionistAppointmentDialogProps) {
  const [keyword, setKeyword] = useState('');
  const [pets, setPets] = useState<ManagementPet[]>([]);
  const [services, setServices] = useState<ClinicService[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  const [petId, setPetId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [note, setNote] = useState('');

  const [loadingInitialData, setLoadingInitialData] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadInitialData() {
      setLoadingInitialData(true);
      setError('');

      try {
        const [petResults, serviceResults] = await Promise.all([
          managementAppointmentApi.searchPets(''),
          managementAppointmentApi.getServices(),
        ]);

        if (cancelled) {
          return;
        }

        setPets(petResults);
        setServices(serviceResults.filter((service) => service.isActive));
      } catch {
        if (!cancelled) {
          setError('Không thể tải danh sách thú cưng hoặc dịch vụ.');
        }
      } finally {
        if (!cancelled) {
          setLoadingInitialData(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    // 1. Chỉ return sớm nếu THIẾU dữ liệu để gọi API, KHÔNG gọi setState ở đây nữa
    if (!open || !serviceId || !date) {
      return;
    }

    let cancelled = false;

    async function loadAvailableSlots() {
      setLoadingSlots(true);
      setStartTime('');
      setError('');

      try {
        const availableSlots = await managementAppointmentApi.getAvailableSlots(serviceId, date);

        if (cancelled) {
          return;
        }

        setSlots(availableSlots.filter((slot) => slot.available).map((slot) => slot.startTime));
      } catch {
        if (!cancelled) {
          setSlots([]);
          setError('Không thể tải khung giờ trống. Vui lòng thử lại.');
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    }

    void loadAvailableSlots();

    return () => {
      cancelled = true;
    };
  }, [date, open, serviceId]);
  function resetForm() {
    setKeyword('');
    setPetId('');
    setServiceId('');
    setDate('');
    setStartTime('');
    setNote('');
    setSlots([]);
    setError('');
  }

  function handleClose() {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSearchPets() {
    setLoadingPets(true);
    setError('');

    try {
      const results = await managementAppointmentApi.searchPets(keyword.trim());

      setPets(results);

      if (petId && !results.some((pet) => pet.id === petId)) {
        setPetId('');
      }
    } catch {
      setError('Không thể tìm khách hàng hoặc thú cưng.');
    } finally {
      setLoadingPets(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!petId) {
      setError('Vui lòng chọn thú cưng.');
      return;
    }

    if (!serviceId) {
      setError('Vui lòng chọn dịch vụ.');
      return;
    }

    if (!date) {
      setError('Vui lòng chọn ngày khám.');
      return;
    }

    if (!startTime) {
      setError('Vui lòng chọn khung giờ.');
      return;
    }

    setSubmitting(true);

    try {
      /*
       * Chuyển giờ Việt Nam thành ISO UTC cho backend Instant.
       * Ví dụ: 2026-09-09T08:00:00+07:00.
       */
      const localDateTime = `${date}T${normalizeTime(startTime)}+07:00`;

      const startAt = new Date(localDateTime).toISOString();

      await managementAppointmentApi.create({
        petId,
        serviceId,
        startAt,
        note: note.trim() || undefined,
      });

      await onCreated();
      resetForm();
      onClose();
    } catch {
      setError('Không thể tạo lịch hẹn. Khung giờ có thể vừa được người khác đặt.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-dialog-title"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-white p-6 shadow-2xl"
      >
        <header className="mb-6">
          <h2 id="appointment-dialog-title" className="text-xl font-semibold text-slate-900">
            Tạo lịch hẹn cho khách
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Hệ thống tự gửi Zalo trước giờ khám 24 tiếng. Lịch dưới 24 tiếng sẽ được đưa vào hàng
            đợi gửi ngay.
          </p>
        </header>

        {loadingInitialData ? (
          <p className="py-8 text-center text-sm text-slate-500">Đang tải dữ liệu...</p>
        ) : (
          <div className="space-y-5">
            <section className="space-y-2">
              <label htmlFor="pet-search" className="text-sm font-medium text-slate-800">
                Tìm khách hàng hoặc thú cưng
              </label>

              <div className="flex gap-2">
                <input
                  id="pet-search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void handleSearchPets();
                    }
                  }}
                  placeholder="Tên khách, số điện thoại, tên pet"
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-600"
                />

                <button
                  type="button"
                  disabled={loadingPets}
                  onClick={() => void handleSearchPets()}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium disabled:opacity-50"
                >
                  {loadingPets ? 'Đang tìm...' : 'Tìm'}
                </button>
              </div>
            </section>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Thú cưng <span className="text-red-500">*</span>
              </span>

              <select
                value={petId}
                onChange={(event) => setPetId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Chọn khách hàng và thú cưng</option>

                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} — {pet.ownerFullName ?? pet.customerFullName ?? 'Khách hàng'}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Dịch vụ <span className="text-red-500">*</span>
              </span>

              <select
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Chọn dịch vụ</option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} — {service.durationMin} phút
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-800">
                  Ngày khám <span className="text-red-500">*</span>
                </span>

                <input
                  type="date"
                  value={date}
                  min={getLocalDate()}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-800">
                  Khung giờ <span className="text-red-500">*</span>
                </span>

                <select
                  value={startTime}
                  disabled={!serviceId || !date || loadingSlots}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                >
                  <option value="">{loadingSlots ? 'Đang tải...' : 'Chọn khung giờ'}</option>

                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {serviceId && date && !loadingSlots && slots.length === 0 && (
              <p className="text-sm text-amber-700">
                Không còn khung giờ phù hợp trong ngày đã chọn.
              </p>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">Ghi chú</span>

              <textarea
                value={note}
                maxLength={500}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Nội dung khách trao đổi qua điện thoại"
                className="min-h-24 w-full resize-y rounded-lg border border-slate-300 px-3 py-2"
              />

              <span className="block text-right text-xs text-slate-400">{note.length}/500</span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>
        )}

        <footer className="mt-6 flex justify-end gap-2 border-t pt-4">
          <button
            type="button"
            disabled={submitting}
            onClick={handleClose}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={submitting || loadingInitialData}
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {submitting ? 'Đang tạo...' : 'Tạo lịch hẹn'}
          </button>
        </footer>
      </form>
    </div>
  );
}
