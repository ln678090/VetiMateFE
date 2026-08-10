'use client';

import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { SupplierTable } from '@/features/inventory/components/SupplierTable';
import { useSuppliers } from '@/features/inventory/hooks/use-inventory';

export default function SuppliersPage() {
  const { data, isLoading } = useSuppliers(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/inventory"
          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md">
          <Users className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Nhà cung cấp
          </h1>
          <p className="text-sm text-zinc-500">
            Quản lý danh sách nhà cung cấp thuốc, vật tư, sản phẩm
          </p>
        </div>
      </div>

      <SupplierTable data={data} isLoading={isLoading} />
    </div>
  );
}
