'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { getMyVouchers } from '@/features/loyalty/api/loyalty.api';
import { orderService } from '@/services/order.service';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn, formatVND } from '@/lib/utils';
import { CheckoutInput, checkoutSchema } from '@/schemas/checkout.schema';
import { useCartStore } from '@/stores/cart.store';
import { useDistricts, useProvinces } from '@/hooks/use-provinces';

const PAYMENT_METHODS = [
  {
    id: 'COD',
    label: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng.',
  },
] as const;

export function CheckoutForm() {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);
  const selectedIds = useCartStore((s) => s.selectedIds);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute totals
  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.product.id));
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = totalPrice >= 500000 ? 0 : 30000;

  const { data: myVouchers } = useQuery({
    queryKey: ['loyalty', 'myVouchers'],
    queryFn: getMyVouchers,
  });

  const availableVouchers = myVouchers?.filter(uv => !uv.isUsed && uv.voucher.minOrderAmount <= totalPrice) || [];

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      city: '',
      district: '',
      specificAddress: '',
      note: '',
      paymentMethod: 'COD',
      userVoucherId: 'none',
    },
  });

  const { provinces, loading: loadingProvinces } = useProvinces();

  const selectedCityName = form.watch('city');
  const selectedProvince = provinces.find((p) => p.name === selectedCityName);
  const provinceId = selectedProvince?.id || '';

  const { districts, loading: loadingDistricts } = useDistricts(provinceId);

  // Reset district when city changes
  useEffect(() => {
    if (selectedCityName) {
      form.setValue('district', '');
    }
  }, [selectedCityName, form]);

  const selectedVoucherId = form.watch('userVoucherId');
  const selectedVoucher = selectedVoucherId && selectedVoucherId !== 'none' 
    ? availableVouchers.find(uv => uv.id === selectedVoucherId)?.voucher 
    : undefined;

  let discount = 0;
  if (selectedVoucher) {
    if (selectedVoucher.discountType === 'FIXED') {
      discount = selectedVoucher.discountValue;
    } else {
      discount = (totalPrice * selectedVoucher.discountValue) / 100;
      if (selectedVoucher.maxDiscount > 0 && discount > selectedVoucher.maxDiscount) {
        discount = selectedVoucher.maxDiscount;
      }
    }
  }

  const finalPrice = Math.max(0, totalPrice - discount) + shippingFee;

  const onSubmit = async (data: CheckoutInput) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        items: selectedItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        userVoucherId: (data.userVoucherId && data.userVoucherId !== 'none') ? data.userVoucherId : undefined
      };

      await orderService.checkout(payload);

      toast.success('Đặt hàng thành công!', {
        description: 'Cảm ơn bạn đã mua sắm tại PetCare Vet Shop. Chúng tôi sẽ sớm liên hệ.',
      });

      // Clear cart and redirect
      clearCart();
      router.push('/profile/orders');
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      toast.error('Đặt hàng thất bại', {
        description: apiError.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left Column: Form Fields */}
        <div className="space-y-8 lg:col-span-7 xl:col-span-8">
          {/* Shipping Address Section */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Địa Chỉ Nhận Hàng</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Họ và tên <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số điện thoại <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tỉnh / Thành phố <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={loadingProvinces ? 'Đang tải...' : 'Chọn Tỉnh / Thành phố'}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p.name}
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
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phường / Xã <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={!selectedCityName || loadingDistricts}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={loadingDistricts ? 'Đang tải...' : 'Chọn Phường / Xã'}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d.id} value={d.name}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="specificAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Địa chỉ cụ thể <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Số nhà, Tên đường..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú cho đơn vị vận chuyển</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Thời gian nhận hàng, chỉ dẫn đường đi..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Voucher Section */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-8 text-xl font-bold text-zinc-900 dark:text-white">Mã Giảm Giá / Voucher</h2>
            
            <FormField
              control={form.control}
              name="userVoucherId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn Voucher của bạn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không sử dụng voucher</SelectItem>
                        {availableVouchers.map(uv => (
                          <SelectItem key={uv.id} value={uv.id}>
                            {uv.voucher.code} - Giảm {uv.voucher.discountType === 'FIXED' ? formatVND(uv.voucher.discountValue) : `${uv.voucher.discountValue}%`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {availableVouchers.length === 0 && (
              <p className="mt-2 text-sm text-zinc-500">Bạn không có voucher nào phù hợp cho đơn hàng này.</p>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-8 text-xl font-bold text-zinc-900 dark:text-white">
              Phương Thức Thanh Toán
            </h2>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className={cn(
                            'group relative flex cursor-pointer items-start space-x-4 rounded-xl border-2 p-5 transition-all duration-200',
                            field.value === method.id
                              ? 'border-rose-500 bg-rose-50 shadow-sm dark:border-rose-500 dark:bg-rose-950/20 dark:shadow-none'
                              : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50'
                          )}
                        >
                          <div className="flex h-5 items-center">
                            <input
                              type="radio"
                              value={method.id}
                              checked={field.value === method.id}
                              onChange={field.onChange}
                              className="h-4 w-4 border-zinc-300 text-rose-600 focus:ring-rose-500 focus:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:ring-offset-zinc-950"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                'text-base font-bold',
                                field.value === method.id
                                  ? 'text-rose-700 dark:text-rose-400'
                                  : 'text-zinc-900 dark:text-zinc-100'
                              )}
                            >
                              {method.label}
                            </span>
                            <span
                              className={cn(
                                'mt-1 text-sm font-medium',
                                field.value === method.id
                                  ? 'text-rose-600/80 dark:text-rose-400/80'
                                  : 'text-zinc-500'
                              )}
                            >
                              {method.description}
                            </span>
                          </div>
                          {field.value === method.id && (
                            <div className="absolute -right-1.5 -top-1.5 h-3 w-3 animate-ping rounded-full bg-rose-400 opacity-75" />
                          )}
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* Header */}
            <div className="border-b border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-800/50 dark:bg-zinc-900/50">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Đơn Hàng Của Bạn</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                {totalItems} sản phẩm được chọn
              </p>
            </div>

            <div className="p-6">
              <ul className="mb-6 space-y-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-500 text-xs font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-900">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center py-1">
                      <h4 className="line-clamp-2 text-sm font-bold text-zinc-900 dark:text-white">
                        {item.product.name}
                      </h4>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-bold text-rose-500">
                          {formatVND(item.product.price)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <Separator className="mb-4" />

              <div className="space-y-4 text-base font-medium">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {formatVND(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Voucher giảm giá</span>
                    <span className="font-semibold">- {formatVND(discount)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-6 border-zinc-200 dark:border-zinc-800" />

              <div className="mb-8 flex items-end justify-between">
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Tổng cộng
                </span>
                <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
                  {formatVND(finalPrice)}
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-14 w-full rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-lg font-bold text-white shadow-md shadow-rose-500/25 transition-all hover:shadow-lg hover:shadow-rose-500/40"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt Hàng'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
