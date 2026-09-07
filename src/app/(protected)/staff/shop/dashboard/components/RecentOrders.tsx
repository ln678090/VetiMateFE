'use client';

import { Order, OrderStatus } from '@/types/order';
import { formatVND } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface RecentOrdersProps {
  orders: Order[];
}

const STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: '#d97706' },
  CONFIRMED: { label: 'Đã xác nhận', color: '#2563eb' },
  SHIPPING: { label: 'Đang giao', color: '#4f46e5' },
  DELIVERED: { label: 'Đã giao', color: '#16a34a' },
  CANCELLED: { label: 'Đã hủy', color: '#e11d48' },
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  // Get latest 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card className="shadow-lg border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-lg font-bold">Đơn hàng mới nhất</CardTitle>
        <Link href="/staff/shop/orders" className="text-sm text-blue-600 hover:underline">
          Xem tất cả
        </Link>
      </CardHeader>
      <CardContent>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-zinc-100 p-3 mb-2">
              <ShoppingBag className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-500">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead className="text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const statusConfig = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-blue-600">{order.code}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {order.customerName && order.customerName !== 'null'
                              ? order.customerName
                              : 'Khách vãng lai'}
                          </span>
                          {order.customerPhone && order.customerPhone !== 'null' && (
                            <span className="text-xs text-zinc-500">{order.customerPhone}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600">
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatVND(order.finalAmount || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className="font-medium"
                          style={{
                            backgroundColor: `${statusConfig.color}15`,
                            color: statusConfig.color,
                            borderColor: `${statusConfig.color}30`,
                          }}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
