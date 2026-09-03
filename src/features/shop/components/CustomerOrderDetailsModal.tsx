import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Package, Truck, Calendar, MapPin, Phone, User, CreditCard, Receipt } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/types/order';
import { formatVND, cn } from '@/lib/utils';

const STATUS_MAP: Record<OrderStatus, { label: string; colorClass: string }> = {
  PENDING: { label: 'CHỜ XÁC NHẬN', colorClass: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'ĐANG XỬ LÝ', colorClass: 'bg-blue-100 text-blue-700' },
  SHIPPING: { label: 'ĐANG GIAO', colorClass: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'ĐÃ GIAO', colorClass: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'ĐÃ HỦY', colorClass: 'bg-rose-100 text-rose-700' },
};

interface CustomerOrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCancelDialog?: () => void;
}

export function CustomerOrderDetailsModal({
  order,
  isOpen,
  onClose,
  onOpenCancelDialog,
}: CustomerOrderDetailsModalProps) {
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);

  if (!order) return null;

  // Extract cancel request info
  const hasCancelRequest = order.note?.includes('[CANCEL_REQUEST]:');
  const cancelReasonMatch = order.note?.match(/\[CANCEL_REQUEST\]: (.*)$/);
  const cancelReason = cancelReasonMatch ? cancelReasonMatch[1] : '';

  // Extract shipping and note parts
  let noteText = '';
  let addressText = '';
  let phoneText = '';

  if (order.note && !order.note.startsWith('Shipping Address:')) {
    noteText = order.note.replace(/\| \[CANCEL_REQUEST\]:.*$/, '').trim();
  } else if (order.note) {
    const parts = order.note.split(' | ');
    parts.forEach(p => {
      if (p.startsWith('Shipping Address:')) addressText = p.replace('Shipping Address:', '').trim();
      if (p.startsWith('Phone:')) phoneText = p.replace('Phone:', '').trim();
      if (p.startsWith('Note:')) noteText = p.replace('Note:', '').trim();
    });
    noteText = noteText.replace(/\| \[CANCEL_REQUEST\]:.*$/, '').trim();
  }

  // Hide null or empty strings
  if (noteText === 'null' || !noteText) noteText = 'Không có ghi chú';

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.PENDING;

  const STEPS = [
    { id: 'PENDING', label: 'Chờ xác nhận' },
    { id: 'CONFIRMED', label: 'Đang xử lý' },
    { id: 'SHIPPING', label: 'Đang giao' },
    { id: 'DELIVERED', label: 'Đã giao' },
  ];

  const isCancelled = order.status === 'CANCELLED';
  const currentSteps = isCancelled
    ? [
      { id: 'PENDING', label: 'Chờ xác nhận' },
      { id: 'CANCELLED', label: 'Đã hủy' },
    ]
    : STEPS;

  const currentStepIndex = currentSteps.findIndex((s) => s.id === order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl sm:max-w-2xl gap-0 p-0 overflow-hidden rounded-2xl sm:rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl">Chi Tiết Đơn Hàng</DialogTitle>
                <div className="text-sm font-medium text-zinc-500 mt-1 flex items-center gap-2">
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold">{order.code}</span>
                  •
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Tạo: {format(new Date(order.createdAt), "HH:mm - dd/MM/yyyy", { locale: vi })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={`px-3 py-1 font-bold tracking-wider border-0 ${statusInfo.colorClass}`}>
                {statusInfo.label}
              </Badge>
              {hasCancelRequest && order.status !== 'CANCELLED' && (
                <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                  Đang chờ duyệt hủy
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh]">
          <div className="p-6 space-y-8 bg-zinc-50/50 dark:bg-zinc-900/20">
            {/* Timeline */}
            <div className="py-8 px-4 sm:px-12">
              <div className="relative flex justify-between">
                <div className="absolute top-3 left-0 w-full h-1 bg-zinc-200 -translate-y-1/2 rounded-full dark:bg-zinc-800" />
                <div
                  className={cn("absolute top-3 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-500",
                    isCancelled ? "bg-rose-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${(Math.max(0, currentStepIndex) / (currentSteps.length - 1)) * 100}%` }}
                />
                {currentSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  let timeToShow = null;
                  if (isCurrent && order.updatedAt) {
                    timeToShow = order.updatedAt;
                  } else if (index === 0 && order.createdAt) {
                    timeToShow = order.createdAt;
                  }

                  return (
                    <div key={step.id} className="relative flex flex-col items-center gap-2 z-10">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full border-4 flex items-center justify-center bg-white dark:bg-zinc-950',
                          isCompleted
                            ? isCancelled ? 'border-rose-500' : 'border-emerald-500'
                            : 'border-zinc-200 dark:border-zinc-800'
                        )}
                      >
                        {isCompleted && (
                          <div className={cn("w-2 h-2 rounded-full", isCancelled ? "bg-rose-500" : "bg-emerald-500")} />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-xs font-semibold whitespace-nowrap absolute top-8',
                          isCurrent
                            ? isCancelled ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500'
                            : isCompleted
                              ? 'text-zinc-900 dark:text-zinc-100'
                              : 'text-zinc-400'
                        )}
                      >
                        {step.label}
                      </span>
                      {timeToShow && (
                        <span className="text-[10px] text-zinc-500 absolute top-12 whitespace-nowrap">
                          {format(new Date(timeToShow), 'HH:mm dd/MM', { locale: vi })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unified User & Shipping Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                Thông Tin Giao Nhận
              </h3>
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* Row 1 */}
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Tên người nhận</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">{order.customerName || 'Không có tên'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Địa chỉ giao hàng</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-2 mt-0.5">
                        {addressText || order.shippingAddress || 'Nhận tại cửa hàng'}
                      </p>
                    </div>
                  </div>

                  {/* Separator spanning both columns */}
                  <div className="col-span-1 md:col-span-2">
                    <Separator />
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-0.5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Số điện thoại</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">{phoneText || order.customerPhone || 'Không có sđt'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-4 w-4 mt-0.5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Phương thức thanh toán</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                        {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán qua cổng (Online)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {hasCancelRequest && order.status !== 'CANCELLED' && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
                <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-1">Bạn đã yêu cầu hủy đơn này</h4>
                <p className="text-sm text-rose-600 dark:text-rose-300">
                  <span className="font-medium">Lý do:</span> {cancelReason}
                </p>
              </div>
            )}

            {order.status === 'CANCELLED' && hasCancelRequest && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Đơn hàng đã được hủy</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">Lý do bạn yêu cầu:</span> {cancelReason}
                </p>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                <Package className="h-4 w-4 text-rose-500" />
                Sản Phẩm Đã Đặt
              </h3>
              <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950">
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {(isItemsExpanded ? order.items : order.items.slice(0, 2)).map((item) => (
                    <li key={item.id} className="flex gap-4 p-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200/80 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                        <Image
                          src={item.productImage || ''}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          unoptimized />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="line-clamp-1 text-sm font-bold text-zinc-900 dark:text-white">
                          {item.productName}
                        </h4>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs font-medium text-zinc-500">x{item.quantity}</span>
                          <span className="text-sm font-bold text-rose-500">{formatVND(item.price)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {order.items.length > 2 && (
                  <div className="flex justify-center border-t border-zinc-100 py-3 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
                    <button
                      type="button"
                      onClick={() => setIsItemsExpanded(!isItemsExpanded)}
                      className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-rose-500 transition-colors dark:text-zinc-400 dark:hover:text-rose-400"
                    >
                      {isItemsExpanded ? 'Thu gọn' : `Xem thêm ${order.items.length - 2} sản phẩm`}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn('h-4 w-4 transition-transform duration-200', isItemsExpanded && 'rotate-180')}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="bg-zinc-50 p-4 border-t border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Tổng thanh toán:</span>
                    <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                      {formatVND(order.finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            {noteText && noteText !== 'Không có ghi chú' && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Ghi chú của bạn</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{noteText}</p>
              </div>
            )}

            {/* Action buttons */}
            {!isCancelled && order.status !== 'DELIVERED' && !hasCancelRequest && onOpenCancelDialog && (
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCancelDialog();
                  }}
                  className="rounded-xl border border-zinc-200 px-6 py-2.5 font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Hủy Đơn Hàng
                </button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
