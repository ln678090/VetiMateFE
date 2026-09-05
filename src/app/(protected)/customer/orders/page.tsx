'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderCard } from '@/features/order/components/OrderCard';
import { useMyOrders } from '@/features/order/hooks/use-orders';
import type { OrderStatus } from '@/types/order';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ORDER_TABS: { value: 'ALL' | OrderStatus; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'PREPARING', label: 'Đang chuẩn bị' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function CustomerOrdersPage() {
  const [selectedTab, setSelectedTab] = useState<'ALL' | OrderStatus>('ALL');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const currentStatus = selectedTab === 'ALL' ? undefined : selectedTab;

  const { data, isLoading, isError, refetch } = useMyOrders({
    status: currentStatus,
    page,
    size: pageSize,
  });

  const orders = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const handleTabChange = (value: string) => {
    setSelectedTab(value as 'ALL' | OrderStatus);
    setPage(0); // Reset về trang 1 khi đổi tab
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Đơn hàng của tôi
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Theo dõi hành trình vận chuyển và lịch sử đơn hàng của bạn tại VetiMate
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="self-start gap-1.5 sm:self-auto">
          <Link href="/shop">
            <ShoppingBag className="size-4 text-emerald-600" />
            <span>Tiếp tục mua sắm</span>
          </Link>
        </Button>
      </div>

      {/* Tabs Filter */}
      <div className="w-full overflow-x-auto pb-1">
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex h-11 w-max min-w-full justify-start gap-1 rounded-xl bg-zinc-100/80 p-1 dark:bg-zinc-800/60">
            {ORDER_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg px-4 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-zinc-100"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Order List / States */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <AlertCircle className="size-10 text-rose-500" />
          <h3 className="mt-3 text-base font-semibold text-rose-700 dark:text-rose-400">
            Không thể tải danh sách đơn hàng
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
            Thử lại
          </Button>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Package className="size-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {selectedTab === 'ALL'
              ? 'Bạn chưa có đơn hàng nào'
              : `Không có đơn hàng nào ở trạng thái "${ORDER_TABS.find((t) => t.value === selectedTab)?.label}"`}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Khám phá ngay các sản phẩm dinh dưỡng, phụ kiện và đồ chơi chất lượng cao cho thú cưng của bạn.
          </p>
          <Button asChild className="mt-5 gap-2" size="sm">
            <Link href="/shop">
              <ShoppingBag className="size-4" />
              <span>Khám phá Cửa hàng</span>
            </Link>
          </Button>
        </div>
      ) : (
        /* Order Cards */
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200/80 pt-4 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Hiển thị {orders.length} / {totalElements} đơn hàng (Trang {page + 1} / {totalPages})
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  className="size-8 p-0"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="size-8 p-0"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
