'use client';

import { Order } from '@/types/order';
import { formatVND } from '@/lib/utils';
import { DollarSign, ShoppingBag, Clock, Ban } from 'lucide-react';

interface OrderStatisticsProps {
  orders: Order[];
}

export function OrderStatistics({ orders }: OrderStatisticsProps) {
  // Calculate statistics
  const totalOrders = orders.length;

  const revenue = orders
    .filter((order) => order.status !== 'CANCELLED')
    .reduce((sum, order) => sum + (order.finalAmount || 0), 0);

  const pendingOrders = orders.filter(
    (order) => order.status === 'PENDING' || order.status === 'CONFIRMED'
  ).length;

  const cancelledOrders = orders.filter((order) => order.status === 'CANCELLED').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Orders Card */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tổng số đơn hàng</p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{totalOrders}</h3>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Doanh thu</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatVND(revenue)}
          </h3>
        </div>
      </div>

      {/* Pending Orders Card */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Chờ xử lý</p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{pendingOrders}</h3>
        </div>
      </div>

      {/* Cancelled Orders Card */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
          <Ban className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Đơn đã hủy</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">{cancelledOrders}</h3>
        </div>
      </div>
    </div>
  );
}
