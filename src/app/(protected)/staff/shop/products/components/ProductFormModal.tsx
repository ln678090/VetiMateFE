import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Product } from '@/features/shop/types/product.types';
import { ProductReq, productApi } from '@/features/shop/api/product.api';
import { catalogApi } from '@/features/shop/api/catalog.api';

const formSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  brandId: z.string().min(1, 'Vui lòng chọn thương hiệu'),
  petType: z.enum(['dog', 'cat', 'both']),
  price: z.coerce.number().min(0, 'Giá không hợp lệ'),
  originalPrice: z.coerce.number().min(0, 'Giá không hợp lệ').optional(),
  imageUrl: z.string().min(1, 'URL ảnh không được để trống'),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export function ProductFormModal({ isOpen, onClose, productToEdit }: ProductFormModalProps) {
  const queryClient = useQueryClient();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: catalogApi.getAllCategories,
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: catalogApi.getAllBrands,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>, // Sửa ở đây
    defaultValues: {
      name: '',
      description: '',
      shortDesc: '',
      categoryId: '',
      brandId: '',
      petType: 'both',
      price: 0,
      originalPrice: 0,
      imageUrl: '',
      isFeatured: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        form.reset({
          name: productToEdit.name,
          description: productToEdit.description || '',
          categoryId: productToEdit.categoryId,
          brandId: productToEdit.brandId,
          petType: productToEdit.petType,
          price: productToEdit.price || 0,
          originalPrice: productToEdit.originalPrice || 0,
          imageUrl: productToEdit.imageUrl || '',
          isFeatured: productToEdit.isFeatured ?? false,
          isActive: productToEdit.isActive ?? true,
        });
      } else {
        form.reset({
          name: '',
          description: '',
          categoryId: '',
          brandId: '',
          petType: 'both',
          price: 0,
          originalPrice: 0,
          imageUrl: '',
          isFeatured: false,
          isActive: true,
        });
      }
    }
  }, [isOpen, productToEdit, form]);

  const createMutation = useMutation({
    mutationFn: (data: ProductReq) => productApi.createProduct(data),
    onSuccess: () => {
      toast.success('Thêm sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (error: unknown) => {
      // Sửa thành unknown
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductReq }) =>
      productApi.updateProduct(id, data),
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (error: unknown) => {
      // Sửa thành unknown
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    },
  });

  const onSubmit = (values: FormValues) => {
    if (productToEdit) {
      updateMutation.mutate({ id: productToEdit.id, data: values as unknown as ProductReq });
    } else {
      createMutation.mutate(values as unknown as ProductReq);
    }
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    // Sửa thành Record<string, unknown>
    console.error('Form validation failed:', Object.keys(errors), errors);
    toast.error('Vui lòng kiểm tra lại thông tin nhập!');
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productToEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên sản phẩm..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Danh mục <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
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
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Thương hiệu <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thương hiệu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Giá bán (VNĐ) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dành cho thú cưng</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại thú cưng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="both">Chó & Mèo</SelectItem>
                        <SelectItem value="dog">Chỉ dành cho Chó</SelectItem>
                        <SelectItem value="cat">Chỉ dành cho Mèo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      URL Ảnh đại diện <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả sản phẩm..."
                      className="resize-none h-24"
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
                {isPending ? 'Đang lưu...' : productToEdit ? 'Lưu thay đổi' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
