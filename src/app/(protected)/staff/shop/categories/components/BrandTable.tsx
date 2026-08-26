import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Brand } from '@/features/shop/types/catalog.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogApi } from '@/features/shop/api/catalog.api';
import { toast } from 'sonner';

interface BrandTableProps {
  brands: Brand[];
  isLoading: boolean;
  onEdit: (brand: Brand) => void;
}

export function BrandTable({ brands, isLoading, onEdit }: BrandTableProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => catalogApi.deleteBrand(id),
    onSuccess: () => {
      toast.success('Xóa thương hiệu thành công');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa thương hiệu');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
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

  if (brands.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center p-4 text-sm text-zinc-500">
        Chưa có thương hiệu nào. Hãy thêm thương hiệu mới.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Logo</TableHead>
          <TableHead>Tên thương hiệu</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brands.map((brand) => (
          <TableRow key={brand.id}>
            <TableCell>
              {brand.logoUrl ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-zinc-200">
                  <Image src={brand.logoUrl} alt={brand.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 text-xs text-zinc-500">
                  No img
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium">{brand.name}</TableCell>
            <TableCell className="text-zinc-500">{brand.slug}</TableCell>
            <TableCell>
              {brand.isActive ? (
                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Hoạt động</Badge>
              ) : (
                <Badge variant="secondary">Đã ẩn</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => onEdit(brand)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" onClick={() => handleDelete(brand.id)}>
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

