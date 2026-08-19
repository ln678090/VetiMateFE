'use client';

import { useQuery } from '@tanstack/react-query';
import { Search, Eye } from 'lucide-react';
import { useState } from 'react';

import { AuthGuard } from '@/components/shared/AuthGuard';
import { staffService } from '@/services/staff.service';
import { OrderStatus, ShopOrderResp } from '@/types/staff';
import { OrderDetailsModal } from './components/OrderDetailsModal';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Chờ xử lý', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10' },
  PREPARING: { label: 'Đang chuẩn bị', color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/10' },
  SHIPPING: { label: 'Đang giao hàng', color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-500/10' },
  COMPLETED: { label: 'Đã hoàn thành', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
  CANCELLED: { label: 'Đã hủy', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/10' },
};

export default function StaffOrdersPage() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<ShopOrderResp | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['staff', 'orders', page, statusFilter],
    queryFn: () => staffService.getOrders(page, 20, statusFilter),
  });

  return (
    <AuthGuard requireRoles={['ROLE_SHOP_STAFF', 'ROLE_MANAGER']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Quản lý Đơn hàng</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Theo dõi và cập nhật trạng thái đơn hàng trực tuyến.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm mã đơn hàng, SĐT..."
              className="w-full rounded-xl border-none bg-zinc-100/50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 transition-colors focus:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
            />
          </div>
          <select 
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusConfig).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/50 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Mã ĐH</th>
                  <th className="px-6 py-4 font-medium">Khách hàng</th>
                  <th className="px-6 py-4 font-medium">Ngày đặt</th>
                  <th className="px-6 py-4 font-medium">Tổng tiền</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : data?.items?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      Không tìm thấy đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  data?.items?.map((order) => {
                    const status = statusConfig[order.status];
                    return (
                      <tr key={order.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                          #{order.orderCode}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                              {order.recipientName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-white">{order.recipientName}</p>
                              <p className="text-zinc-500 dark:text-zinc-400">{order.recipientPhone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status?.bg} ${status?.color}`}>
                              {status?.label || order.status}
                            </span>
                            {order.cancellationRequested && (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                                Yêu cầu hủy
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            Xem
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <OrderDetailsModal
        order={data?.items?.find((o) => o.id === selectedOrder?.id) || selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        statusConfig={statusConfig}
      />
    </AuthGuard>
  );
}
