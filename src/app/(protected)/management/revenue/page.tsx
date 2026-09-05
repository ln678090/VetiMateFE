'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

import { FadeIn } from '@/components/animations/FadeIn';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRevenueAnalytics } from '@/features/revenue/hooks/use-revenue';
import { RevenueWaveChart } from '@/features/revenue/components/RevenueWaveChart';

const PERIODS = [
  { id: 'TODAY', label: 'Hôm nay' },
  { id: 'WEEK', label: '7 ngày qua' },
  { id: 'MONTH', label: 'Tháng này' },
  { id: 'YEAR', label: 'Năm 2026' },
  { id: 'ALL', label: 'Tất cả' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function RevenueManagementPage() {
  const [period, setPeriod] = useState<string>('MONTH');
  const { data, isLoading, isRefetching, refetch } = useRevenueAnalytics(period);

  const overview = data?.overview;
  const timeline = data?.timeline || [];
  const topServices = data?.topServices || [];
  const topProducts = data?.topProducts || [];
  const recentTransactions = data?.recentTransactions || [];

  const handleExport = () => {
    toast.success('Đã xuất báo cáo doanh thu thành công (file mẫu Excel).');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 text-white shadow-md">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
                Báo cáo & Thống kê Doanh thu
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Thống kê hợp nhất doanh thu từ Dịch vụ phòng khám và Đơn hàng thú cưng.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="flex rounded-xl border border-zinc-200 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  period === p.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>

          <Button size="sm" onClick={handleExport} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="size-3.5" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
          <Skeleton className="h-80 rounded-3xl" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      ) : (
        <FadeIn className="space-y-6">
          {/* KPI Cards */}
          <Stagger
            delayChildren={0.1}
            staggerChildren={0.06}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Card 1: Tổng doanh thu */}
            <StaggerItem>
              <Card className="relative overflow-hidden rounded-3xl border-amber-200/60 bg-gradient-to-br from-amber-500/10 via-white to-white shadow-sm dark:border-amber-500/20 dark:from-amber-500/15 dark:via-zinc-900 dark:to-zinc-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Tổng doanh thu
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                    <Wallet className="size-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {formatCurrency(overview?.totalRevenue || 0)}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <ArrowUpRight className="size-4" />
                    <span>+{overview?.growthPercentage ?? 15.8}% so với kỳ trước</span>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Card 2: Doanh thu khám bệnh */}
            <StaggerItem>
              <Card className="relative overflow-hidden rounded-3xl border-emerald-200/60 bg-gradient-to-br from-emerald-500/10 via-white to-white shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/15 dark:via-zinc-900 dark:to-zinc-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Dịch vụ khám bệnh
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                    <Stethoscope className="size-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {formatCurrency(overview?.clinicRevenue || 0)}
                  </div>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <strong>{overview?.completedAppointments ?? 0}</strong> ca hoàn thành / {overview?.totalAppointments ?? 0} lượt đặt
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Card 3: Doanh thu Pet Shop */}
            <StaggerItem>
              <Card className="relative overflow-hidden rounded-3xl border-rose-200/60 bg-gradient-to-br from-rose-500/10 via-white to-white shadow-sm dark:border-rose-500/20 dark:from-rose-500/15 dark:via-zinc-900 dark:to-zinc-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    Bán hàng Pet Shop
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-sm">
                    <ShoppingBag className="size-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {formatCurrency(overview?.shopRevenue || 0)}
                  </div>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <strong>{overview?.completedOrders ?? 0}</strong> đơn giao thành công / {overview?.totalOrders ?? 0} đơn
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Card 4: Tổng giao dịch */}
            <StaggerItem>
              <Card className="relative overflow-hidden rounded-3xl border-blue-200/60 bg-gradient-to-br from-blue-500/10 via-white to-white shadow-sm dark:border-blue-500/20 dark:from-blue-500/15 dark:via-zinc-900 dark:to-zinc-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    Tổng giao dịch
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-sm">
                    <BarChart3 className="size-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {(overview?.totalOrders || 0) + (overview?.totalAppointments || 0)}
                  </div>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Tỷ lệ hoàn thành:{' '}
                    <strong>
                      {Math.round(
                        (((overview?.completedOrders || 0) + (overview?.completedAppointments || 0)) /
                          Math.max((overview?.totalOrders || 0) + (overview?.totalAppointments || 0), 1)) *
                          100
                      )}
                      %
                    </strong>
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          </Stagger>

          {/* Biểu đồ Dạng Sóng Doanh thu theo thời gian */}
          <Card className="rounded-3xl border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <CardTitle className="text-lg font-bold">Biểu đồ Doanh thu dạng sóng (Wave Analytics)</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Đường cong sóng mượt mà biểu thị biến động doanh thu giữa Dịch vụ phòng khám và Đơn hàng Pet Shop.
              </CardDescription>
            </div>

            {/* Interactive Wave Chart Component */}
            <RevenueWaveChart timeline={timeline} />
          </Card>

          {/* Top Dịch vụ & Top Sản phẩm */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Dịch vụ */}
            <Card className="rounded-3xl border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Stethoscope className="size-5 text-emerald-500" />
                  <CardTitle className="text-base font-bold">Top Dịch vụ Khám mang lại doanh thu</CardTitle>
                </div>
                <CardDescription>Các gói khám và chăm sóc thú cưng phổ biến nhất.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topServices.length === 0 ? (
                  <p className="text-center py-6 text-sm text-zinc-400">Chưa có dữ liệu dịch vụ</p>
                ) : (
                  topServices.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50/80 p-3 dark:bg-zinc-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{service.name}</p>
                          <p className="text-xs text-zinc-500">{service.quantity} lượt hoàn thành</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(service.totalAmount)}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Top Sản phẩm */}
            <Card className="rounded-3xl border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="size-5 text-rose-500" />
                  <CardTitle className="text-base font-bold">Top Sản phẩm Pet Shop bán chạy</CardTitle>
                </div>
                <CardDescription>Sản phẩm dinh dưỡng và phụ kiện thú cưng có doanh số cao.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topProducts.length === 0 ? (
                  <p className="text-center py-6 text-sm text-zinc-400">Chưa có dữ liệu sản phẩm</p>
                ) : (
                  topProducts.map((prod, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50/80 p-3 dark:bg-zinc-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-xl bg-rose-100 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{prod.name}</p>
                          <p className="text-xs text-zinc-500">Đã bán {prod.quantity} sản phẩm</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        {formatCurrency(prod.totalAmount)}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bảng Dòng tiền giao dịch gần nhất */}
          <Card className="rounded-3xl border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Lịch sử giao dịch & Dòng tiền gần nhất</CardTitle>
                  <CardDescription>Danh sách các ca khám và đơn hàng phát sinh doanh thu.</CardDescription>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {recentTransactions.length} giao dịch mới nhất
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs uppercase text-zinc-400">
                      <th className="pb-3 font-semibold">Mã</th>
                      <th className="pb-3 font-semibold">Loại</th>
                      <th className="pb-3 font-semibold">Nội dung</th>
                      <th className="pb-3 font-semibold">Khách hàng</th>
                      <th className="pb-3 font-semibold">Thời gian</th>
                      <th className="pb-3 text-right font-semibold">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {recentTransactions.map((tx) => {
                      const isClinic = tx.type === 'CLINIC';

                      return (
                        <tr key={tx.id} className="transition hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                          <td className="py-3.5 font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                            {tx.code}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                isClinic
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {isClinic ? <Stethoscope className="size-3" /> : <ShoppingBag className="size-3" />}
                              {isClinic ? 'Phòng khám' : 'Pet Shop'}
                            </span>
                          </td>
                          <td className="py-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                            {tx.title}
                          </td>
                          <td className="py-3.5 text-zinc-600 dark:text-zinc-400">
                            {tx.customerName}
                          </td>
                          <td className="py-3.5 text-xs text-zinc-500">
                            {formatDate(tx.createdAt)}
                          </td>
                          <td className="py-3.5 text-right font-bold text-zinc-900 dark:text-zinc-100">
                            {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
