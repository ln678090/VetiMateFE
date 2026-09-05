'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CancelOrderDialog } from '@/features/order/components/CancelOrderDialog';
import { OrderBadge } from '@/features/order/components/OrderBadge';
import { OrderTimeline } from '@/features/order/components/OrderTimeline';
import { useOrderDetail, useOrderTracking } from '@/features/order/hooks/use-orders';
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RotateCw,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

function formatDate(isoString?: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = typeof params?.id === 'string' ? params.id : '';

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
    refetch: refetchOrder,
  } = useOrderDetail(orderId);

  const {
    data: trackingData,
    isLoading: isTrackingLoading,
    isFetching: isTrackingFetching,
    refetch: refetchTracking,
  } = useOrderTracking(orderId);

  const isLoading = isOrderLoading || isTrackingLoading;
  const isCancellable = order?.status === 'PENDING';

  // Lấy lịch sử tracking từ endpoint tracking hoặc từ order detail
  const trackingHistory = trackingData?.tracking ?? order?.tracking ?? [];
  const currentStatus = trackingData?.status ?? order?.status ?? 'PENDING';

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/70">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 rounded-2xl lg:col-span-1" />
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (isOrderError || !order) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/customer/orders">
            <ArrowLeft className="size-4" />
            <span>Quay lại danh sách đơn hàng</span>
          </Link>
        </Button>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-12 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <AlertCircle className="size-12 text-rose-500" />
          <h3 className="mt-4 text-lg font-bold text-rose-700 dark:text-rose-400">
            Không tìm thấy thông tin đơn hàng
          </h3>
          <p className="mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            Đơn hàng không tồn tại hoặc bạn không có quyền truy cập đơn hàng này.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" size="sm" onClick={() => refetchOrder()}>
              Thử lại
            </Button>
            <Button asChild size="sm">
              <Link href="/customer/orders">Xem tất cả đơn hàng</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <Link href="/customer/orders">
            <ArrowLeft className="size-4" />
            <span>Quay lại danh sách đơn hàng</span>
          </Link>
        </Button>

        {/* Order Info Card Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                #{order.orderCode}
              </h1>
              <OrderBadge status={currentStatus} />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Đặt hàng lúc: <span className="font-medium text-zinc-700 dark:text-zinc-300">{formatDate(order.createdAt)}</span>
              {order.updatedAt && (
                <> • Cập nhật: <span className="font-medium text-zinc-700 dark:text-zinc-300">{formatDate(order.updatedAt)}</span></>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchTracking();
                refetchOrder();
              }}
              disabled={isTrackingFetching}
              className="gap-1.5 text-xs"
              title="Làm mới trạng thái"
            >
              <RotateCw className={`size-3.5 ${isTrackingFetching ? 'animate-spin' : ''}`} />
              <span>Cập nhật</span>
            </Button>

            {isCancellable && (
              <Button
                variant="destructive"
                size="sm"
                className="text-xs font-semibold"
                onClick={() => setShowCancelDialog(true)}
              >
                Hủy đơn hàng
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Left Column (Timeline) & Right Column (Products & Shipping Info) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Timeline Stepper */}
        <div className="lg:col-span-5">
          <Card className="border-zinc-200/80 bg-white/80 shadow-xs backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
            <CardHeader className="border-b border-zinc-100 p-4 dark:border-zinc-800/60">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <Truck className="size-4 text-sky-500" />
                <span>Tiến độ giao hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <OrderTimeline
                currentStatus={currentStatus}
                trackingHistory={trackingHistory}
              />

              <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 text-[11px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
                💡 Trạng thái đơn hàng được cập nhật tự động theo hành trình xử lý và vận chuyển thực tế từ hệ thống kho VetiMate.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Items & Shipping details */}
        <div className="space-y-6 lg:col-span-7">
          {/* Purchased Items */}
          <Card className="border-zinc-200/80 bg-white/80 shadow-xs backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
            <CardHeader className="border-b border-zinc-100 p-4 dark:border-zinc-800/60">
              <CardTitle className="flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <span className="flex items-center gap-2">
                  <ShoppingBag className="size-4 text-emerald-600" />
                  <span>Sản phẩm ({order.items?.length ?? 0})</span>
                </span>
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  Tổng {formatCurrency(order.totalAmount)}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="divide-y divide-zinc-100 p-0 dark:divide-zinc-800/60">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 p-4">
                  {/* Thumbnail */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                      {item.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Package className="size-6 text-zinc-400" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Số lượng: <span className="font-semibold text-zinc-700 dark:text-zinc-300">×{item.quantity}</span> • Đơn giá: {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery & Payment Information */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Delivery Info */}
            <Card className="border-zinc-200/80 bg-white/80 shadow-xs backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <CardHeader className="border-b border-zinc-100 p-4 dark:border-zinc-800/60">
                <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <MapPin className="size-3.5 text-zinc-400" />
                  <span>Địa chỉ nhận hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  <User className="size-3.5 text-zinc-400" />
                  <span>{order.recipientName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <Phone className="size-3.5 text-zinc-400" />
                  <span>{order.recipientPhone}</span>
                </div>
                <div className="mt-1 text-zinc-600 dark:text-zinc-400">
                  {order.shippingAddress}
                </div>
                {order.note && (
                  <div className="mt-2 rounded-lg bg-zinc-50 p-2 text-[11px] text-zinc-500 dark:bg-zinc-800/50">
                    <strong>Ghi chú:</strong> {order.note}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="border-zinc-200/80 bg-white/80 shadow-xs backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <CardHeader className="border-b border-zinc-100 p-4 dark:border-zinc-800/60">
                <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <CreditCard className="size-3.5 text-zinc-400" />
                  <span>Thanh toán</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 p-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Hình thức:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Trạng thái:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between text-sm font-bold">
                  <span className="text-zinc-900 dark:text-zinc-100">Tổng thanh toán:</span>
                  <span className="text-base text-rose-600 dark:text-rose-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isCancellable && (
        <CancelOrderDialog
          orderId={order.orderId}
          orderCode={order.orderCode}
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          onSuccess={() => {
            refetchOrder();
            refetchTracking();
          }}
        />
      )}
    </div>
  );
}
