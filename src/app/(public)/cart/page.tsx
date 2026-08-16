'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks/use-mounted';
import { formatVND } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';

export default function CartPage() {
  const mounted = useMounted();
  const cartItems = useCartStore((s) => s.items);
  const selectedItemIds = useCartStore((s) => s.selectedItemIds);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  
  const toggleSelection = useCartStore((s) => s.toggleSelection);
  const selectAll = useCartStore((s) => s.selectAll);
  const getSelectedTotalPrice = useCartStore((s) => s.getSelectedTotalPrice);

  // Tránh hydration mismatch
  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-500/10">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Hãy khám phá các sản phẩm và thêm vào giỏ hàng nhé!
        </p>
        <Button asChild className="mt-8 bg-rose-500 hover:bg-rose-600">
          <Link href="/shop">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;
  const selectedTotalPrice = getSelectedTotalPrice();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
        Giỏ Hàng
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cột trái: Danh sách sản phẩm */}
        <div className="space-y-4">
          <div className="hidden grid-cols-[40px_1fr_120px_120px_140px] items-center gap-4 rounded-lg bg-zinc-100/80 px-6 py-3 text-sm font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 md:grid">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => selectAll(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-600 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-rose-600"
              />
            </div>
            <span>Sản phẩm</span>
            <span className="text-center">Đơn giá</span>
            <span className="text-center">Số lượng</span>
            <span className="text-right">Số tiền</span>
          </div>

          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-[30px_1fr] items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-[40px_1fr_120px_120px_140px] md:px-6"
              >
                {/* 1. Checkbox */}
                <div className="flex h-full items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedItemIds.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-600 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-rose-600"
                  />
                </div>

                {/* 2. Sản phẩm (Image + Name) */}
                <div className="flex gap-4">
                  <Link href={`/shop/${item.slug || item.id}`} className="block shrink-0">
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-100 dark:border-zinc-800">
                      <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-col justify-center">
                    <Link
                      href={`/shop/${item.slug || item.id}`}
                      className="line-clamp-2 text-sm font-medium text-zinc-900 transition hover:text-rose-600 dark:text-zinc-100 dark:hover:text-rose-400"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 md:hidden">
                      <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        {formatVND(item.price)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-zinc-400 line-through dark:text-zinc-600">
                          {formatVND(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Price (Desktop) */}
                <div className="hidden flex-col items-center justify-center md:flex">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatVND(item.price)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-zinc-400 line-through dark:text-zinc-600">
                      {formatVND(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* 4. Quantity */}
                <div className="col-span-2 flex items-center gap-3 pl-10 md:col-span-1 md:justify-center md:pl-0">
                  <div className="inline-flex h-8 items-center rounded-md border border-zinc-300 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="grid h-full w-8 place-items-center text-zinc-600 transition hover:bg-zinc-100 disabled:text-zinc-300 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:disabled:text-zinc-700"
                    >
                      <Minus className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                    <span className="grid h-full w-10 place-items-center border-x border-zinc-300 text-sm font-medium tabular-nums text-zinc-900 dark:border-zinc-700 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="grid h-full w-8 place-items-center text-zinc-600 transition hover:bg-zinc-100 disabled:text-zinc-300 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:disabled:text-zinc-700"
                    >
                      <Plus className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* 5. Total Item Price & Remove */}
                <div className="col-span-2 flex items-center justify-between md:col-span-1 md:justify-end md:gap-4">
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400 md:hidden pl-10">
                    Tổng: {formatVND(item.price * item.quantity)}
                  </span>
                  <span className="hidden text-right text-sm font-bold text-rose-600 dark:text-rose-400 md:block">
                    {formatVND(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <label className="flex cursor-pointer items-center gap-2 pl-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => selectAll(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-600 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-rose-600"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Chọn tất cả</span>
            </label>
            <Button variant="outline" onClick={clearCart} className="text-zinc-500">
              Xóa tất cả
            </Button>
          </div>
        </div>

        {/* Cột phải: Summary */}
        <div className="h-fit rounded-xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Tóm tắt đơn hàng
          </h2>
          
          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span>Tạm tính</span>
              <span>{formatVND(selectedTotalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span>Phí vận chuyển</span>
              <span>Liên hệ</span>
            </div>
            
            <div className="my-4 h-px bg-zinc-200 dark:bg-zinc-800" />
            
            <div className="flex items-end justify-between">
              <span className="font-semibold text-zinc-900 dark:text-white">Tổng cộng</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {formatVND(selectedTotalPrice)}
                </span>
                <p className="mt-1 text-xs text-zinc-500">(Đã bao gồm VAT nếu có)</p>
              </div>
            </div>
          </div>

          {selectedItemIds.length === 0 ? (
            <Button 
              disabled
              className="mt-8 h-12 w-full bg-gradient-to-r from-rose-500 to-amber-500 text-base font-bold text-white opacity-50"
            >
              Tiến Hành Thanh Toán
            </Button>
          ) : (
            <Button 
              asChild
              className="mt-8 h-12 w-full bg-gradient-to-r from-rose-500 to-amber-500 text-base font-bold text-white shadow-lg shadow-rose-500/25 transition hover:shadow-xl hover:shadow-rose-500/40"
            >
              <Link href="/checkout">Tiến Hành Thanh Toán</Link>
            </Button>
          )}
          
          <Button variant="ghost" asChild className="mt-2 w-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            <Link href="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
