'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';

import { ProductDetailSkeleton } from '@/features/shop/components/ProductDetailSkeleton';
import { ProductGallery } from '@/features/shop/components/ProductGallery';
import { ProductInfo } from '@/features/shop/components/ProductInfo';
import { ProductTabs } from '@/features/shop/components/ProductTabs';
import { RelatedProducts } from '@/features/shop/components/RelatedProducts';
import {
  useProduct,
  useRelatedProducts,
} from '@/features/shop/hooks/use-products';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Next.js 16: params là Promise → dùng `use()` để unwrap trong Client Component
  const { slug } = use(params);

  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: related, isLoading: isLoadingRelated } = useRelatedProducts(
    slug,
    product?.categoryId
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-100/60 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-100/60 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        {/* ── Breadcrumb ── */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500"
        >
          <Link
            href="/"
            className="transition hover:text-rose-600 dark:hover:text-rose-400"
          >
            Trang chủ
          </Link>
          <ChevronRight
            className="h-3 w-3 text-zinc-400 dark:text-zinc-600"
            strokeWidth={2}
          />
          <Link
            href="/shop"
            className="transition hover:text-rose-600 dark:hover:text-rose-400"
          >
            Cửa hàng
          </Link>
          <ChevronRight
            className="h-3 w-3 text-zinc-400 dark:text-zinc-600"
            strokeWidth={2}
          />
          <Link
            href={`/shop/category/${product.categorySlug}`}
            className="transition hover:text-rose-600 dark:hover:text-rose-400"
          >
            {product.categoryName}
          </Link>
          <ChevronRight
            className="h-3 w-3 text-zinc-400 dark:text-zinc-600"
            strokeWidth={2}
          />
          <span className="truncate text-zinc-800 dark:text-zinc-300">
            {product.name}
          </span>
        </nav>

        {/* ── Main Card: Gallery + Info ── */}
        <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,480px)_1fr]">
            {/* Gallery - left side */}
            <div className="border-b border-zinc-200/70 p-5 md:border-r md:border-b-0 dark:border-zinc-800/60">
              <ProductGallery
                images={[
                  product.imageUrl,
                  product.imageUrl,
                  product.imageUrl,
                  product.imageUrl,
                  product.imageUrl,
                ]}
                alt={product.name}
              />
            </div>

            {/* Info - right side */}
            <div className="p-5 md:p-6">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* ── Stacked Sections: Specs + Description + Reviews ── */}
        <div className="mt-4">
          <ProductTabs product={product} />
        </div>

        {/* ── Related Products ── */}
        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <RelatedProducts products={related} isLoading={isLoadingRelated} />
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
