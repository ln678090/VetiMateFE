'use client';

import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Copy,
  FileText,
  MapPin,
  Package,
  Store,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatVND } from '@/lib/utils';
import {
  STATUS_CONFIG,
  TRACKING_STEPS,
  getStepIndex,
  OrderStatus,
  Order,
} from '@/app/(protected)/order-tracking/page';
import { orderService } from '@/services/order.service';

export default function OrderTrackingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: backendOrder, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
  });

  if (isLoading) {
    return <div className="py-20 text-center text-zinc-500">Đang tải chi tiết đơn hàng...</div>;
  }

  if (error || !backendOrder) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <p>Không tìm thấy đơn hàng này hoặc đã có lỗi xảy ra.</p>
        <Link href="/order-tracking" className="mt-4 inline-block text-rose-500 hover:underline">
          Trở lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const order: Order = {
    id: backendOrder.id,
    code: backendOrder.orderCode,
    status: backendOrder.status.toLowerCase() as OrderStatus,
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
    items: backendOrder.items.map((item) => ({
      id: item.id,
      name: item.productName,
      image: item.productImage || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&q=80',
      quantity: item.quantity,
      price: item.unitPrice,
    })),
    total: backendOrder.totalAmount,
    shippingFee: backendOrder.shippingFee,
    address: backendOrder.shippingAddress,
    paymentMethod: backendOrder.paymentMethod,
  };

  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
  const stepIdx = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-12 pt-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between rounded-t-xl bg-white p-4 shadow-sm dark:bg-zinc-950">
        <Link
          href="/order-tracking"
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"
        >
          <ChevronLeft className="h-4 w-4" /> TRỞ LẠI
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium text-zinc-500">MÃ ĐƠN HÀNG: {order.code}</span>
          <span className="text-zinc-300">|</span>
          <span className={`font-bold uppercase ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Stepper Progress */}
      <Card className="rounded-none border-x-0 border-y-0 bg-white p-8 shadow-sm dark:bg-zinc-950 sm:rounded-xl sm:border">
        {!isCancelled ? (
          <div className="mx-auto w-full px-2 sm:px-8">
            {/* Stepper with continuous background line */}
            <div className="relative">
              {/* Background line (gray) - spans from first icon center to last icon center */}
              <div className="absolute left-[10%] right-[10%] top-6 h-[3px] bg-zinc-200 dark:bg-zinc-800" />
              {/* Progress line (green) - width based on current step */}
              <div
                className="absolute left-[10%] top-6 h-[3px] bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${(stepIdx / (TRACKING_STEPS.length - 1)) * 80}%`,
                }}
              />

              {/* Step icons and labels */}
              <div className="relative flex justify-between">
                {TRACKING_STEPS.map((step, idx) => {
                  const isCompleted = idx <= stepIdx;
                  const StepIcon = [FileText, Clock, Package, Truck, CheckCircle2][idx];
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center"
                      style={{ width: '20%' }}
                    >
                      {/* Icon circle with white ring to cover the line */}
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-full ring-4 ring-white dark:ring-zinc-950 transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600'
                        }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>

                      {/* Label */}
                      <span
                        className={`mt-3 text-center text-xs font-medium leading-tight ${
                          isCompleted
                            ? 'text-zinc-900 dark:text-white'
                            : 'text-zinc-400 dark:text-zinc-600'
                        }`}
                      >
                        {step.label}
                      </span>

                      {/* Timestamp */}
                      {isCompleted && (
                        <div className="mt-1 text-center text-[10px] leading-tight text-zinc-400">
                          <div>
                            {new Date(order.updatedAt).toLocaleTimeString(
                              'vi-VN',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </div>
                          <div>
                            {new Date(order.updatedAt).toLocaleDateString(
                              'vi-VN',
                              { day: '2-digit', month: '2-digit', year: 'numeric' }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {order.status === 'delivered' && (
              <div className="mt-8 flex justify-center gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
                <Button className="h-10 w-full sm:w-64 bg-rose-500 hover:bg-rose-600 text-white">
                  Đã Nhận Hàng
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
              <XCircle className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
              Đơn Hàng Đã Hủy
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Bạn đã hủy đơn hàng này. Vui lòng đặt lại nếu có nhu cầu.
            </p>
          </div>
        )}
      </Card>

      {/* Address */}
      <Card className="overflow-hidden rounded-none border-x-0 border-y-0 bg-white shadow-sm dark:bg-zinc-950 sm:rounded-xl sm:border relative">
        {/* Shopee style decorative border */}
        <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)' }}></div>
        
        <div className="p-6">
          <h3 className="mb-4 text-lg font-medium text-zinc-900 dark:text-white">
            Địa Chỉ Nhận Hàng
          </h3>
          <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <p className="font-bold text-zinc-900 dark:text-white">{backendOrder.recipientName}</p>
            <p>(+84) {backendOrder.recipientPhone}</p>
            <p className="mt-2 text-zinc-500">{order.address}</p>
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <Card className="rounded-none border-x-0 border-y-0 bg-white shadow-sm dark:bg-zinc-950 sm:rounded-xl sm:border">
        {/* Shop Header */}
        <div className="flex items-center gap-2 border-b border-zinc-100 p-4 dark:border-zinc-800">
          <Store className="h-5 w-5 text-zinc-500" />
          <span className="font-bold text-zinc-900 dark:text-white">
            VetiMate Official Shop
          </span>
        </div>

        {/* Items */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-zinc-100 dark:border-zinc-800">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500">Phân loại hàng: Mặc định</p>
                  <p className="mt-1 text-xs text-zinc-500">x{item.quantity}</p>
                </div>
                <div className="flex justify-end">
                  <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                    {formatVND(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="ml-auto w-full max-w-sm space-y-3 text-sm">
            <div className="flex justify-between text-zinc-500">
              <span>Tổng tiền hàng</span>
              <span>{formatVND(backendOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Phí vận chuyển</span>
              <span>{formatVND(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Giảm giá</span>
              <span>-0 ₫</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-3 dark:border-zinc-700">
              <span className="text-base text-zinc-900 dark:text-white">Thành tiền</span>
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                {formatVND(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between border-t border-zinc-100 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Vui lòng thanh toán <span className="font-bold text-rose-600 dark:text-rose-400">{formatVND(order.total)}</span> khi nhận hàng.</span>
          </div>
          <div className="text-sm text-zinc-500">
            Phương thức Thanh toán:{' '}
            <span className="font-medium text-zinc-900 dark:text-white">
              {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
