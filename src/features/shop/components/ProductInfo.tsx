'use client';

import { motion } from 'framer-motion';
import { Heart, RotateCcw, Share2, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, formatVND } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import type { Product } from '@/types/shop';
import { QuantityStepper } from './QuantityStepper';
import { userService } from '@/services/user.service';
import { useQueryClient, useQuery } from '@tanstack/react-query';

interface ProductInfoProps {
  product: Product;
}

const TRUST_BADGES = [
  { icon: Truck, label: 'Miễn phí ship đơn từ 500K' },
  { icon: ShieldCheck, label: 'Hàng chính hãng 100%' },
  { icon: RotateCcw, label: 'Đổi trả trong 7 ngày' },
];

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const { data: isFavorited } = useQuery({
    queryKey: ['favorite-status', product?.id],
    queryFn: () => userService.checkFavorite(product.id),
    enabled: !!product?.id,
  });

  const [wished, setWished] = useState(false);

  useEffect(() => {
    if (isFavorited !== undefined) {
      setWished(isFavorited);
    }
  }, [isFavorited]);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  useEffect(() => {
    // Record view in the background
    if (product?.id) {
      userService.recordView(product.id).catch(() => {});
    }
  }, [product?.id]);

  const addItem = useCartStore((s) => s.addItem);
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
    try {
      await userService.toggleFavorite(product.id);
      setWished((w) => !w);
      queryClient.invalidateQueries({ queryKey: ['favorite-status', product.id] });
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
      toast.success(wished ? 'Đã bỏ yêu thích' : 'Đã thêm vào danh sách yêu thích');
    } catch (error) {
      toast.error('Vui lòng đăng nhập để yêu thích sản phẩm');
    }
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
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-4 w-4',
                i < Math.round(product.rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-300 dark:text-zinc-700'
              )}
            />
          ))}
          <span className="ml-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            ({product.reviewCount} đánh giá)
          </span>
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
              {formatVND(product.originalPrice!)}
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

      {/* Quantity + Add to cart */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
            Số lượng <span className="ml-1 text-zinc-500 font-normal normal-case">(Còn {product.stockQuantity} sản phẩm)</span>
          </p>
          <QuantityStepper value={quantity} onChange={setQuantity} max={product.stockQuantity} />
        </div>
      </div>

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
          onClick={handleToggleFavorite}
          className={cn(
            'h-12 transition',
            wished
              ? 'border-rose-500/50 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400'
              : ''
          )}
          aria-label="Yêu thích"
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
