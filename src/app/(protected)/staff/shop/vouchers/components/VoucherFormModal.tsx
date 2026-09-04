import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVoucher, updateVoucher } from '@/features/loyalty/api/loyalty.api';
import { Voucher, CreateVoucherReq, DiscountType } from '@/features/loyalty/types/loyalty.types';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const schema = z.object({
  code: z.string().min(1, 'Mã voucher là bắt buộc'),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.coerce.number().min(0, 'Phải lớn hơn hoặc bằng 0'),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  pointsRequired: z.coerce.number().min(0, 'Phải lớn hơn hoặc bằng 0'),
  usageLimit: z.coerce.number().min(1).optional().or(z.literal(0)),
  requiredTier: z.string().optional(),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Voucher;
}

export function VoucherFormModal({ isOpen, onClose, initialData }: VoucherFormModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    // @ts-expect-error - zodResolver type mismatch due to z.coerce.number()
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      pointsRequired: 0,
      requiredTier: 'ALL',
      usageLimit: 0,
      startDate: '',
      endDate: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        code: initialData.code,
        description: initialData.description || '',
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        minOrderAmount: initialData.minOrderAmount,
        maxDiscount: initialData.maxDiscount || 0,
        pointsRequired: initialData.pointsRequired,
        requiredTier: initialData.requiredTier || 'ALL',
        usageLimit: initialData.usageLimit || 0,
        startDate: initialData.startDate ? initialData.startDate.substring(0, 16) : '',
        endDate: initialData.endDate ? initialData.endDate.substring(0, 16) : '',
        isActive: initialData.isActive,
      });
    } else {
      form.reset({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        pointsRequired: 0,
        requiredTier: 'ALL',
        usageLimit: 0,
        startDate: '',
        endDate: '',
        isActive: true,
      });
    }
  }, [initialData, form, isOpen]);

  const createMutation = useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      toast.success('Tạo voucher thành công');
      queryClient.invalidateQueries({ queryKey: ['management', 'vouchers'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tạo voucher thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; req: CreateVoucherReq }) => updateVoucher(data.id, data.req),
    onSuccess: () => {
      toast.success('Cập nhật voucher thành công');
      queryClient.invalidateQueries({ queryKey: ['management', 'vouchers'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cập nhật voucher thất bại');
    },
  });

  const onSubmit = (values: FormValues) => {
    const req: CreateVoucherReq = {
      ...values,
      requiredTier: values.requiredTier === 'ALL' ? undefined : values.requiredTier,
      usageLimit: values.usageLimit === 0 ? undefined : values.usageLimit,
      maxDiscount: values.maxDiscount === 0 ? undefined : values.maxDiscount,
      startDate: values.startDate
        ? values.startDate.length === 16
          ? values.startDate + ':00'
          : values.startDate
        : undefined,
      endDate: values.endDate
        ? values.endDate.length === 16
          ? values.endDate + ':00'
          : values.endDate
        : undefined,
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, req });
    } else {
      createMutation.mutate(req);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Cập nhật Voucher' : 'Thêm Voucher mới'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            <FormField
              control={form.control as any}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã Voucher</FormLabel>
                  <FormControl>
                    <Input {...field} className="uppercase" placeholder="VÍ DỤ: Giam10K" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Thông tin chi tiết về voucher..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại giảm giá</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại giảm giá" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Theo phần trăm (%)</SelectItem>
                        <SelectItem value="FIXED">Số tiền cố định (VND)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức giảm</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="maxDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm tối đa (VND) - Để 0 nếu không giới hạn</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn tối thiểu (VND)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="requiredTier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hạng yêu cầu (để trống nếu dành cho mọi hạng)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn hạng yêu cầu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">-- Dành cho mọi hạng --</SelectItem>
                      <SelectItem value="MEMBER">Tiêu chuẩn (MEMBER)</SelectItem>
                      <SelectItem value="BRONZE">Hạng Đồng (BRONZE)</SelectItem>
                      <SelectItem value="SILVER">Hạng Bạc (SILVER)</SelectItem>
                      <SelectItem value="GOLD">Hạng Vàng (GOLD)</SelectItem>
                      <SelectItem value="DIAMOND">Hạng Kim Cương (DIAMOND)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="pointsRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm cần đổi (0 = Miễn phí)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng mã (0 = Không giới hạn)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Kích hoạt Voucher</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {initialData ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
