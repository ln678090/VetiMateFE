import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/features/shop/types/product.types';

interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
}

export function InventoryTable({ products, isLoading }: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center p-4 text-sm text-zinc-500">
        Chưa có sản phẩm nào trong cửa hàng.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Thương hiệu</TableHead>
            <TableHead className="text-right">Tồn kho hiện tại</TableHead>
            <TableHead className="text-right">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => {
            const isOutOfStock = p.stockQuantity <= 0;
            const isLowStock = p.stockQuantity > 0 && p.stockQuantity <= 5; // Ngưỡng sắp hết hàng là 5
            
            return (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {p.name}
                </TableCell>
                <TableCell>{p.categoryName}</TableCell>
                <TableCell>{p.brandName}</TableCell>
                <TableCell className={`text-right font-medium ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {p.stockQuantity}
                </TableCell>
                <TableCell className="text-right">
                  {isOutOfStock ? (
                    <Badge variant="destructive">Hết hàng</Badge>
                  ) : isLowStock ? (
                    <Badge variant="outline" className="border-amber-500 text-amber-600">Sắp hết</Badge>
                  ) : (
                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Còn hàng</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
