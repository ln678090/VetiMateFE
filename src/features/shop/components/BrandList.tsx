'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';
import { useBrands } from '@/features/shop/hooks/use-brands';
import { cn } from '@/lib/utils';

interface BrandListProps {
  selectedSlug?: string;
  onSelect?: (slug: string | null) => void;
  className?: string;
}

export function BrandList({ selectedSlug, onSelect, className }: BrandListProps) {
  const { data, isLoading, isError } = useBrands();

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 gap-2', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-500">Chưa có thương hiệu</p>;
  }

  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {data.map((brand, idx) => {
        const isActive = selectedSlug === brand.slug;
        return (
          <motion.button
            key={brand.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: idx * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={() => onSelect?.(isActive ? null : brand.slug)}
            className={cn(
              'group relative flex items-center justify-center rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-all',
              isActive
                ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                : 'border-zinc-200/70 bg-white/60 text-zinc-700 hover:border-rose-300 hover:bg-rose-50/40 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:border-rose-500/30'
            )}
            title={brand.description ?? brand.name}
          >
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                width={80}
                height={24}
                className="h-6 w-auto object-contain"
                unoptimized
              />
            ) : (
              <span>{brand.name}</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
