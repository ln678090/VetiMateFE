'use client';

import type { Product } from '@/types/shop';
import { PawPrint } from 'lucide-react';

import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductGridSkeleton';

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) return <ProductGridSkeleton count={8} />;

  if (!products || products.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-300 bg-white/60 py-20 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
        <PawPrint className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
        <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
          Không tìm thấy sản phẩm phù hợp
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
          Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} index={idx} />
      ))}
    </div>
  );
}
