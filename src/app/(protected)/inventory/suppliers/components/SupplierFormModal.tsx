'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/features/inventory/api/inventory.api';
import { SupplierRequest, SupplierResp } from '@/types/inventory';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useEffect } from 'react';

const supplierSchema = z.object({
  name: z.string().min(1, 'Tên nhà cung cấp không được để trống'),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: SupplierResp;
}

type SupplierFormValues = {
  name: string;
  phone?: string;
  email?: string;
  isActive: boolean;
};

export function SupplierFormModal({ isOpen, onClose, supplier }: SupplierFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!supplier;

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        form.reset({
          name: supplier.name,
          phone: supplier.phone || '',
          email: supplier.email || '',
          isActive: supplier.isActive,
        });
      } else {
        form.reset({
          name: '',
          phone: '',
          email: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, supplier, form]);

  const createMutation = useMutation({
    mutationFn: (data: SupplierRequest) => supplierApi.create(data),
    onSuccess: () => {
      toast.success('Thêm nhà cung cấp thành công');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onClose();
    },
    onError: () => {
      toast.error('Lỗi khi thêm nhà cung cấp');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SupplierRequest) => supplierApi.update(supplier!.id, data),
    onSuccess: () => {
      toast.success('Cập nhật nhà cung cấp thành công');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onClose();
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật nhà cung cấp');
    },
  });

  function onSubmit(values: SupplierFormValues) {
    if (isEditing) {
      updateMutation.mutate(values as SupplierRequest);
    } else {
      createMutation.mutate(values as SupplierRequest);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên nhà cung cấp <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên nhà cung cấp..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Đang lưu...' : 'Lưu lại'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
