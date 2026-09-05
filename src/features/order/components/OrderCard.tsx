'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { OrderSummaryResponse } from '@/types/order';
import { Eye, MapPin, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CancelOrderDialog } from './CancelOrderDialog';
import { OrderBadge } from './OrderBadge';

interface OrderCardProps {
  order: OrderSummaryResponse;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

function formatDate(isoString: string): string {
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

export function OrderCard({ order }: OrderCardProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const isCancellable = order.status === 'PENDING';

  return (
    <>
      <Card className="group relative overflow-hidden border-zinc-200/80 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:hover:border-zinc-750">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              #{order.orderCode}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <OrderBadge status={order.status} />
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4">
          <div className="flex items-start gap-3.5">
            {/* Product Thumbnail */}
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
              {order.firstItemImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={order.firstItemImage}
                  alt={order.firstItemName ?? 'Sản phẩm'}
                  className="size-full object-cover"
                />
              ) : (
                <Package className="size-8 stroke-[1.5]" />
              )}
            </div>

            {/* Product Info */}
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {order.firstItemName ?? 'Đơn hàng mua sắm'}
              </h3>

              {order.itemCount > 1 && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  và {order.itemCount - 1} sản phẩm khác
                </p>
              )}

              {order.shippingAddress && (
                <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <MapPin className="size-3.5 shrink-0 text-zinc-400" />
                  <span className="line-clamp-1">{order.shippingAddress}</span>
                </div>
              )}
            </div>

            {/* Total Amount */}
            <div className="shrink-0 text-right">
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">Tổng tiền</span>
              <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Footer actions */}
        <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800/60 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            {isCancellable && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                onClick={() => setShowCancelDialog(true)}
              >
                Hủy đơn
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Nút Theo dõi: mở trang chi tiết và timeline */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
            >
              <Link href={`/customer/orders/${order.orderId}`}>
                <Truck className="size-3.5 text-sky-500" />
                <span>Theo dõi</span>
              </Link>
            </Button>

            {/* Nút Chi tiết */}
            <Button
              asChild
              variant="default"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
            >
              <Link href={`/customer/orders/${order.orderId}`}>
                <Eye className="size-3.5" />
                <span>Chi tiết</span>
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {isCancellable && (
        <CancelOrderDialog
          orderId={order.orderId}
          orderCode={order.orderCode}
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
        />
      )}
    </>
  );
}
