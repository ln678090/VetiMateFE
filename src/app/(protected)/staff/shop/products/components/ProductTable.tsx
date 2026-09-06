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
import { useState, useMemo } from 'react';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductStatistics } from './ProductStatistics';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, isLoading, onEdit }: ProductTableProps) {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' ? product.isActive : !product.isActive);

      const matchesStock =
        stockFilter === 'ALL' ||
        (stockFilter === 'OUT_OF_STOCK' ? product.stockQuantity === 0 : false) ||
        (stockFilter === 'LOW_STOCK'
          ? product.stockQuantity > 0 && product.stockQuantity <= 10
          : false) ||
        (stockFilter === 'IN_STOCK' ? product.stockQuantity > 10 : false);

      return matchesSearch && matchesStatus && matchesStock;
    });
  }, [products, searchQuery, statusFilter, stockFilter]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },

    onError: (error: unknown) => {
      // Sửa thành unknown
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm');
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
    <div className="flex flex-col space-y-4">
      <ProductStatistics products={filteredProducts} />

      <div className="flex flex-col bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Tìm tên, SKU..."
              className="pl-9 bg-white dark:bg-zinc-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-zinc-900">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Đang bán</SelectItem>
              <SelectItem value="INACTIVE">Ngừng bán</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-zinc-900">
              <SelectValue placeholder="Tồn kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả tồn kho</SelectItem>
              <SelectItem value="IN_STOCK">Còn hàng ({'>'}10)</SelectItem>
              <SelectItem value="LOW_STOCK">Sắp hết hàng (1-10)</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Hết hàng (0)</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-zinc-500">
                  Không tìm thấy sản phẩm nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  onClick={() => setSelectedProduct(product)}
                >
                  <TableCell>
                    {product.imageUrl ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-zinc-200">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
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
                    <Badge variant="outline" className="font-normal">
                      {product.categoryName}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-emerald-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      product.price
                    )}
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
                      <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                        Đang bán
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Ngừng bán</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(product);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
