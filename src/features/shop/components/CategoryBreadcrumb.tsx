'use client';

import type { Category } from '@/types/catalog';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface CategoryBreadcrumbProps {
  category: Category;
}

export function CategoryBreadcrumb({ category }: CategoryBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-zinc-500 transition hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
      >
        <Home className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="sr-only">Trang chủ</span>
      </Link>
      <ChevronRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" strokeWidth={2} />
      <Link
        href="/shop"
        className="text-zinc-500 transition hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
      >
        Cửa hàng
      </Link>
      <ChevronRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" strokeWidth={2} />
      <span className="font-semibold text-zinc-900 dark:text-white">{category.name}</span>
    </nav>
  );
}
