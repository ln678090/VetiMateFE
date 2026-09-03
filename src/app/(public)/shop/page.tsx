'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CategoryTree } from '@/features/shop/components/CategoryTree';
import { ProductFilters } from '@/features/shop/components/ProductFilters';
import { ProductGrid } from '@/features/shop/components/ProductGrid';
import { ProductSearch } from '@/features/shop/components/ProductSearch';
import { ProductSort } from '@/features/shop/components/ProductSort';
import { useProducts } from '@/features/shop/hooks/use-products';
import type { ProductFilters as Filters } from '@/types/shop';

const INITIAL_FILTERS: Filters = {
  sort: 'featured',
  page: 0,
  size: 12,
};

export default function ShopPage() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const { data, isLoading } = useProducts(filters);

  const headerStats = useMemo(() => {
    if (isLoading) return 'Đang tải...';
    return `${data?.total ?? 0} sản phẩm`;
  }, [data, isLoading]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
          Cửa hàng
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Thức ăn, đồ chơi, cát vệ sinh và phụ kiện chính hãng cho chó mèo.
        </p>
      </motion.div>

      {/* Top bar: search + sort */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <ProductSearch
            value={filters.search ?? ''}
            onChange={(val) => setFilters((f) => ({ ...f, search: val, page: 0 }))}
          />
        </div>
        <ProductSort
          value={filters.sort ?? 'featured'}
          onChange={(val) => setFilters((f) => ({ ...f, sort: val, page: 0 }))}
        />
      </div>

      {/* Layout: sidebar (CategoryTree + Filters) + grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          {/* Category tree từ BE */}
          <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <h3 className="mb-3 px-1 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
              Danh mục
            </h3>
            <CategoryTree />
          </div>

          {/* Filter checkbox + price range */}
          <ProductFilters
            filters={filters}
            onChange={(next) => setFilters({ ...next, page: 0 })}
            onReset={() =>
              setFilters({
                sort: filters.sort,
                search: filters.search,
                page: 0,
                size: 12,
              })
            }
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{headerStats}</p>
          </div>

          <ProductGrid products={data?.items} isLoading={isLoading} />

          {/* Pagination Controls */}
          {!isLoading && data && (data.totalPages ?? 0) > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={(data.page ?? 0) === 0}
                onClick={() => {
                  setFilters((f) => ({ ...f, page: Math.max(0, (f.page ?? 0) - 1) }));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Trước
              </Button>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Trang {(data.page ?? 0) + 1} / {data.totalPages ?? 0}
              </span>
              <Button
                variant="outline"
                disabled={(data.page ?? 0) >= (data.totalPages ?? 0) - 1}
                onClick={() => {
                  setFilters((f) => ({ ...f, page: (f.page ?? 0) + 1 }));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
