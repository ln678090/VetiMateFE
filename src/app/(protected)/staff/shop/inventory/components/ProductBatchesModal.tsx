import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface ProductBatchesModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductBatchesModal({ product, isOpen, onClose }: ProductBatchesModalProps) {
  const { data: batchesData, isLoading } = useQuery({
    queryKey: ['product-batches', product?.id],
    queryFn: () => batchApi.getByProduct(product!.id),
    enabled: !!product?.id && isOpen,
  });

  const rawBatches = Array.isArray(batchesData?.data?.data)
    ? batchesData.data.data
    : Array.isArray(batchesData?.data)
      ? batchesData.data
      : Array.isArray(batchesData)
        ? batchesData
        : [];

  const batches = rawBatches.filter((b: any) => b.remainingQty > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chi tiết tồn kho - {product?.name}</DialogTitle>
          <DialogDescription>Danh sách các lô hàng đang còn tồn trong hệ thống.</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : batches.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-zinc-500">
              Sản phẩm này hiện không có lô hàng nào trong kho.
            </div>
          ) : (
            <div className="relative w-full overflow-auto rounded-md border border-zinc-200 dark:border-zinc-800">
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
                  {batches.map((batch) => {
                    const expiryDateObj = new Date(batch.expiryDate);
                    const formattedExpiry = isNaN(expiryDateObj.getTime())
                      ? batch.expiryDate
                      : format(expiryDateObj, 'dd/MM/yyyy', { locale: vi });

                    return (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {batch.batchCode}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {batch.supplierName || '---'}
                        </TableCell>
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
                            <Badge
                              variant="default"
                              className="bg-emerald-500 hover:bg-emerald-600"
                            >
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
