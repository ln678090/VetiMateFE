'use client';

import type { StockBatchResp } from '@/types/inventory';

interface BatchTableProps {
  data: StockBatchResp[] | undefined;
  isLoading: boolean;
}

export function BatchTable({ data, isLoading }: BatchTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="py-8 text-center text-sm text-zinc-500">Chưa có lô hàng nào</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200/70 bg-zinc-50/80 dark:border-zinc-700/60 dark:bg-zinc-800/40">
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                Mã lô
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                Mặt hàng
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                NCC
              </th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                SL nhập
              </th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                Tồn
              </th>
              <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                Giá nhập
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                HSD
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                Ngày nhập
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {data.map((batch) => (
              <tr
                key={batch.id}
                className={`transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 ${
                  batch.isExpired
                    ? 'bg-red-50/40 dark:bg-red-900/5'
                    : batch.isNearExpiry
                      ? 'bg-amber-50/40 dark:bg-amber-900/5'
                      : ''
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                  {batch.batchCode || '—'}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                  {batch.medicineName || batch.productName || '—'}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {batch.supplierName || '—'}
                </td>
                <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                  {batch.quantity}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-semibold ${
                      batch.remainingQty <= 0 ? 'text-zinc-400' : 'text-zinc-900 dark:text-white'
                    }`}
                  >
                    {batch.remainingQty}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                  {batch.importPrice.toLocaleString('vi-VN')}₫
                </td>
                <td className="px-4 py-3">
                  {batch.expiryDate ? (
                    <span
                      className={`text-xs font-medium ${
                        batch.isExpired
                          ? 'text-red-600 dark:text-red-400'
                          : batch.isNearExpiry
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {batch.expiryDate}
                      {batch.isExpired && ' ⚠️'}
                      {batch.isNearExpiry && !batch.isExpired && ' ⏰'}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {new Date(batch.receivedAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
