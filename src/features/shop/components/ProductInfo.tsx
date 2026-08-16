'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn, formatVND } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import type { Product } from '@/types/shop';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const maxQuantity = Math.min(50, product.stockQuantity || 50);

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const clearSelection = useCartStore((s) => s.clearSelection);
  const toggleSelection = useCartStore((s) => s.toggleSelection);

  const soldCount =
    product.reviewCount > 100
      ? `${Math.round(product.reviewCount / 100) / 10}K+`
      : `${product.reviewCount * 3}+`;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.imageUrl,
        stockQuantity: product.stockQuantity,
      },
      quantity
    );
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.imageUrl,
        stockQuantity: product.stockQuantity,
      },
      quantity
    );
    clearSelection();
    toggleSelection(product.id);
    router.push('/checkout');
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description ?? undefined,
          url: window.location.href,
        });
      } catch {
        // user cancel
      }
    } else if (typeof navigator !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép link sản phẩm');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      {/* ── Product Name + Badges ── */}
      <div>
        {(product.isFeatured || product.isNew) && (
          <div className="mb-2 flex items-center gap-2">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                Yêu thích
              </span>
            )}
            {product.isNew && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                Mới
              </span>
            )}
          </div>
        )}
        <h1 className="text-lg font-medium leading-snug text-zinc-900 md:text-xl dark:text-white">
          {product.name}
        </h1>
      </div>

      {/* ── Rating | Reviews | Sold ── */}
      <div className="mt-3 flex flex-wrap items-center gap-0 text-sm">
        {/* Rating */}
        <div className="flex items-center gap-1 pr-3">
          <span className="font-semibold text-rose-600 underline underline-offset-2 dark:text-rose-400">
            {product.rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < Math.round(product.rating)
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-zinc-300 dark:text-zinc-700'
                )}
              />
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

        {/* Reviews */}
        <div className="px-3">
          <span className="font-semibold text-zinc-800 underline underline-offset-2 dark:text-zinc-200">
            {product.reviewCount}
          </span>
          <span className="ml-1 text-zinc-500 dark:text-zinc-500">
            Đánh Giá
          </span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

        {/* Sold */}
        <div className="px-3">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {soldCount}
          </span>
          <span className="ml-1 text-zinc-500 dark:text-zinc-500">Đã Bán</span>
        </div>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="ml-auto flex items-center gap-1 text-zinc-500 transition hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
        >
          <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="text-xs">Chia sẻ</span>
        </button>
      </div>

      {/* ── Price Banner ── */}
      <div className="mt-4 rounded-xl bg-gradient-to-r from-rose-50 via-amber-50/60 to-rose-50/40 px-5 py-4 dark:from-rose-500/10 dark:via-amber-500/5 dark:to-transparent">
        <div className="flex items-center gap-3">
          {hasDiscount && (
            <span className="text-base text-zinc-400 line-through dark:text-zinc-600">
              {formatVND(product.originalPrice!)}
            </span>
          )}
          <span className="text-3xl font-bold text-rose-600 dark:text-rose-400">
            {formatVND(product.price)}
          </span>
          {hasDiscount && (
            <span className="rounded bg-rose-600 px-2 py-0.5 text-xs font-bold text-white uppercase">
              -{discountPct}% Giảm
            </span>
          )}
        </div>
      </div>

      {/* ── Info Rows (Shopee-style label:value rows) ── */}
      <div className="mt-5 space-y-4">
        {/* Shipping */}
        <div className="flex items-start gap-4 text-sm">
          <span className="w-28 shrink-0 text-zinc-500 dark:text-zinc-500">
            Vận Chuyển
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Truck
                className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2}
              />
              <span>Miễn phí ship đơn từ 500K</span>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              Giao trong 2-4h nội thành
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-zinc-100 dark:bg-zinc-800/60" />

        {/* Policies */}
        <div className="flex items-start gap-4 text-sm">
          <span className="w-28 shrink-0 text-zinc-500 dark:text-zinc-500">
            Chính Sách
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <ShieldCheck
                className="h-4 w-4 text-rose-600 dark:text-rose-400"
                strokeWidth={2}
              />
              <span>Hàng chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <RotateCcw
                className="h-4 w-4 text-rose-600 dark:text-rose-400"
                strokeWidth={2}
              />
              <span>Đổi trả trong 7 ngày</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-zinc-100 dark:bg-zinc-800/60" />

        {/* Brand */}
        <div className="flex items-center gap-4 text-sm">
          <span className="w-28 shrink-0 text-zinc-500 dark:text-zinc-500">
            Thương Hiệu
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            {product.brandName}
          </span>
        </div>

        {/* Separator */}
        <div className="h-px bg-zinc-100 dark:bg-zinc-800/60" />

        {/* Quantity */}
        <div className="flex items-center gap-4 text-sm">
          <span className="w-28 shrink-0 text-zinc-500 dark:text-zinc-500">
            Số Lượng
          </span>
          <div className="flex items-center gap-4">
            {/* Quantity stepper - Shopee style */}
            <div className="inline-flex items-center border border-zinc-300 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="grid h-8 w-8 place-items-center text-zinc-600 transition hover:bg-zinc-50 disabled:text-zinc-300 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:disabled:text-zinc-700"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={2.4} />
              </button>
              
              {isEditingQuantity ? (
                <input
                  autoFocus
                  type="number"
                  min={1}
                  max={maxQuantity}
                  value={inputValue}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val !== '') {
                      const parsed = parseInt(val, 10);
                      if (!isNaN(parsed) && parsed > maxQuantity) {
                        val = maxQuantity.toString();
                      }
                    }
                    setInputValue(val);
                  }}
                  onBlur={() => {
                    const val = parseInt(inputValue, 10);
                    if (isNaN(val) || val < 1) {
                      setQuantity(1);
                    } else if (val > maxQuantity) {
                      setQuantity(maxQuantity);
                    } else {
                      setQuantity(val);
                    }
                    setIsEditingQuantity(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  className="h-8 w-12 border-x border-zinc-300 bg-transparent text-center text-sm font-medium tabular-nums text-zinc-900 focus:outline-none dark:border-zinc-700 dark:text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              ) : (
                <span
                  onDoubleClick={() => {
                    setInputValue(quantity.toString());
                    setIsEditingQuantity(true);
                  }}
                  title="Nhấn đúp để nhập số lượng"
                  className="grid h-8 w-12 cursor-text place-items-center border-x border-zinc-300 text-sm font-medium tabular-nums text-zinc-900 dark:border-zinc-700 dark:text-white select-none"
                >
                  {quantity}
                </span>
              )}

              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                disabled={quantity >= maxQuantity}
                className="grid h-8 w-8 place-items-center text-zinc-600 transition hover:bg-zinc-50 disabled:text-zinc-300 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:disabled:text-zinc-700"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
              </button>
            </div>

            {/* Stock status */}
            <span
              className={cn(
                'text-sm',
                product.inStock
                  ? 'text-zinc-500 dark:text-zinc-500'
                  : 'font-medium text-red-500'
              )}
            >
              {product.inStock
                ? `${product.stockQuantity} sản phẩm có sẵn`
                : 'Tạm hết hàng'}
            </span>
          </div>
        </div>
      </div>

      {/* ── CTA Buttons (Shopee dual-button) ── */}
      <div className="mt-6 flex items-center gap-3">
        <Button
          size="lg"
          variant="outline"
          disabled={!product.inStock}
          onClick={handleAddToCart}
          className="h-12 flex-1 border-rose-600 text-rose-600 transition hover:bg-rose-50 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          <ShoppingCart className="mr-2 h-4 w-4" strokeWidth={2.2} />
          Thêm Vào Giỏ Hàng
        </Button>
        <Button
          size="lg"
          disabled={!product.inStock}
          onClick={handleBuyNow}
          className="h-12 flex-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 transition hover:shadow-xl hover:shadow-rose-500/40"
        >
          <Zap className="mr-2 h-4 w-4" strokeWidth={2.2} />
          Mua Ngay
        </Button>
        <button
          type="button"
          onClick={() => setWished((w) => !w)}
          className={cn(
            'grid h-12 w-12 shrink-0 place-items-center rounded-md border transition',
            wished
              ? 'border-rose-500/50 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
              : 'border-zinc-200 text-zinc-400 hover:border-rose-300 hover:text-rose-500 dark:border-zinc-800 dark:text-zinc-600 dark:hover:border-rose-700 dark:hover:text-rose-400'
          )}
          aria-label="Yêu thích"
        >
          <Heart
            className={cn('h-5 w-5', wished && 'fill-rose-500')}
            strokeWidth={2}
          />
        </button>
      </div>
    </motion.div>
  );
}
