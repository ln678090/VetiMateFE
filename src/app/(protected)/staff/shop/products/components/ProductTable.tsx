import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product } from '@/features/shop/types/product.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/features/shop/api/product.api';
import { toast } from 'sonner';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, isLoading, onEdit }: ProductTableProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      deleteMutation.mutate(id);
    }
  };

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
        Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ảnh</TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Giá</TableHead>
          <TableHead>Tồn kho</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.imageUrl ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-zinc-200">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 text-xs text-zinc-500">
                  No img
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium max-w-[200px] truncate" title={product.name}>
              {product.name}
            </TableCell>
            <TableCell className="text-zinc-500 text-xs">{product.sku}</TableCell>
            <TableCell>
              <Badge variant="outline" className="font-normal">{product.categoryName}</Badge>
            </TableCell>
            <TableCell className="font-medium text-emerald-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </TableCell>
            <TableCell>
              {product.stockQuantity > 10 ? (
                <span className="text-emerald-600 font-medium">{product.stockQuantity}</span>
              ) : product.stockQuantity > 0 ? (
                <span className="text-amber-500 font-medium">{product.stockQuantity}</span>
              ) : (
                <span className="text-rose-500 font-medium">Hết hàng</span>
              )}
            </TableCell>
            <TableCell>
              {product.isActive ? (
                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Đang bán</Badge>
              ) : (
                <Badge variant="secondary">Ngừng bán</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => onEdit(product)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
