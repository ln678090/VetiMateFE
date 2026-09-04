import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category, CategoryReq } from '@/features/shop/types/catalog.types';
import { catalogApi } from '@/features/shop/api/catalog.api';

const formSchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  isActive: z.boolean(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
  categories: Category[]; // To select parent category
}

export function CategoryFormModal({
  isOpen,
  onClose,
  categoryToEdit,
  categories,
}: CategoryFormModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      parentId: undefined,
    },
  });

  // Reset form when modal opens or categoryToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        form.reset({
          name: categoryToEdit.name,
          description: categoryToEdit.description || '',
          isActive: categoryToEdit.isActive,
          parentId: categoryToEdit.parentId || undefined,
        });
      } else {
        form.reset({
          name: '',
          description: '',
          isActive: true,
          parentId: undefined,
        });
      }
    }
  }, [isOpen, categoryToEdit, form]);

  const createMutation = useMutation({
    mutationFn: (data: CategoryReq) => catalogApi.createCategory(data),
    onSuccess: () => {
      toast.success('Thêm danh mục thành công');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError?.response?.data?.message || 'Có lỗi xảy ra khi thêm danh mục');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryReq }) =>
      catalogApi.updateCategory(id, data),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục');
    },
  });

  const onSubmit = (values: FormValues) => {
    if (categoryToEdit) {
      updateMutation.mutate({ id: categoryToEdit.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{categoryToEdit ? 'Sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên danh mục <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên danh mục..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục cha (Tùy chọn)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'none'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục cha" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">-- Không có danh mục cha --</SelectItem>
                      {categories
                        .filter((c) => c.id !== categoryToEdit?.id) // Cannot be parent of itself
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả ngắn gọn..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Đang lưu...' : categoryToEdit ? 'Lưu thay đổi' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
