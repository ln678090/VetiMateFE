import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Order, OrderStatus } from '@/types/order';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { format } from 'date-fns';
import { OrderDetailsModal } from './OrderDetailsModal';

interface OrderTableProps {
  items: Order[];
  isLoading: boolean;
}

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Chờ xác nhận', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Đang xử lý', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  SHIPPING: { label: 'Đang giao', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  DELIVERED: { label: 'Đã giao', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export function OrderTable({ items, isLoading }: OrderTableProps) {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = searchQuery.toLowerCase();
      const codeMatches = (item.code || '').toLowerCase().includes(query);
      const nameMatches = (item.customerName || '').toLowerCase().includes(query);
      const phoneMatches = (item.customerPhone || '').includes(query);

      const matchesSearch = codeMatches || nameMatches || phoneMatches;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      let matchesDate = true;
      if (startDate || endDate) {
        const orderDate = new Date(item.createdAt);
        orderDate.setHours(0, 0, 0, 0);

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (orderDate < start) matchesDate = false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(0, 0, 0, 0);
          if (orderDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [items, searchQuery, statusFilter, startDate, endDate]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (error: unknown) => {
      // Thay đổi sang unknown
      console.error(error);
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });

  const processCancelMutation = useMutation({
    mutationFn: ({ id, accept }: { id: string; accept: boolean }) =>
      orderService.processCancelRequest({ id, accept }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
      toast.success('Đã xử lý yêu cầu hủy đơn');
    },
    onError: (error: unknown) => {
      // Thay đổi sang unknown
      console.error(error);
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Có lỗi xảy ra khi xử lý yêu cầu hủy');
    },
  });
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-zinc-100 p-3 mb-4">
          <ShoppingBag className="h-6 w-6 text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">Chưa có đơn hàng nào</h3>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm">
          Khi có khách hàng đặt mua hoặc bạn tạo đơn hàng mới, nó sẽ xuất hiện ở đây.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-zinc-50/50">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Tìm mã đơn, tên KH, SĐT..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-[130px] bg-white text-sm"
            title="Từ ngày"
          />
          <span className="text-zinc-400">-</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-[130px] bg-white text-sm"
            title="Đến ngày"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as OrderStatus | 'ALL')}
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
            <SelectItem value="SHIPPING">Đang giao</SelectItem>
            <SelectItem value="DELIVERED">Đã giao</SelectItem>
            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thời gian tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                Không tìm thấy đơn hàng nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => {
              const statusConfig = STATUS_MAP[item.status] || STATUS_MAP.PENDING;
              const hasCancelRequest = item.note?.includes('[CANCEL_REQUEST]:');

              return (
                <TableRow
                  key={item.id}
                  onDoubleClick={() => setSelectedOrder(item)}
                  className="cursor-pointer group hover:bg-zinc-50"
                >
                  <TableCell className="font-medium text-blue-600 group-hover:underline">
                    {item.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.customerName && item.customerName !== 'null'
                          ? item.customerName
                          : 'Khách vãng lai'}
                      </span>
                      {item.customerPhone && item.customerPhone !== 'null' && (
                        <span className="text-xs text-zinc-500">{item.customerPhone}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      item.totalAmount
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant="outline" className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                      {hasCancelRequest && item.status !== 'CANCELLED' && (
                        <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                          Yêu cầu hủy
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm">
                    {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status !== 'DELIVERED' &&
                      item.status !== 'CANCELLED' &&
                      !hasCancelRequest && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Cập nhật trạng thái</DropdownMenuLabel>

                            {(item.status === 'PENDING' || item.status === 'CONFIRMED') && (
                              <>
                                <DropdownMenuItem
                                  onSelect={() =>
                                    updateStatusMutation.mutate({ id: item.id, status: 'SHIPPING' })
                                  }
                                >
                                  <Truck className="mr-2 h-4 w-4 text-indigo-600" />
                                  Giao hàng
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                  onSelect={() =>
                                    updateStatusMutation.mutate({
                                      id: item.id,
                                      status: 'CANCELLED',
                                    })
                                  }
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Hủy đơn
                                </DropdownMenuItem>
                              </>
                            )}

                            {item.status === 'SHIPPING' && (
                              <DropdownMenuItem
                                onSelect={() =>
                                  updateStatusMutation.mutate({ id: item.id, status: 'DELIVERED' })
                                }
                              >
                                <PackageCheck className="mr-2 h-4 w-4 text-emerald-600" />
                                Đã giao
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onProcessCancel={(orderId, accept) => processCancelMutation.mutate({ id: orderId, accept })}
      />
    </div>
  );
}
