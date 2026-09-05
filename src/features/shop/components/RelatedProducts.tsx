'use client';

import type { Product } from '@/types/shop';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductGridSkeleton';

interface RelatedProductsProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

export function RelatedProducts({ products, isLoading }: RelatedProductsProps) {
  if (isLoading) {
    return (
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Sản phẩm tương tự</h2>
        <ProductGridSkeleton count={4} />
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
      >
        Có thể bạn cũng thích
      </motion.h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((p, idx) => (
          <ProductCard key={p.id} product={p} index={idx} />
        ))}
      </div>
    </section>
  );
}
