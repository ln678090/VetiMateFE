'use client';

import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';

import { CategoryBreadcrumb } from '@/features/shop/components/CategoryBreadcrumb';
import { CategoryTree } from '@/features/shop/components/CategoryTree';
import { ProductGrid } from '@/features/shop/components/ProductGrid';
import { ProductSearch } from '@/features/shop/components/ProductSearch';
import { ProductSort } from '@/features/shop/components/ProductSort';
import { useCategory } from '@/features/shop/hooks/use-categories';
import { useProducts } from '@/features/shop/hooks/use-products';
import type { ProductFilters } from '@/types/shop';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Next.js 16: params là Promise → unwrap với use()
  const { slug } = use(params);

  const { data: category, isLoading: isLoadingCategory, isError } = useCategory(slug);

  // Map slug BE → category type FE (vì mock vẫn dùng key cũ)
  const [filters, setFilters] = useState<ProductFilters>({
    sort: 'featured',
    categorySlugs: [slug],
    page: 0,
    size: 12,
  });
  const { data, isLoading } = useProducts(filters);

  if (isLoadingCategory) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-6 h-5 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <div className="h-96 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <CategoryBreadcrumb category={category} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            {category.description}
          </p>
        )}
      </motion.div>

      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <ProductSearch
            value={filters.search ?? ''}
            onChange={(val) => setFilters((f) => ({ ...f, search: val }))}
          />
        </div>
        <ProductSort
          value={filters.sort ?? 'featured'}
          onChange={(val) => setFilters((f) => ({ ...f, sort: val }))}
        />
      </div>

      {/* Layout: sidebar CategoryTree + ProductGrid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside>
          <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <h3 className="mb-3 px-1 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
              Danh mục
            </h3>
            <CategoryTree />
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {isLoading ? 'Đang tải...' : `${data?.total ?? 0} sản phẩm`}
            </p>
          </div>
          <ProductGrid products={data?.items} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
