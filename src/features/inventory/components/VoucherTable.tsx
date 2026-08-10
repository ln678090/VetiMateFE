'use client';

import { useState } from 'react';
import { Check, X, Eye, FileText } from 'lucide-react';
import type { StockVoucherResp, VoucherType, VoucherStatus } from '@/types/inventory';
import { useApproveVoucher, useCancelVoucher } from '../hooks/use-inventory';
import { getApiErrorMessage } from '@/lib/axios';
import { toast } from 'sonner';

const TYPE_LABELS: Record<VoucherType, { label: string; color: string }> = {
  IMPORT: { label: 'Nhập kho', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  EXPORT: { label: 'Xuất kho', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  TRANSFER: { label: 'Chuyển kho', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  STOCKTAKE: { label: 'Kiểm kê', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
};

const STATUS_LABELS: Record<VoucherStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Nháp', color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  APPROVED: { label: 'Đã duyệt', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

interface VoucherTableProps {
  data: StockVoucherResp[] | undefined;
  isLoading: boolean;
  typeFilter: VoucherType | undefined;
  statusFilter: VoucherStatus | undefined;
  onTypeChange: (v: VoucherType | undefined) => void;
  onStatusChange: (v: VoucherStatus | undefined) => void;
}

export function VoucherTable({
  data,
  isLoading,
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
}: VoucherTableProps) {
  const [detailId, setDetailId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={typeFilter || ''}
          onChange={(e) => onTypeChange((e.target.value || undefined) as VoucherType | undefined)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Tất cả loại</option>
          <option value="IMPORT">Nhập kho</option>
          <option value="EXPORT">Xuất kho</option>
          <option value="TRANSFER">Chuyển kho</option>
          <option value="STOCKTAKE">Kiểm kê</option>
        </select>
        <select
          value={statusFilter || ''}
          onChange={(e) => onStatusChange((e.target.value || undefined) as VoucherStatus | undefined)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="DRAFT">Nháp</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200/70 bg-zinc-50/80 dark:border-zinc-700/60 dark:bg-zinc-800/40">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Mã phiếu
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Loại
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                  Số dòng
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Ghi chú
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-center font-medium text-zinc-600 dark:text-zinc-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.map((v) => (
                    <VoucherRow
                      key={v.id}
                      voucher={v}
                      isExpanded={detailId === v.id}
                      onToggleDetail={() =>
                        setDetailId(detailId === v.id ? null : v.id)
                      }
                    />
                  ))}
            </tbody>
          </table>
        </div>
        {!isLoading && data?.length === 0 && (
          <div className="flex flex-col items-center py-12 text-sm text-zinc-500">
            <FileText className="mb-2 h-8 w-8 text-zinc-400" />
            Chưa có phiếu kho nào
          </div>
        )}
      </div>
    </div>
  );
}

function VoucherRow({
  voucher,
  isExpanded,
  onToggleDetail,
}: {
  voucher: StockVoucherResp;
  isExpanded: boolean;
  onToggleDetail: () => void;
}) {
  const approveMutation = useApproveVoucher();
  const cancelMutation = useCancelVoucher();

  const typeInfo = TYPE_LABELS[voucher.type];
  const statusInfo = STATUS_LABELS[voucher.status];

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(voucher.id);
      toast.success('Duyệt phiếu kho thành công');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(voucher.id);
      toast.success('Hủy phiếu kho thành công');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <>
      <tr className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30">
        <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
          {voucher.id.slice(0, 8)}...
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </td>
        <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
          {voucher.itemCount}
        </td>
        <td className="max-w-[200px] truncate px-4 py-3 text-zinc-600 dark:text-zinc-400">
          {voucher.note || '—'}
        </td>
        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
          {new Date(voucher.createdAt).toLocaleDateString('vi-VN')}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={onToggleDetail}
              className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </button>
            {voucher.status === 'DRAFT' && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className="rounded-lg p-1.5 text-emerald-500 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  title="Duyệt"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Hủy"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      {/* Expanded detail */}
      {isExpanded && voucher.items && voucher.items.length > 0 && (
        <tr>
          <td colSpan={7} className="bg-zinc-50/60 px-6 py-3 dark:bg-zinc-800/20">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-zinc-500">
                  <th className="pb-2 text-left font-medium">Mặt hàng</th>
                  <th className="pb-2 text-left font-medium">Lô</th>
                  <th className="pb-2 text-right font-medium">Số lượng</th>
                  <th className="pb-2 text-right font-medium">Đơn giá</th>
                  <th className="pb-2 text-left font-medium">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-700/40">
                {voucher.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-1.5 text-zinc-800 dark:text-zinc-200">
                      {item.medicineName || item.productName || '—'}
                    </td>
                    <td className="py-1.5 text-zinc-500">{item.batchCode || '—'}</td>
                    <td className="py-1.5 text-right text-zinc-800 dark:text-zinc-200">
                      {item.quantity}
                    </td>
                    <td className="py-1.5 text-right text-zinc-500">
                      {item.unitPrice ? `${item.unitPrice.toLocaleString('vi-VN')}₫` : '—'}
                    </td>
                    <td className="py-1.5 text-zinc-500">{item.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}
