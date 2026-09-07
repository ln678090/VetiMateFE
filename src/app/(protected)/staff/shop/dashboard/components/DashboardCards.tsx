'use client';

import { Order } from '@/types/order';
import { Product } from '@/features/shop/types/product.types';
import { formatVND } from '@/lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  PackageOpen,
  AlertTriangle,
  ListOrdered,
  Tag,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardCardsProps {
  orders: Order[];
  products: Product[];
}

export function DashboardCards({ orders, products }: DashboardCardsProps) {
  // Order stats
  const totalOrders = orders.length;
  const revenue = orders
    .filter((order) => order.status !== 'CANCELLED')
    .reduce((sum, order) => sum + (order.finalAmount || 0), 0);
  const pendingOrders = orders.filter(
    (order) => order.status === 'PENDING' || order.status === 'CONFIRMED'
  ).length;

  const productsSold = orders
    .filter((order) => order.status !== 'CANCELLED')
    .reduce(
      (sum, order) =>
        sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0),
      0
    );

  // Product stats
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= 10
  ).length;
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
      {/* Revenue */}
      <Card className="col-span-1 md:col-span-2 shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <DollarSign className="w-32 h-32" />
        </div>
        <CardContent className="p-6 flex flex-col justify-center h-full relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-emerald-50">Tổng doanh thu</p>
          </div>
          <h3 className="text-4xl font-bold tracking-tight">{formatVND(revenue)}</h3>
        </CardContent>
      </Card>

      {/* Orders Summary */}
      <Card className="col-span-1 shadow-lg border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-zinc-500">Đơn hàng</p>
          </div>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{totalOrders}</h3>
          <div className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md inline-flex">
            <Clock className="w-3 h-3 mr-1" /> {pendingOrders} chờ xử lý
          </div>
        </CardContent>
      </Card>

      {/* Products Sold Summary */}
      <Card className="col-span-1 shadow-lg border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Tag className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-zinc-500">Sản phẩm bán ra</p>
          </div>
          <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            {productsSold}
          </h3>
          <p className="text-xs text-zinc-500 mt-2">tổng số lượng</p>
        </CardContent>
      </Card>

      {/* Products Summary */}
      <Card className="col-span-1 md:col-span-2 xl:col-span-3 shadow-lg border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl flex flex-col justify-center">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <PackageOpen className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-medium text-zinc-500">Tổng sản phẩm</p>
              </div>
              <h3 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">
                {totalProducts}
              </h3>
            </div>
            <div className="flex flex-col border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <p className="text-sm font-medium text-zinc-500">Sắp hết {'(<10)'}</p>
              </div>
              <h3 className="text-3xl font-bold mb-2 text-amber-600">{lowStockProducts}</h3>
            </div>
            <div className="flex flex-col border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <ListOrdered className="w-5 h-5 text-rose-500" />
                <p className="text-sm font-medium text-zinc-500">Hết hàng (0)</p>
              </div>
              <h3 className="text-3xl font-bold mb-2 text-rose-600">{outOfStockProducts}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
