'use client';

import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import type { StockBatchResp } from '@/types/inventory';

interface StockAlertsProps {
  nearExpiry: StockBatchResp[];
  expired: StockBatchResp[];
  isLoading: boolean;
}

export function StockAlerts({ nearExpiry, expired, isLoading }: StockAlertsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
    );
  }

  const hasAlerts = nearExpiry.length > 0 || expired.length > 0;

  if (!hasAlerts) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200/70 bg-emerald-50/50 py-10 dark:border-emerald-800/40 dark:bg-emerald-900/10">
        <ShieldAlert className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
        <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Không có cảnh báo nào
        </p>
        <p className="mt-1 text-xs text-zinc-500">Tất cả lô hàng đều an toàn</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Expired */}
      {expired.length > 0 && (
        <div className="rounded-2xl border border-red-200/70 bg-red-50/50 p-4 dark:border-red-800/40 dark:bg-red-900/10">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
              Lô đã hết hạn ({expired.length})
            </h3>
          </div>
          <div className="space-y-2">
            {expired.slice(0, 5).map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 text-sm dark:bg-zinc-900/60"
              >
                <div>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {batch.medicineName || batch.productName}
                  </span>
                  {batch.batchCode && (
                    <span className="ml-2 text-xs text-zinc-500">Lô: {batch.batchCode}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    HSD: {batch.expiryDate}
                  </span>
                  <span className="ml-3 text-xs text-zinc-500">Còn: {batch.remainingQty}</span>
                </div>
              </div>
            ))}
            {expired.length > 5 && (
              <p className="text-center text-xs text-zinc-500">
                ...và {expired.length - 5} lô khác
              </p>
            )}
          </div>
        </div>
      )}

      {/* Near expiry */}
      {nearExpiry.length > 0 && (
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-4 dark:border-amber-800/40 dark:bg-amber-900/10">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Cận date — 30 ngày tới ({nearExpiry.length})
            </h3>
          </div>
          <div className="space-y-2">
            {nearExpiry.slice(0, 5).map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 text-sm dark:bg-zinc-900/60"
              >
                <div>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {batch.medicineName || batch.productName}
                  </span>
                  {batch.batchCode && (
                    <span className="ml-2 text-xs text-zinc-500">Lô: {batch.batchCode}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    HSD: {batch.expiryDate}
                  </span>
                  <span className="ml-3 text-xs text-zinc-500">Còn: {batch.remainingQty}</span>
                </div>
              </div>
            ))}
            {nearExpiry.length > 5 && (
              <p className="text-center text-xs text-zinc-500">
                ...và {nearExpiry.length - 5} lô khác
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
