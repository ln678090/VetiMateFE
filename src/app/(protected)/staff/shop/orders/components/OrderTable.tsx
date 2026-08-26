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
import { ShoppingBag, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderItem {
  id: string;
  orderCode: string;
  customerName: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface OrderTableProps {
  items: OrderItem[];
  isLoading: boolean;
}

export function OrderTable({ items, isLoading }: OrderTableProps) {
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
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium text-blue-600 cursor-pointer">{item.orderCode}</TableCell>
            <TableCell>{item.customerName}</TableCell>
            <TableCell className="font-medium">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}
            </TableCell>
            <TableCell>
              {item.status === 'completed' ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Hoàn thành</Badge>
              ) : item.status === 'pending' ? (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Đang chờ</Badge>
              ) : (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Đã hủy</Badge>
              )}
            </TableCell>
            <TableCell className="text-zinc-500 text-sm">{item.createdAt}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500">
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
