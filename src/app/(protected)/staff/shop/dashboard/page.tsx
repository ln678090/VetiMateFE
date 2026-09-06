'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { orderService } from '@/services/order.service';
import { productApi } from '@/features/shop/api/product.api';
import { DashboardCards } from './components/DashboardCards';
import { RecentOrders } from './components/RecentOrders';
import { DashboardChart } from './components/DashboardChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import dayjs from 'dayjs';

export default function ShopDashboardPage() {
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['shop-orders'],
    queryFn: orderService.getAllShopOrders,
  });

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', 'newest'],
    queryFn: () => productApi.getProducts({ sort: 'newest' }),
  });

  const products = productsData?.data?.items || [];
  const isLoading = isLoadingOrders || isLoadingProducts;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    const today = dayjs();
    switch (value) {
      case 'today':
        setStartDate(today.format('YYYY-MM-DD'));
        setEndDate(today.format('YYYY-MM-DD'));
        break;
      case 'yesterday':
        setStartDate(today.subtract(1, 'day').format('YYYY-MM-DD'));
        setEndDate(today.subtract(1, 'day').format('YYYY-MM-DD'));
        break;
      case 'this_week':
        setStartDate(today.startOf('week').format('YYYY-MM-DD'));
        setEndDate(today.format('YYYY-MM-DD'));
        break;
      case 'this_month':
        setStartDate(today.startOf('month').format('YYYY-MM-DD'));
        setEndDate(today.format('YYYY-MM-DD'));
        break;
      case 'this_year':
        setStartDate(today.startOf('year').format('YYYY-MM-DD'));
        setEndDate(today.format('YYYY-MM-DD'));
        break;
      case 'all':
        setStartDate('');
        setEndDate('');
        break;
    }
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange('custom');
    if (type === 'start') setStartDate(value);
    else setEndDate(value);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      let matchesDate = true;
      if (startDate || endDate) {
        // order.createdAt format is "2026-09-06T23:37:02"
        // Convert both order date and filter dates to local time strings for comparison, or timestamps.
        const orderDateStr = order.createdAt.split('T')[0];
        if (startDate && orderDateStr < startDate) {
          matchesDate = false;
        }
        if (endDate && orderDateStr > endDate) {
          matchesDate = false;
        }
      }
      return matchesDate;
    });
  }, [orders, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Báo cáo thống kê
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Tổng quan về hoạt động của cửa hàng
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Báo cáo thống kê
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Tổng quan về hoạt động của cửa hàng
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[220px] bg-white dark:bg-zinc-950">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="yesterday">Hôm qua</SelectItem>
              <SelectItem value="this_week">Tuần này</SelectItem>
              <SelectItem value="this_month">Tháng này</SelectItem>
              <SelectItem value="this_year">Năm nay</SelectItem>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
              <SelectItem value="custom">Tùy chỉnh khoảng ngày</SelectItem>
            </SelectContent>
          </Select>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in zoom-in duration-200">
              <Calendar className="w-4 h-4 text-zinc-500 ml-2" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="w-[140px] h-8 text-sm bg-transparent border-0 focus-visible:ring-0 shadow-none"
                title="Từ ngày"
              />
              <span className="text-zinc-400">-</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="w-[140px] h-8 text-sm bg-transparent border-0 focus-visible:ring-0 shadow-none"
                title="Đến ngày"
              />
            </div>
          )}
        </div>
      </header>

      <DashboardCards orders={filteredOrders} products={products} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart orders={filteredOrders} />
        <RecentOrders orders={filteredOrders} />
      </div>
    </div>
  );
}
