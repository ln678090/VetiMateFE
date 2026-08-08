'use client';

import { useAuthStore } from '@/stores/auth.store';
import { BookingForm } from '@/features/booking/components/BookingForm';
import { useMyAppointments, useMyCustomer } from '@/features/booking/hooks/use-clinic';
import { formatVND, formatDateTime } from '@/lib/utils';

export default function BookingPage() {
  // customerId lấy từ user đã đăng nhập (map user -> clinic customer ở BE)
  const user = useAuthStore((s) => s.user);
  const { data: customer, isLoading: loadingCustomer, isError } =
    useMyCustomer();
  const customerId = customer?.id ?? '';

  const { data: appointments } = useMyAppointments(customerId);
if(!customerId){
  console.log('customerId null');
}
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div>
        <h1 className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-3xl font-bold text-transparent">
          Đặt lịch khám thú y
        </h1>
        <p className="text-muted-foreground">
          Chọn thú cưng, dịch vụ và thời gian phù hợp.
        </p>
      </div>

      <BookingForm customerId={customerId} />

      {/* Lịch sử đặt lịch */}
      {appointments && appointments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Lịch hẹn của bạn</h2>
          {appointments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl border bg-white/80 p-4 backdrop-blur-xl"
            >
              <div>
                <p className="font-medium">
                  {a.serviceName} — {a.petName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(a.startAt)} · {a.durationMin} phút
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-rose-600">
                  {formatVND(a.priceSnapshot)}
                </p>
                <span className="text-xs uppercase text-amber-600">
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
