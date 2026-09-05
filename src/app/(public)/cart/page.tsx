'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Minus,
  PackageCheck,
  Plus,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { formatVND } from '@/lib/utils';
import { orderApi } from '@/features/order/api/order.api';
import { useMounted } from '@/hooks/use-mounted';

const COUPONS: Record<string, { desc: string; discount: (subtotal: number) => number }> = {
  VETIMATE10: {
    desc: 'Giảm 10% tổng đơn hàng',
    discount: (sub) => Math.round(sub * 0.1),
  },
  FREESHIP: {
    desc: 'Miễn phí giao hàng (30.000 đ)',
    discount: () => 30000,
  },
  PETLOVER: {
    desc: 'Giảm trực tiếp 50.000 đ',
    discount: () => 50000,
  },
};

export default function CartPage() {
  const router = useRouter();
  const mounted = useMounted();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Form checkout
  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER' | 'VNPAY'>('COD');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = mounted ? getSubtotal() : 0;
  const isFreeShipping = subtotal >= 300000 || appliedCoupon === 'FREESHIP';
  const shippingFee = items.length === 0 || isFreeShipping ? 0 : 30000;

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || !COUPONS[appliedCoupon]) return 0;
    if (appliedCoupon === 'FREESHIP') return 0; // handled in shippingFee
    return Math.min(COUPONS[appliedCoupon].discount(subtotal), subtotal);
  }, [appliedCoupon, subtotal]);

  const totalAmount = Math.max(0, subtotal + shippingFee - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (COUPONS[code]) {
      setAppliedCoupon(code);
      toast.success(`Đã áp dụng mã "${code}": ${COUPONS[code].desc}`);
      setCouponCode('');
    } else {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      toast.error('Giỏ hàng của bạn đang trống.');
      return;
    }

    if (!recipientName.trim() || !recipientPhone.trim() || !shippingAddress.trim()) {
      toast.error('Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để hoàn tất đặt hàng!');
      router.push('/login?redirect=/cart');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        note: note.trim()
          ? `${note.trim()} ${appliedCoupon ? `[Mã giảm giá: ${appliedCoupon}]` : ''}`
          : appliedCoupon
          ? `[Mã giảm giá: ${appliedCoupon}]`
          : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const result = await orderApi.createOrder(orderPayload);

      toast.success('🎉 Đặt hàng thành công!', {
        description: `Mã đơn hàng: ${result.orderCode}`,
      });

      clearCart();
      router.push('/customer/orders');
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="h-96 animate-pulse rounded-3xl bg-muted/60" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb / Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/shop">
            <ArrowLeft className="size-4" />
            Tiếp tục mua sắm
          </Link>
        </Button>

        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Xóa tất cả
          </Button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-50">
          Giỏ hàng của bạn
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          {items.length > 0
            ? `Bạn đang có ${items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm trong giỏ hàng.`
            : 'Chưa có sản phẩm nào trong giỏ hàng.'}
        </p>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/60 p-8 text-center backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="grid size-20 place-items-center rounded-3xl bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
            <ShoppingCart className="size-10 stroke-[1.5]" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="mt-1.5 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            Hãy khám phá hàng trăm sản phẩm thức ăn, cát vệ sinh, đồ chơi và phụ kiện chất lượng cao
            dành cho thú cưng của bạn.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 transition hover:shadow-xl hover:shadow-rose-500/35"
          >
            <Link href="/shop">
              <ShoppingBag className="mr-2 size-4" />
              Khám phá cửa hàng ngay
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Danh sách sản phẩm trong giỏ */}
          <div className="space-y-4 lg:col-span-7">
            <AnimatePresence>
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;
                return (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col gap-4 rounded-3xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center dark:border-zinc-800/60 dark:bg-zinc-900/60"
                  >
                    {/* Ảnh sản phẩm */}
                    <Link
                      href={`/shop/${item.slug}`}
                      className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition hover:scale-105"
                        unoptimized
                      />
                    </Link>

                    {/* Thông tin & Tên */}
                    <div className="min-w-0 flex-1">
                      {item.brandName && (
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
                          {item.brandName}
                        </p>
                      )}
                      <Link
                        href={`/shop/${item.slug}`}
                        className="line-clamp-2 text-sm font-semibold text-zinc-900 transition hover:text-rose-600 dark:text-zinc-100 dark:hover:text-rose-400"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                          {formatVND(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-zinc-400 line-through">
                            {formatVND(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bộ tăng giảm số lượng & Thành tiền */}
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="flex items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="grid size-7 place-items-center rounded-xl transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
                          aria-label="Giảm"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="grid size-7 place-items-center rounded-xl transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
                          aria-label="Tăng"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                          {formatVND(lineTotal)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-zinc-400 transition hover:text-rose-500"
                          title="Xóa khỏi giỏ"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Voucher gợi ý */}
            <div className="rounded-3xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                <Tag className="size-4" />
                Mã ưu đãi có thể dùng:
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAppliedCoupon('VETIMATE10')}
                  className="rounded-xl border border-dashed border-amber-400 bg-white px-2.5 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-100 dark:bg-zinc-900 dark:text-amber-300"
                >
                  VETIMATE10 (-10%)
                </button>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon('FREESHIP')}
                  className="rounded-xl border border-dashed border-amber-400 bg-white px-2.5 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-100 dark:bg-zinc-900 dark:text-amber-300"
                >
                  FREESHIP (Miễn phí ship)
                </button>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon('PETLOVER')}
                  className="rounded-xl border border-dashed border-amber-400 bg-white px-2.5 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-100 dark:bg-zinc-900 dark:text-amber-300"
                >
                  PETLOVER (-50k)
                </button>
              </div>
            </div>
          </div>

          {/* Cột thông tin giao hàng & Tóm tắt thanh toán */}
          <div className="space-y-6 lg:col-span-5">
            {/* Form thông tin nhận hàng */}
            <Card className="rounded-3xl border-zinc-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PackageCheck className="size-5 text-rose-500" />
                  Thông tin nhận hàng
                </CardTitle>
                <CardDescription>Điền địa chỉ nhận hàng để VetiMate giao nhanh chóng.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="receiverName" className="text-xs font-semibold">
                    Họ và tên người nhận <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="receiverName"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="receiverPhone" className="text-xs font-semibold">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="receiverPhone"
                    placeholder="Ví dụ: 0987654321"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="shippingAddress" className="text-xs font-semibold">
                    Địa chỉ nhận hàng chi tiết <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="shippingAddress"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="orderNote" className="text-xs font-semibold">
                    Ghi chú đơn hàng (Tùy chọn)
                  </Label>
                  <Input
                    id="orderNote"
                    placeholder="Giao giờ hành chính, gọi trước khi giao..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="rounded-2xl"
                  />
                </div>

                {/* Phương thức thanh toán */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-semibold">Phương thức thanh toán</Label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border p-3 text-left transition ${
                        paymentMethod === 'COD'
                          ? 'border-rose-500 bg-rose-50/50 shadow-sm dark:border-rose-500 dark:bg-rose-950/30'
                          : 'border-zinc-200 bg-white/60 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-4 rounded-full border-2 transition ${
                            paymentMethod === 'COD'
                              ? 'border-rose-500 bg-rose-500'
                              : 'border-zinc-400'
                          }`}
                        />
                        <div>
                          <p className="text-xs font-semibold">Thanh toán khi nhận hàng (COD)</p>
                          <p className="text-[11px] text-zinc-500">Thanh toán tiền mặt cho shipper</p>
                        </div>
                      </div>
                      <Truck className="size-4 text-zinc-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('BANK_TRANSFER')}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border p-3 text-left transition ${
                        paymentMethod === 'BANK_TRANSFER'
                          ? 'border-rose-500 bg-rose-50/50 shadow-sm dark:border-rose-500 dark:bg-rose-950/30'
                          : 'border-zinc-200 bg-white/60 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-4 rounded-full border-2 transition ${
                            paymentMethod === 'BANK_TRANSFER'
                              ? 'border-rose-500 bg-rose-500'
                              : 'border-zinc-400'
                          }`}
                        />
                        <div>
                          <p className="text-xs font-semibold">Chuyển khoản ngân hàng</p>
                          <p className="text-[11px] text-zinc-500">Quét mã VietQR chuyển tiền 24/7</p>
                        </div>
                      </div>
                      <CreditCard className="size-4 text-zinc-400" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tóm tắt thanh toán */}
            <Card className="rounded-3xl border-zinc-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Receipt className="size-5 text-rose-500" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Input mã giảm giá */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    placeholder="Nhập mã voucher..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="rounded-2xl uppercase"
                  />
                  <Button type="submit" variant="secondary" className="rounded-2xl font-semibold">
                    Áp dụng
                  </Button>
                </form>

                {appliedCoupon && (
                  <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      Mã: <strong>{appliedCoupon}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                )}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatVND(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Miễn phí</span>
                      ) : (
                        formatVND(shippingFee)
                      )}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Giảm giá voucher</span>
                      <span className="font-semibold">-{formatVND(couponDiscount)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      Tổng thanh toán
                    </span>
                    <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                      {formatVND(totalAmount)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isSubmitting || items.length === 0}
                  className="h-12 w-full rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-base font-bold text-white shadow-lg shadow-rose-500/25 transition hover:shadow-xl hover:shadow-rose-500/35"
                >
                  {isSubmitting ? 'Đang xử lý đặt hàng...' : 'Xác nhận đặt hàng'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  Bảo mật thanh toán & Cam kết hàng chính hãng 100%
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
