'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { QuantityStepper } from '@/features/shop/components/QuantityStepper';
import { useMounted } from '@/hooks/use-mounted';
import { formatVND } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';

export default function CartPage() {
  const mounted = useMounted();
  const cartItems = useCartStore((s) => s.items);
  const selectedIds = useCartStore((s) => s.selectedIds);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleSelect = useCartStore((s) => s.toggleSelect);
  const selectAll = useCartStore((s) => s.selectAll);

  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.product.id));
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="relative mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-tr from-rose-100 to-amber-50 shadow-inner dark:from-rose-500/10 dark:to-amber-500/10">
            <ShoppingCart className="h-20 w-20 text-rose-400 dark:text-rose-500" strokeWidth={1.5} />
            <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-white shadow-xl dark:bg-zinc-900" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Giỏ hàng trống
          </h2>
          <p className="mt-4 max-w-md text-lg text-zinc-500 dark:text-zinc-400">
            Có vẻ như bạn chưa chọn sản phẩm nào. Hãy khám phá các sản phẩm tuyệt vời dành cho thú cưng của bạn nhé!
          </p>
          <Button asChild size="lg" className="mt-10 h-14 rounded-full bg-zinc-900 px-8 text-base font-semibold hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
            <Link href="/shop">
              Bắt đầu mua sắm <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50/50 pb-24 pt-8 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Giỏ Hàng</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Bạn đang có <strong className="text-zinc-900 dark:text-white">{cartItems.length}</strong> sản phẩm trong giỏ hàng
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          {/* Left Column: Product List */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              {/* Header */}
              <div className="hidden grid-cols-12 items-center border-b border-zinc-100 bg-zinc-50/50 p-5 text-sm font-semibold text-zinc-500 md:grid dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-400">
                <div className="col-span-5 flex items-center gap-4">
                  <Checkbox
                    checked={cartItems.length > 0 && selectedIds.length === cartItems.length}
                    onCheckedChange={(checked) => selectAll(!!checked)}
                    className="data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                  />
                  <span>Chọn tất cả ({cartItems.length})</span>
                </div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-3 text-center">Số lượng</div>
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <span>Thành tiền</span>
                  <div className="w-7"></div> {/* Spacer for trash icon */}
                </div>
              </div>

              {/* Items */}
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {cartItems.map((item) => (
                  <li
                    key={item.product.id}
                    className="group grid grid-cols-1 gap-4 p-5 transition-colors hover:bg-zinc-50/80 md:grid-cols-12 md:items-center dark:hover:bg-zinc-800/30"
                  >
                    {/* Cột 1: Thông tin */}
                    <div className="flex items-start gap-3 md:col-span-5">
                      <div className="flex h-20 items-center">
                        <Checkbox
                          checked={selectedIds.includes(item.product.id)}
                          onCheckedChange={() => toggleSelect(item.product.id)}
                          className="data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                        />
                      </div>
                      <Link href={`/shop/${item.product.slug}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                      </Link>
                      <div className="flex flex-1 flex-col py-1">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="line-clamp-2 text-sm font-bold text-zinc-900 transition-colors hover:text-rose-600 dark:text-zinc-100 dark:hover:text-rose-400"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                          {item.product.brand}
                        </p>
                        {/* Nút xóa mobile */}
                        <button
                          onClick={() => {
                            removeItem(item.product.id);
                            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
                          }}
                          className="mt-2 flex w-max items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 md:hidden dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Xóa
                        </button>
                      </div>
                    </div>

                    {/* Cột 2: Đơn giá */}
                    <div className="flex items-center justify-between md:col-span-2 md:justify-center">
                      <span className="text-sm font-medium text-zinc-500 md:hidden">Đơn giá:</span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {formatVND(item.product.price)}
                      </span>
                    </div>

                    {/* Cột 3: Số lượng */}
                    <div className="flex items-center justify-between md:col-span-3 md:justify-center">
                      <span className="text-sm font-medium text-zinc-500 md:hidden">Số lượng:</span>
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(val) => updateQuantity(item.product.id, val)}
                        max={item.product.stockQuantity}
                        className="h-9 scale-90 sm:scale-100"
                      />
                    </div>

                    {/* Cột 4: Thành tiền */}
                    <div className="hidden items-center justify-end gap-3 md:col-span-2 md:flex">
                      <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        {formatVND(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => {
                          removeItem(item.product.id);
                          toast.success('Đã xóa sản phẩm');
                        }}
                        className="flex-shrink-0 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                        aria-label="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              {/* Header */}
              <div className="border-b border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800/50 dark:bg-zinc-900/50">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Tóm tắt đơn hàng</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4 text-base font-medium">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Tổng tiền ({totalItems} sản phẩm)</span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {formatVND(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Chiết khấu</span>
                    <span className="font-semibold text-emerald-600">0 đ</span>
                  </div>
                </div>

                <Separator className="my-6 border-zinc-200 dark:border-zinc-800" />

                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Tổng cộng</span>
                    <p className="mt-1 text-xs text-zinc-500">Đã bao gồm VAT nếu có</p>
                  </div>
                  <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
                    {formatVND(totalPrice)}
                  </span>
                </div>
              <Button
                onClick={(e) => {
                  if (selectedIds.length === 0) {
                    e.preventDefault();
                    toast.error('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
                    return;
                  }

                  const outOfStockItems = selectedItems.filter(
                    (item) => item.quantity > item.product.stockQuantity
                  );
                  if (outOfStockItems.length > 0) {
                    e.preventDefault();
                    const names = outOfStockItems.map((i) => i.product.name).join(', ');
                    toast.error(
                      `Sản phẩm "${names}" hiện không đủ số lượng trong kho. Vui lòng giảm số lượng!`
                    );
                  }
                }}
                asChild
                size="lg"
                className="h-14 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-lg font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-500/40"
              >
                <Link href={selectedIds.length === 0 ? '#' : '/checkout'}>
                  Mua hàng
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
