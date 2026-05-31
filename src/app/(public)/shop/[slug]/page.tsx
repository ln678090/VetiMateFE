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
import { useProduct, useRelatedProducts } from '@/features/shop/hooks/use-products';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Thức ăn',
  toys: 'Đồ chơi',
  litter: 'Cát vệ sinh',
  accessories: 'Phụ kiện',
  grooming: 'Spa & Chăm sóc',
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Next.js 16: params là Promise → dùng `use()` để unwrap trong Client Component
  const { slug } = use(params);

  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: related, isLoading: isLoadingRelated } = useRelatedProducts(
    slug,
    product?.category
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm">
        <Link
          href="/"
          className="text-zinc-500 transition hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
        >
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" strokeWidth={2} />
        <Link
          href="/shop"
          className="text-zinc-500 transition hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
        >
          Cửa hàng
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" strokeWidth={2} />
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" strokeWidth={2} />
        <span className="truncate font-medium text-zinc-900 dark:text-white">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        {/* Gallery - mock 5 ảnh (BE chỉ trả 1 thì duplicate để demo) */}
        <ProductGallery
          images={[product.image, product.image, product.image, product.image, product.image]}
          alt={product.name}
        />

        {/* Info */}
        <ProductInfo product={product} />
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <ProductTabs product={product} />
      </div>

      {/* Related */}
      <RelatedProducts products={related} isLoading={isLoadingRelated} />
    </div>
  );
}
