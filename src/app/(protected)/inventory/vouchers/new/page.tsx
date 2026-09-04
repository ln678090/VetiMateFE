'use client';

import { ArrowLeft, FilePlus } from 'lucide-react';
import Link from 'next/link';
import { VoucherForm } from '@/features/inventory/components/VoucherForm';

export default function NewVoucherPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/inventory/vouchers"
          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-md shadow-rose-200/50 dark:shadow-rose-500/20">
          <FilePlus className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tạo phiếu kho mới
          </h1>
          <p className="text-sm text-zinc-500">Nhập kho, xuất kho hoặc kiểm kê</p>
        </div>
      </div>

      <VoucherForm />
    </div>
  );
}
