'use client';

import { useState } from 'react';
import { Package, Calendar, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatVND } from '@/lib/utils';
import Link from 'next/link';

type OrderStatus = 'all' | 'pending' | 'shipping' | 'completed' | 'cancelled';
type TimeFilter = 'all' | '7days' | '30days' | '3months';

const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    date: '2023-11-20T10:30:00Z',
    status: 'completed',
    total: 850000,
    items: [
      { name: 'Hạt Royal Canin cho chó trưởng thành 2kg', qty: 2, price: 425000 }
    ]
  },
  {
    id: 'ORD-002',
    date: '2023-11-25T14:15:00Z',
    status: 'shipping',
    total: 350000,
    items: [
      { name: 'Cát vệ sinh cho mèo 5L', qty: 1, price: 150000 },
      { name: 'Pate Whiskas vị cá ngừ', qty: 10, price: 20000 }
    ]
  },
  {
    id: 'ORD-003',
    date: '2023-11-28T09:00:00Z',
    status: 'pending',
    total: 1200000,
    items: [
      { name: 'Chuồng cho chó lớn', qty: 1, price: 1200000 }
    ]
  },
  {
    id: 'ORD-004',
    date: '2023-10-15T16:45:00Z',
    status: 'cancelled',
    total: 250000,
    items: [
      { name: 'Đồ chơi gặm cho chó', qty: 2, price: 125000 }
    ]
  }
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending': return <Clock className="size-4 text-amber-500" />;
    case 'shipping': return <Truck className="size-4 text-blue-500" />;
    case 'completed': return <CheckCircle2 className="size-4 text-emerald-500" />;
    case 'cancelled': return <XCircle className="size-4 text-rose-500" />;
    default: return <Package className="size-4" />;
  }
};

const StatusLabel = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending': return <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-semibold">Chờ xử lý</span>;
    case 'shipping': return <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-semibold">Đang giao</span>;
    case 'completed': return <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-semibold">Đã giao</span>;
    case 'cancelled': return <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded-md text-xs font-semibold">Đã hủy</span>;
    default: return <span>{status}</span>;
  }
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Lọc dữ liệu Mock
  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    
    const orderDate = new Date(order.date);
    const now = new Date();
    if (timeFilter === '7days' && (now.getTime() - orderDate.getTime()) > 7 * 24 * 60 * 60 * 1000) return false;
    if (timeFilter === '30days' && (now.getTime() - orderDate.getTime()) > 30 * 24 * 60 * 60 * 1000) return false;
    if (timeFilter === '3months' && (now.getTime() - orderDate.getTime()) > 90 * 24 * 60 * 60 * 1000) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý các đơn đặt hàng của bạn</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-2xl border">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v: OrderStatus) => setStatusFilter(v)}>
            <SelectTrigger className="w-[160px] rounded-xl bg-white">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="shipping">Đang giao</SelectItem>
              <SelectItem value="completed">Đã giao</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <Select value={timeFilter} onValueChange={(v: TimeFilter) => setTimeFilter(v)}>
            <SelectTrigger className="w-[160px] rounded-xl bg-white">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả thời gian</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="3months">3 tháng qua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="font-mono font-semibold text-indigo-600">{order.id}</div>
                  <StatusLabel status={order.status} />
                </div>
                
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-zinc-700">{item.qty} x {item.name}</span>
                      <span className="font-medium text-zinc-900">{formatVND(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2 text-sm">
                  <span className="text-muted-foreground">{new Date(order.date).toLocaleDateString('vi-VN')}</span>
                  <div className="font-bold text-lg text-rose-600">
                    Tổng: {formatVND(order.total)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
           <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 rounded-3xl border border-dashed backdrop-blur-sm">
             <Package className="size-12 text-indigo-300 mb-4" />
             <p className="text-muted-foreground font-medium">Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</p>
           </div>
        )}
      </div>
      
      <div className="pt-4">
        <Button variant="outline" className="rounded-xl" asChild>
          <Link href="/profile">← Quay lại Hồ sơ</Link>
        </Button>
      </div>
    </div>
  );
}
