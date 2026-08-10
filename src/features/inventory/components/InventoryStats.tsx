'use client';

import { Package, AlertTriangle, Clock, FileText, Users, Pill } from 'lucide-react';
import type { InventoryDashboardResp } from '@/types/inventory';

interface InventoryStatsProps {
  data: InventoryDashboardResp | undefined;
  isLoading: boolean;
}

const stats = [
  {
    key: 'totalMedicines' as const,
    label: 'Thuốc / Vật tư',
    icon: Pill,
    gradient: 'from-blue-500 to-cyan-400',
    shadow: 'shadow-blue-200/50 dark:shadow-blue-500/20',
  },
  {
    key: 'totalSuppliers' as const,
    label: 'Nhà cung cấp',
    icon: Users,
    gradient: 'from-emerald-500 to-teal-400',
    shadow: 'shadow-emerald-200/50 dark:shadow-emerald-500/20',
  },
  {
    key: 'lowStockCount' as const,
    label: 'Tồn kho thấp',
    icon: Package,
    gradient: 'from-amber-500 to-orange-400',
    shadow: 'shadow-amber-200/50 dark:shadow-amber-500/20',
  },
  {
    key: 'nearExpiryCount' as const,
    label: 'Cận date (30 ngày)',
    icon: Clock,
    gradient: 'from-rose-500 to-pink-400',
    shadow: 'shadow-rose-200/50 dark:shadow-rose-500/20',
  },
  {
    key: 'expiredCount' as const,
    label: 'Đã hết hạn',
    icon: AlertTriangle,
    gradient: 'from-red-600 to-rose-500',
    shadow: 'shadow-red-200/50 dark:shadow-red-500/20',
  },
  {
    key: 'pendingVouchers' as const,
    label: 'Phiếu chờ duyệt',
    icon: FileText,
    gradient: 'from-violet-500 to-purple-400',
    shadow: 'shadow-violet-200/50 dark:shadow-violet-500/20',
  },
];

export function InventoryStats({ data, isLoading }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const value = data ? data[stat.key] : 0;

        return (
          <div
            key={stat.key}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-5 backdrop-blur-sm transition-all hover:shadow-lg dark:border-zinc-800/60 dark:bg-zinc-900/60"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </p>
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                ) : (
                  <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {value.toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-md ${stat.shadow} transition-transform group-hover:scale-110`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
            </div>

            {/* Decorative gradient bar */}
            <div
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.gradient} opacity-60`}
            />
          </div>
        );
      })}

      {/* Total stock value — full-width card */}
      {data && (
        <div className="col-span-full rounded-2xl border border-zinc-200/70 bg-gradient-to-br from-zinc-50 to-white p-5 dark:border-zinc-800/60 dark:from-zinc-900 dark:to-zinc-800/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
                Tổng giá trị tồn kho (giá nhập)
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {data.totalStockValue.toLocaleString('vi-VN')}
                <span className="ml-1 text-base font-medium text-zinc-500">₫</span>
              </p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-md dark:from-zinc-300 dark:to-white dark:text-zinc-900">
              <Package className="h-6 w-6" strokeWidth={2} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
