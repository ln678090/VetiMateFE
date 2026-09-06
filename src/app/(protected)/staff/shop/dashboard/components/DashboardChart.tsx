'use client';

import { useMemo } from 'react';
import { Order } from '@/types/order';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatVND } from '@/lib/utils';
import dayjs from 'dayjs';

interface DashboardChartProps {
  orders: Order[];
}

export function DashboardChart({ orders }: DashboardChartProps) {
  const chartData = useMemo(() => {
    // Group orders by date (last 7 days by default if no filter, or based on the filtered orders)
    const groupedData = new Map<string, number>();

    // Sort orders by date to find the range, or just use the orders' dates
    const validOrders = orders.filter((o) => o.status !== 'CANCELLED');

    if (validOrders.length === 0) {
      // Return 7 days of empty data
      for (let i = 6; i >= 0; i--) {
        const dateStr = dayjs().subtract(i, 'day').format('DD/MM');
        groupedData.set(dateStr, 0);
      }
    } else {
      // Find min and max date from orders to create a contiguous range
      const dates = validOrders.map((o) => dayjs(o.createdAt).startOf('day').valueOf());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);

      // If range is > 30 days, maybe group by month. But let's stick to days for now up to 30 days.
      let current = dayjs(minDate);
      const end = dayjs(maxDate);

      // Cap at 30 days to avoid huge charts
      if (end.diff(current, 'day') > 30) {
        current = end.subtract(30, 'day');
      }

      while (current.isBefore(end) || current.isSame(end, 'day')) {
        groupedData.set(current.format('DD/MM'), 0);
        current = current.add(1, 'day');
      }

      // Fill in actual data
      validOrders.forEach((order) => {
        const dateStr = dayjs(order.createdAt).format('DD/MM');
        if (groupedData.has(dateStr)) {
          groupedData.set(dateStr, (groupedData.get(dateStr) || 0) + (order.finalAmount || 0));
        }
      });
    }

    return Array.from(groupedData.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }, [orders]);

  if (chartData.length === 0) return null;

  return (
    <Card className="shadow-lg border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Biểu đồ Doanh thu
        </CardTitle>
        <CardDescription>Doanh thu theo ngày của các đơn hàng thành công</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value === 0) return '0đ';
                  return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${value / 1000}k`;
                }}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dx={-10}
              />
              <Tooltip
                formatter={(value: any) => [formatVND(Number(value) || 0), 'Doanh thu']}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
