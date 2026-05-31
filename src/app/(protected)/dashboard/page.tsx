'use client';

import { motion } from 'framer-motion';
import { CalendarHeart, PawPrint, ShoppingBag, Stethoscope, TrendingUp } from 'lucide-react';

import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth.store';

const STATS = [
  {
    label: 'Lịch chăm sóc',
    value: '3',
    sub: 'Tuần này',
    icon: CalendarHeart,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    label: 'Khám thú y',
    value: '1',
    sub: 'Sắp tới',
    icon: Stethoscope,
    gradient: 'from-sky-500 to-indigo-500',
  },
  {
    label: 'Đơn hàng',
    value: '12',
    sub: 'Tháng này',
    icon: ShoppingBag,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    label: 'Thú cưng',
    value: '2',
    sub: 'Đang chăm',
    icon: PawPrint,
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const greeting = user?.fullName || user?.username || 'bạn';

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          Chào mừng trở lại, {greeting}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Đây là tổng quan các hoạt động chăm sóc thú cưng của bạn.
        </p>
      </motion.div>

      {/* Stats grid */}
      <Stagger
        delayChildren={0.15}
        staggerChildren={0.08}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.label}>
              <Card className="relative overflow-hidden border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-rose-100/50 dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:hover:shadow-rose-500/5">
                <div
                  className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {stat.label}
                  </CardTitle>
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-md`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {stat.value}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-500">
                    <TrendingUp className="h-3 w-3" strokeWidth={2.4} />
                    {stat.sub}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* Quick actions placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border-zinc-200/70 bg-white/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid place-items-center py-12 text-center">
              <PawPrint
                className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-700"
                strokeWidth={1.6}
              />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Chưa có hoạt động nào. Đặt lịch đầu tiên để bắt đầu nhé.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
