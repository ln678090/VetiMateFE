'use client';

import { useState } from 'react';
import { ArrowLeft, FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { VoucherTable } from '@/features/inventory/components/VoucherTable';
import { useVouchers } from '@/features/inventory/hooks/use-inventory';
import type { VoucherType, VoucherStatus } from '@/types/inventory';

export default function VouchersPage() {
  const [typeFilter, setTypeFilter] = useState<VoucherType | undefined>();
  const [statusFilter, setStatusFilter] = useState<VoucherStatus | undefined>();
  const [page] = useState(0);

  const { data: pageData, isLoading } = useVouchers({
    type: typeFilter,
    status: statusFilter,
    page,
    size: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 text-white shadow-md">
            <FileText className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Phiếu kho
            </h1>
            <p className="text-sm text-zinc-500">Nhập kho, xuất kho, kiểm kê</p>
          </div>
        </div>
        <Link
          href="/inventory/vouchers/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-rose-200/50 transition-all hover:shadow-lg dark:shadow-rose-500/20"
        >
          <Plus className="h-4 w-4" />
          Tạo phiếu mới
        </Link>
      </div>

      <VoucherTable
        data={pageData?.items || []}
        isLoading={isLoading}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
      />
    </div>
  );
}
