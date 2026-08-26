import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category } from '@/features/shop/types/catalog.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogApi } from '@/features/shop/api/catalog.api';
import { toast } from 'sonner';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
}

export function CategoryTable({ categories, isLoading, onEdit }: CategoryTableProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => catalogApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
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

  if (categories.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center p-4 text-sm text-zinc-500">
        Chưa có danh mục nào. Hãy thêm danh mục mới.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên danh mục</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-zinc-500">{category.slug}</TableCell>
            <TableCell>
              {category.isActive ? (
                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Hoạt động</Badge>
              ) : (
                <Badge variant="secondary">Đã ẩn</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => onEdit(category)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" onClick={() => handleDelete(category.id)}>
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

