'use client';

import { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Share2, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, formatVND } from '@/lib/utils';
import { userService } from '@/services/user.service';
import { useCartStore } from '@/stores/cart.store';
import type { Product } from '@/types/shop';

import { QuantityStepper } from './QuantityStepper';

interface ProductInfoProps {
  product: Product;
}

const TRUST_BADGES = [
  {
    icon: Truck,
    label: 'Miễn phí ship đơn từ 500K',
  },
  {
    icon: ShieldCheck,
    label: 'Hàng chính hãng 100%',
  },
  {
    icon: RotateCcw,
    label: 'Đổi trả trong 7 ngày',
  },
] as const;

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);

  const favoriteStatusQueryKey = ['favorite-status', product.id] as const;

  const { data: wished = false } = useQuery({
    queryKey: favoriteStatusQueryKey,
    queryFn: () => userService.checkFavorite(product.id),
    enabled: Boolean(product.id),
  });

  const originalPrice = product.originalPrice;

  useEffect(() => {
    if (isFavorited !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWished(isFavorited);
    }
  }, [isFavorited]);

  const discountPct = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  useEffect(() => {
    if (!product.id) {
      return;
    }

    void userService.recordView(product.id).catch(() => undefined);
  }, [product.id]);

  const handleAddToCart = () => {
    addItem(
      {
        ...product,
        image: product.imageUrl,
        brand: product.brandName,
        category: product.categorySlug,
      },
      quantity
    );

    toast.success(`Đã thêm ${quantity} × ${product.name} vào giỏ`);
  };

  const handleToggleFavorite = async () => {
    if (isTogglingFavorite) {
      return;
    }

    const nextWished = !wished;

    setIsTogglingFavorite(true);

    try {
      await userService.toggleFavorite(product.id);

      queryClient.setQueryData(favoriteStatusQueryKey, nextWished);

      await queryClient.invalidateQueries({
        queryKey: ['my-favorites'],
      });

      toast.success(nextWished ? 'Đã thêm vào danh sách yêu thích' : 'Đã bỏ yêu thích');
    } catch {
      toast.error('Không thể cập nhật yêu thích. Vui lòng đăng nhập và thử lại.');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleShare = async () => {
    if (typeof navigator === 'undefined') {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description ?? undefined,
          url: window.location.href,
        });
      } catch {
        // Người dùng đóng hộp thoại chia sẻ.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);

      toast.success('Đã sao chép link sản phẩm');
    } catch {
      toast.error('Không thể sao chép link sản phẩm');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col gap-5"
    >
      {/* Brand + name */}
      <div>
        <p className="text-xs font-semibold tracking-wider text-rose-600 uppercase dark:text-rose-400">
          {product.brandName}
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          {product.name}
        </h1>
      </div>

      {/* Rating + tags */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                'h-4 w-4',
                index < Math.round(product.rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-300 dark:text-zinc-700'
              )}
            />
          ))}

          <span className="ml-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {product.rating.toFixed(1)}
          </span>

          <span className="text-sm text-zinc-500">({product.reviewCount} đánh giá)</span>
        </div>

        {product.isNew && (
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">MỚI</Badge>
        )}

        {product.isFeatured && (
          <Badge className="bg-amber-500 text-white hover:bg-amber-500">Nổi bật</Badge>
        )}
      </div>

      <Separator />

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-rose-600 md:text-4xl dark:text-rose-400">
          {formatVND(product.price)}
        </span>

        {hasDiscount && (
          <>
            <span className="text-lg text-zinc-400 line-through dark:text-zinc-600">
              {formatVND(originalPrice)}
            </span>

            <Badge className="bg-rose-500 text-white hover:bg-rose-500">-{discountPct}%</Badge>
          </>
        )}
      </div>

      {/* Short description */}
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {product.description}
      </p>

      <Separator />

      {/* Stock status */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex h-2 w-2 rounded-full',
            product.inStock ? 'animate-pulse bg-emerald-500' : 'bg-zinc-400'
          )}
        />

        <span
          className={cn(
            'text-sm font-medium',
            product.inStock ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500'
          )}
        >
          {product.inStock ? 'Còn hàng - giao trong 2-4h' : 'Tạm hết hàng'}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
            Số lượng{' '}
            <span className="ml-1 font-normal text-zinc-500 normal-case">
              (Còn {product.stockQuantity} sản phẩm)
            </span>
          </p>

          <QuantityStepper value={quantity} onChange={setQuantity} max={product.stockQuantity} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          disabled={!product.inStock}
          onClick={handleAddToCart}
          className="h-12 flex-1 bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 transition hover:shadow-xl hover:shadow-rose-500/40"
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2.2} />
          Thêm vào giỏ
        </Button>

        <Button
          size="lg"
          variant="outline"
          disabled={isTogglingFavorite}
          onClick={handleToggleFavorite}
          className={cn(
            'h-12 transition',
            wished &&
              'border-rose-500/50 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400'
          )}
          aria-label={wished ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={wished}
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-rose-500')} strokeWidth={2.2} />
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={handleShare}
          className="h-12"
          aria-label="Chia sẻ"
        >
          <Share2 className="h-4 w-4" strokeWidth={2.2} />
        </Button>
      </div>

      <Separator />

      {/* Trust badges */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TRUST_BADGES.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-xl border border-zinc-200/70 bg-white/60 px-3 py-2 dark:border-zinc-800/60 dark:bg-zinc-900/40"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-rose-500/10 to-amber-500/10 text-rose-600 dark:text-rose-400">
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </span>

              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
