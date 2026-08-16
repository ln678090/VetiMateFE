'use client';

import { motion } from 'framer-motion';
import {
  Box,
  CheckCircle2,
  ChevronRight,
  Clock,
  Package,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';

import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatVND } from '@/lib/utils';

/* ── Types ── */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  total: number;
  shippingFee: number;
  address: string;
  paymentMethod: string;
}

/* ── Helpers ── */
export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: typeof Clock }
> = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    icon: Clock,
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    icon: CheckCircle2,
  },
  processing: {
    label: 'Đang chuẩn bị',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
    icon: Box,
  },
  shipping: {
    label: 'Đang giao hàng',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50 dark:bg-sky-500/10',
    icon: Truck,
  },
  delivered: {
    label: 'Đã giao hàng',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-500/10',
    icon: XCircle,
  },
};

const STATUS_TABS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'processing', label: 'Đang chuẩn bị' },
  { key: 'shipping', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export const TRACKING_STEPS = [
  { key: 'pending', label: 'Đơn Hàng Đã Đặt' },
  { key: 'confirmed', label: 'Đã Xác Nhận Thông Tin' },
  { key: 'processing', label: 'Đang Chuẩn Bị Hàng' },
  { key: 'shipping', label: 'Đã Giao Cho ĐVVC' },
  { key: 'delivered', label: 'Giao Hàng Thành Công' },
];

export function getStepIndex(status: OrderStatus): number {
  const map: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipping: 3,
    delivered: 4,
  };
  return map[status] ?? -1;
}



/* ── Component ── */
export default function OrderTrackingPage() {
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(0, 100),
  });

  const orders: Order[] = (orderResponse?.content || []).map((backendOrder) => ({
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
  }));

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          Theo dõi đơn hàng
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Xem trạng thái và chi tiết các đơn hàng của bạn.
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm đơn hàng theo mã đơn hoặc tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200/70 bg-white/80 pl-10 pr-4 text-sm backdrop-blur-xl transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20 dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:focus:border-rose-500"
          />
        </div>
      </motion.div>

      {/* Status tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-white/80 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Order list */}
      {isLoading ? (
        <div className="py-16 text-center text-zinc-500">Đang tải đơn hàng...</div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-zinc-200/70 bg-white/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <CardContent>
              <div className="grid place-items-center py-16 text-center">
                <Package
                  className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-700"
                  strokeWidth={1.4}
                />
                <p className="text-base font-medium text-zinc-500 dark:text-zinc-400">
                  Không tìm thấy đơn hàng nào
                </p>
                <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                  {activeTab !== 'all'
                    ? 'Thử chọn tab khác để xem thêm đơn hàng.'
                    : 'Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Stagger
          delayChildren={0.2}
          staggerChildren={0.08}
          className="space-y-4"
        >
          {filteredOrders.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
            const StatusIcon = config.icon;
            return (
              <StaggerItem key={order.id}>
                <Card className="overflow-hidden border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-rose-100/30 dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:hover:shadow-rose-500/5">
                  <Link
                    href={`/order-tracking/${order.id}`}
                    className="block cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* Order header */}
                    <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800/60">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid h-9 w-9 place-items-center rounded-lg ${config.bgColor}`}
                          >
                            <StatusIcon
                              className={`h-4 w-4 ${config.color}`}
                              strokeWidth={2.2}
                            />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">
                              {order.code}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">
                              {new Date(order.createdAt).toLocaleDateString(
                                'vi-VN',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${config.bgColor} ${config.color}`}
                          >
                            {config.label}
                          </span>
                          <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                            {formatVND(order.total)}
                          </span>
                          <ChevronRight className="h-5 w-5 text-zinc-400" />
                        </div>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-100 dark:border-zinc-800"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {item.quantity > 1 && (
                              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-600 text-[10px] font-bold text-white">
                                x{item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                        <div className="ml-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {order.items.length === 1
                            ? order.items[0].name
                            : `${order.items.length} sản phẩm`}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
