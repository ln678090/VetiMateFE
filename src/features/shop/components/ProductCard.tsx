'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatVND } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import type { Product } from '@/types/shop';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all hover:border-rose-300/60 hover:shadow-xl hover:shadow-rose-100/40 dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:hover:border-rose-500/30"
    >
      {/* Badges overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <Badge className="bg-emerald-500 px-2 py-0.5 text-[10px] text-white hover:bg-emerald-500">
            MỚI
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="bg-rose-500 px-2 py-0.5 text-[10px] text-white hover:bg-rose-500">
            -{discountPct}%
          </Badge>
        )}
      </div>

      {/* Out of stock overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-zinc-950/70">
          <span className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
            Hết hàng
          </span>
        </div>
      )}

      {/* Image */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 280px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-500">
          {product.brandName}
        </p>
        <Link
          href={`/shop/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-zinc-900 transition hover:text-rose-600 dark:text-white dark:hover:text-rose-400"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {product.rating.toFixed(1)}
          </span>
          <span>({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
            {formatVND(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through dark:text-zinc-500">
              {formatVND(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <Button
          size="sm"
          disabled={!product.inStock}
          onClick={(e) => {
            e.preventDefault();
            addItem({
              ...product,
              image: product.imageUrl,
              brand: product.brandName,
              category: product.categorySlug,
            });
            toast.success('Đã thêm sản phẩm vào giỏ hàng');
          }}
          className={cn(
            'mt-3 h-9 w-full bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20 transition hover:shadow-lg hover:shadow-rose-500/30'
          )}
        >
          <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.4} />
          Thêm vào giỏ
        </Button>
      </div>
    </motion.article>
  );
}
