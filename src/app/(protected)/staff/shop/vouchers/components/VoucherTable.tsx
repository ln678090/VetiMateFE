import { Voucher } from '@/features/loyalty/types/loyalty.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Loader2 } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface VoucherTableProps {
  data: Voucher[];
  isLoading: boolean;
  onEdit: (voucher: Voucher) => void;
}

export function VoucherTable({ data, isLoading, onEdit }: VoucherTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã Voucher</TableHead>
            <TableHead>Mức giảm</TableHead>
            <TableHead>Hạng yêu cầu</TableHead>
            <TableHead>Điểm cần đổi</TableHead>
            <TableHead>Đã dùng / Giới hạn</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Chưa có dữ liệu.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold text-primary">
                  {item.code}
                  {(item.startDate || item.endDate) && (
                    <div className="text-xs font-normal text-muted-foreground mt-1">
                      {item.startDate && (
                        <div>
                          Từ: {format(new Date(item.startDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </div>
                      )}
                      {item.endDate && (
                        <div>
                          Đến: {format(new Date(item.endDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {item.discountType === 'FIXED'
                    ? formatVND(item.discountValue)
                    : `${item.discountValue}%`}
                  {item.maxDiscount != null && item.maxDiscount > 0 && (
                    <span className="block text-xs text-muted-foreground">
                      Tối đa {formatVND(item.maxDiscount)}
                    </span>
                  )}
                  {item.minOrderAmount != null && item.minOrderAmount > 0 && (
                    <span className="block text-xs text-muted-foreground">
                      Đơn từ {formatVND(item.minOrderAmount)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {item.requiredTier ? (
                    <Badge variant="outline" className="border-amber-500 text-amber-600">
                      {item.requiredTier === 'DIAMOND'
                        ? 'Kim Cương'
                        : item.requiredTier === 'GOLD'
                          ? 'Vàng'
                          : item.requiredTier === 'SILVER'
                            ? 'Bạc'
                            : item.requiredTier === 'BRONZE'
                              ? 'Đồng'
                              : 'Tiêu chuẩn'}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Tất cả</span>
                  )}
                </TableCell>
                <TableCell>{item.pointsRequired}</TableCell>
                <TableCell>
                  {item.usedCount} / {item.usageLimit || '∞'}
                </TableCell>
                <TableCell>
                  {item.isActive ? (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      Hoạt động
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Đã tắt</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
