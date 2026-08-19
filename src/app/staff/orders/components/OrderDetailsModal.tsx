import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShopOrderResp, OrderStatus } from '@/types/staff';
import { staffService } from '@/services/staff.service';
import { formatVND } from '@/lib/utils';
import Image from 'next/image';
import { CalendarDays, CreditCard, MapPin, Package, Phone, User } from 'lucide-react';

interface OrderDetailsModalProps {
  order: ShopOrderResp | null;
  isOpen: boolean;
  onClose: () => void;
  statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }>;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  statusConfig,
}: OrderDetailsModalProps) {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      staffService.updateOrderStatus(id, { status }),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['staff', 'orders'] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });

  const approveCancelMutation = useMutation({
    mutationFn: (id: string) => staffService.approveCancel(id),
    onSuccess: () => {
      toast.success('Đã chấp nhận yêu cầu hủy đơn');
      queryClient.invalidateQueries({ queryKey: ['staff', 'orders'] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi duyệt yêu cầu hủy');
    },
  });

  const rejectCancelMutation = useMutation({
    mutationFn: (id: string) => staffService.rejectCancel(id),
    onSuccess: () => {
      toast.success('Đã từ chối yêu cầu hủy đơn');
      queryClient.invalidateQueries({ queryKey: ['staff', 'orders'] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi từ chối yêu cầu hủy');
    },
  });

  if (!order) return null;

  const currentStatusConfig = statusConfig[order.status];
  const STATUS_SEQUENCE = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED'];
  const currentStatusIndex = STATUS_SEQUENCE.indexOf(order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-3xl md:max-w-4xl gap-0 p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200/70 dark:border-zinc-800/60 rounded-2xl shadow-2xl">
        
        {/* Header Section */}
        <div className="bg-zinc-50/80 dark:bg-zinc-900/40 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/60">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-500" />
                  Đơn hàng #{order.orderCode}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleString('vi-VN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </div>
              </div>

              {/* Status Updater */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Trạng thái:
                </span>
                <select
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white transition-all cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/80"
                  value={order.status}
                  disabled={updateStatusMutation.isPending || order.status === 'CANCELLED' || order.status === 'COMPLETED' || order.cancellationRequested}
                  onChange={(e) =>
                    updateStatusMutation.mutate({
                      id: order.id,
                      status: e.target.value as OrderStatus,
                    })
                  }
                >
                  {order.status === 'CANCELLED' ? (
                    <option value="CANCELLED">{statusConfig['CANCELLED'].label}</option>
                  ) : (
                    STATUS_SEQUENCE.map((key, index) => {
                      const config = statusConfig[key as OrderStatus];
                      const isCurrent = index === currentStatusIndex;
                      const isNext = index === currentStatusIndex + 1;
                      const isDisabled = !isCurrent && !isNext;
                      
                      return (
                        <option key={key} value={key} disabled={isDisabled}>
                          {config.label}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Cancellation Request Banner */}
        {order.cancellationRequested && (
          <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-500">Khách hàng yêu cầu hủy đơn này!</h4>
                {order.cancellationReason && (
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    Lý do: <span className="font-medium italic">{order.cancellationReason}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors"
                  onClick={() => approveCancelMutation.mutate(order.id)}
                  disabled={approveCancelMutation.isPending || rejectCancelMutation.isPending}
                >
                  {approveCancelMutation.isPending ? 'Đang xử lý...' : 'Chấp nhận Hủy'}
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-900 rounded-lg transition-colors"
                  onClick={() => rejectCancelMutation.mutate(order.id)}
                  disabled={approveCancelMutation.isPending || rejectCancelMutation.isPending}
                >
                  {rejectCancelMutation.isPending ? 'Đang xử lý...' : 'Từ chối'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left Column: Customer & Delivery Details */}
            <div className="space-y-6 lg:col-span-1">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Thông tin khách hàng
                </h3>
                <div className="p-4 rounded-xl border border-zinc-200/70 bg-white dark:border-zinc-800/60 dark:bg-zinc-900/20 space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 mt-0.5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{order.recipientName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-0.5 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">{order.recipientPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Giao hàng & Thanh toán
                </h3>
                <div className="p-4 rounded-xl border border-zinc-200/70 bg-white dark:border-zinc-800/60 dark:bg-zinc-900/20 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {order.shippingAddress}
                    </p>
                  </div>
                  {order.note && (
                    <div className="pl-7">
                      <p className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 p-2 rounded-lg inline-block border border-amber-200/50 dark:border-amber-500/20">
                        Ghi chú: {order.note}
                      </p>
                    </div>
                  )}
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Items */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Sản phẩm đã đặt ({order.items.length})
              </h3>
              
              <div className="rounded-xl border border-zinc-200/70 bg-white overflow-hidden dark:border-zinc-800/60 dark:bg-zinc-900/20">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-700">
                        <Image
                          src={item.productImage || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&q=80'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="font-medium text-zinc-900 dark:text-white text-base line-clamp-2">
                          {item.productName}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formatVND(item.unitPrice)}</span>
                          <span>×</span>
                          <span>{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center text-right">
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {formatVND(item.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Footer */}
                <div className="bg-zinc-50/80 dark:bg-zinc-900/50 p-5 border-t border-zinc-200/70 dark:border-zinc-800/60">
                  <div className="space-y-3 ms-auto w-full sm:w-2/3 lg:w-3/4">
                    <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                      <span>Tạm tính</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">{formatVND(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                      <span>Phí vận chuyển</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">{formatVND(order.shippingFee)}</span>
                    </div>
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-900 dark:text-white">Tổng cộng</span>
                      <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                        {formatVND(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
