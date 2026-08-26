import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Brand, BrandReq } from '@/features/shop/types/catalog.types';
import { catalogApi } from '@/features/shop/api/catalog.api';

const formSchema = z.object({
  name: z.string().min(2, 'Tên thương hiệu phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  logoUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandToEdit?: Brand | null;
}

export function BrandFormModal({ isOpen, onClose, brandToEdit }: BrandFormModalProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      logoUrl: '',
      isActive: true,
    },
  });

  // Reset form when modal opens or brandToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (brandToEdit) {
        form.reset({
          name: brandToEdit.name,
          description: brandToEdit.description || '',
          logoUrl: brandToEdit.logoUrl || '',
          isActive: brandToEdit.isActive,
        });
      } else {
        form.reset({
          name: '',
          description: '',
          logoUrl: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, brandToEdit, form]);

  const createMutation = useMutation({
    mutationFn: (data: BrandReq) => catalogApi.createBrand(data),
    onSuccess: () => {
      toast.success('Thêm thương hiệu thành công');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thêm thương hiệu');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BrandReq }) => catalogApi.updateBrand(id, data),
    onSuccess: () => {
      toast.success('Cập nhật thương hiệu thành công');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thương hiệu');
    },
  });

  const onSubmit = (values: FormValues) => {
    // Convert empty string to undefined for optional fields
    const payload = {
      ...values,
      logoUrl: values.logoUrl === '' ? undefined : values.logoUrl,
    };
    
    if (brandToEdit) {
      updateMutation.mutate({ id: brandToEdit.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{brandToEdit ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thương hiệu <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên thương hiệu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Logo (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
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
                      placeholder="Nhập mô tả về thương hiệu..." 
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
                {isPending ? 'Đang lưu...' : (brandToEdit ? 'Lưu thay đổi' : 'Thêm mới')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
