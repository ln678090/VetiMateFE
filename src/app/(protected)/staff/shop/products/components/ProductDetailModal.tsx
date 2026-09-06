import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { batchApi } from '@/features/inventory/api/inventory.api';
import { Product } from '@/features/shop/types/product.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { data: batchesData, isLoading } = useQuery({
    queryKey: ['product-batches', product?.id],
    queryFn: () => batchApi.getByProduct(product!.id),
    enabled: !!product?.id && isOpen,
  });

  const batches = Array.isArray(batchesData?.data?.data)
    ? batchesData.data.data
    : Array.isArray(batchesData?.data)
      ? batchesData.data
      : [];

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông tin sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="col-span-1">
            <div className="relative w-full aspect-square rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 flex items-center justify-center">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-zinc-400">Không có ảnh</span>
              )}
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">SKU: {product.sku || 'N/A'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-500">Danh mục</p>
                <p className="font-medium">{product.categoryName}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Thương hiệu</p>
                <p className="font-medium">{product.brandName}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Giá bán</p>
                <p className="font-medium text-emerald-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Trạng thái</p>
                <Badge variant={product.isActive ? 'default' : 'secondary'} className={product.isActive ? 'bg-emerald-500' : ''}>
                  {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                </Badge>
              </div>
            </div>

            {product.description && (
              <div>
                <p className="text-sm text-zinc-500 mb-1">Mô tả</p>
                <p className="text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Các lô hàng hiện có</h3>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : batches.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-zinc-500 border border-dashed rounded-md">
              Sản phẩm này hiện không có lô hàng nào trong kho.
            </div>
          ) : (
            <div className="relative w-full overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Mã lô</TableHead>
                    <TableHead className="whitespace-nowrap">Nhà cung cấp</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Số lượng còn</TableHead>
                    <TableHead className="whitespace-nowrap">Hạn sử dụng</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch: any) => {
                    const expiryDateObj = new Date(batch.expiryDate);
                    const formattedExpiry = isNaN(expiryDateObj.getTime())
                      ? batch.expiryDate
                      : format(expiryDateObj, 'dd/MM/yyyy', { locale: vi });

                    return (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium whitespace-nowrap">{batch.batchCode}</TableCell>
                        <TableCell className="whitespace-nowrap">{batch.supplierName || '---'}</TableCell>
                        <TableCell className="text-right font-medium text-emerald-600 whitespace-nowrap">
                          {batch.remainingQty}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{formattedExpiry}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {batch.isExpired ? (
                            <Badge variant="destructive">Hết hạn</Badge>
                          ) : batch.isNearExpiry ? (
                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                              Sắp hết hạn
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                              Bình thường
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
