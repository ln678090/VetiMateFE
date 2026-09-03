import { BillingBoard } from '@/features/staff/components/BillingBoard';

export default function Page() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          Hóa đơn & Thanh toán
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Quản lý hóa đơn dịch vụ khám chữa bệnh, spa và thanh toán
        </p>
      </header>

      <BillingBoard />
    </div>
  );
}
