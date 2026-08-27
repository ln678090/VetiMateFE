import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { inventoryApi } from '@/features/shop/api/inventory.api';
import { productApi } from '@/features/shop/api/product.api';
import { CreateImportVoucherReq } from '@/features/shop/types/inventory.types';

const itemSchema = z.object({
  productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  supplierId: z.string().min(1, 'Vui lòng chọn nhà cung cấp'),
  batchCode: z.string().optional(),
  quantity: z.coerce.number().min(1, 'Số lượng phải lớn hơn 0'),
  importPrice: z.coerce.number().min(0, 'Giá không hợp lệ'),
  expiryDate: z.string().optional(),
});

const formSchema = z.object({
  note: z.string().optional(),
  items: z.array(itemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateImportVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateImportVoucherModal({ isOpen, onClose }: CreateImportVoucherModalProps) {
  const queryClient = useQueryClient();
  
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getProducts,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers'],
    queryFn: inventoryApi.getAllSuppliers,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      note: '',
      items: [{
        productId: '',
        supplierId: '',
        batchCode: '',
        quantity: 1,
        importPrice: 0,
        expiryDate: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        note: '',
        items: [{
          productId: '',
          supplierId: '',
          batchCode: '',
          quantity: 1,
          importPrice: 0,
          expiryDate: '',
        }],
      });
    }
  }, [isOpen, form]);

  const createMutation = useMutation({
    mutationFn: (data: CreateImportVoucherReq) => inventoryApi.createImportVoucher(data),
    onSuccess: () => {
      toast.success('Tạo phiếu nhập kho thành công (Bản nháp)');
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const onSubmit = (values: FormValues) => {
    // Clean up empty strings to undefined
    const cleanItems = values.items.map(item => ({
      ...item,
      batchCode: item.batchCode || undefined,
      expiryDate: item.expiryDate || undefined,
    }));
    createMutation.mutate({ note: values.note, items: cleanItems });
  };

  const isPending = createMutation.isPending;
  const products = productsData?.data?.items || [];
  const suppliers = suppliersData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Phiếu Nhập Kho</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Danh sách sản phẩm nhập</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ productId: '', supplierId: '', batchCode: '', quantity: 1, importPrice: 0, expiryDate: '' })}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Thêm dòng
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg relative space-y-4 bg-zinc-50/50">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-rose-500 hover:text-rose-700"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sản phẩm <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn sản phẩm" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.supplierId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nhà cung cấp <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn nhà cung cấp" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {suppliers.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.importPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá nhập (VNĐ) <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.batchCode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã lô hàng (Tùy chọn)</FormLabel>
                          <FormControl>
                            <Input placeholder="VD: L001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.expiryDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày hết hạn (Tùy chọn)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              {form.formState.errors.items?.root && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.items.root.message}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú phiếu nhập</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nhập ghi chú (nếu có)..." 
                      className="resize-none h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Đang tạo...' : 'Tạo phiếu nháp'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
