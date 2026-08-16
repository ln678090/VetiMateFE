'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Store, Tags } from 'lucide-react';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { staffService } from '@/services/staff.service';
import Link from 'next/link';

export default function StaffDashboardPage() {
  // Fetch aggregate data for stats
  const { data: productsData } = useQuery({
    queryKey: ['staff', 'products', 0, ''],
    queryFn: () => staffService.getProducts(0, 5),
  });

  const { data: ordersData } = useQuery({
    queryKey: ['staff', 'orders', 0, ''],
    queryFn: () => staffService.getOrders(0, 5),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: () => staffService.getCategories(),
  });

  // Calculate stats based on fetched list totals
  const totalProducts = productsData?.total ?? 0;
  const totalOrders = ordersData?.totalElements ?? 0;
  const totalCategories = categoriesData?.length ?? 0;
  
  // Calculate mock revenue from recent orders just for display
  const totalRevenue = (ordersData?.content ?? []).reduce((acc, order) => acc + (order.totalAmount || 0), 0);

  const stats = [
    { label: 'Sản phẩm', value: totalProducts.toString(), icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Đơn hàng', value: totalOrders.toString(), icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Danh mục', value: totalCategories.toString(), icon: Tags, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { 
      label: 'Doanh thu (5 đơn gần nhất)', 
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue), 
      icon: Store, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10' 
    },
  ];

  const recentOrders = ordersData?.content ?? [];
  
  // Simulate low stock by sorting or just displaying a few items
  const lowStockProducts = (productsData?.items ?? [])
    .filter(p => p.stockQuantity < 20)
    .sort((a, b) => a.stockQuantity - b.stockQuantity)
    .slice(0, 5);

  return (
    <AuthGuard requireRoles={['ROLE_SHOP_STAFF', 'ROLE_MANAGER']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard Cửa Hàng</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Đơn hàng gần đây</h2>
              <Link href="/staff/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Xem tất cả</Link>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800/60">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{order.orderCode}</p>
                      <p className="text-sm text-zinc-500">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                      </p>
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-400">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Low Stock */}
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Sản phẩm sắp hết hàng</h2>
              <Link href="/staff/inventory" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Đến Kho</Link>
            </div>
            
            {lowStockProducts.length === 0 ? (
              <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500">Tất cả sản phẩm đều đủ kho</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800/60">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.imageUrl || '/placeholder.png'} 
                        alt={product.name} 
                        className="h-10 w-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                      />
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white line-clamp-1">{product.name}</p>
                        <p className="text-sm text-zinc-500">{product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                        Còn {product.stockQuantity} SP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
