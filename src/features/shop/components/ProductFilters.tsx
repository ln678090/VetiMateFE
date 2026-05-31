'use client';

import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useBrands } from '@/features/shop/hooks/use-brands';
import { useCategories } from '@/features/shop/hooks/use-categories';
import type { ProductFilters as Filters, PetType } from '@/types/shop';

interface ProductFiltersProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}

const PET_TYPES: { value: PetType; label: string }[] = [
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
];

const PRICE_RANGES = [
  { label: 'Dưới 200K', min: 0, max: 200000 },
  { label: '200K - 500K', min: 200000, max: 500000 },
  { label: '500K - 1 triệu', min: 500000, max: 1000000 },
  { label: 'Trên 1 triệu', min: 1000000, max: undefined },
];

export function ProductFilters({ filters, onChange, onReset }: ProductFiltersProps) {
  const { data: categories, isLoading: isLoadingCat } = useCategories();
  const { data: brands, isLoading: isLoadingBrand } = useBrands();

  const toggleCategory = (slug: string) => {
    const current = filters.categorySlugs ?? [];
    const next = current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug];
    onChange({ ...filters, categorySlugs: next });
  };

  const toggleBrand = (slug: string) => {
    const current = filters.brandSlugs ?? [];
    const next = current.includes(slug) ? current.filter((b) => b !== slug) : [...current, slug];
    onChange({ ...filters, brandSlugs: next });
  };

  const togglePetType = (pt: PetType) => {
    const current = filters.petTypes ?? [];
    const next = current.includes(pt) ? current.filter((p) => p !== pt) : [...current, pt];
    onChange({ ...filters, petTypes: next });
  };

  const setPriceRange = (min: number, max?: number) => {
    onChange({ ...filters, priceMin: min, priceMax: max });
  };

  const isPriceActive = (min: number, max?: number) =>
    filters.priceMin === min && filters.priceMax === max;

  const activeCount =
    (filters.categorySlugs?.length ?? 0) +
    (filters.brandSlugs?.length ?? 0) +
    (filters.petTypes?.length ?? 0) +
    (filters.priceMin !== undefined ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  // Lấy categories ROOT (không có parent) cho filter
  const rootCategories = categories?.filter((c) => !c.parentId) ?? [];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full space-y-5 rounded-2xl border border-zinc-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className="h-4 w-4 text-zinc-700 dark:text-zinc-300"
            strokeWidth={2.2}
          />
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
            Bộ lọc
          </h3>
          {activeCount > 0 && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onReset}>
            <X className="h-3 w-3" strokeWidth={2.4} />
            Xoá
          </Button>
        )}
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
          Danh mục
        </Label>
        {isLoadingCat ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {rootCategories.map((cat) => (
              <label
                key={cat.slug}
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                <Checkbox
                  checked={filters.categorySlugs?.includes(cat.slug) ?? false}
                  onCheckedChange={() => toggleCategory(cat.slug)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Brand */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
          Thương hiệu
        </Label>
        {isLoadingBrand ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {brands?.map((brand) => (
              <label
                key={brand.slug}
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                <Checkbox
                  checked={filters.brandSlugs?.includes(brand.slug) ?? false}
                  onCheckedChange={() => toggleBrand(brand.slug)}
                />
                {brand.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Pet type */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
          Dành cho
        </Label>
        <div className="space-y-2">
          {PET_TYPES.map((pt) => (
            <label
              key={pt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              <Checkbox
                checked={filters.petTypes?.includes(pt.value) ?? false}
                onCheckedChange={() => togglePetType(pt.value)}
              />
              {pt.label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
          Khoảng giá
        </Label>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const active = isPriceActive(range.min, range.max);
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => setPriceRange(range.min, range.max)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  active
                    ? 'bg-gradient-to-br from-rose-500/10 to-amber-500/10 font-semibold text-rose-700 dark:from-rose-500/20 dark:to-amber-500/10 dark:text-rose-300'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* In stock */}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
        <Checkbox
          checked={filters.inStockOnly ?? false}
          onCheckedChange={(checked) => onChange({ ...filters, inStockOnly: Boolean(checked) })}
        />
        Chỉ hiện hàng còn
      </label>
    </motion.aside>
  );
}
