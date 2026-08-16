'use client';

import { cn } from '@/lib/utils';
import type { Product } from '@/types/shop';
import { motion } from 'framer-motion';
import { ProductReviews } from './ProductReviews';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const specs = [
    { k: 'Thương hiệu', v: product.brandName },
    { k: 'Danh mục', v: product.categoryName },
    {
      k: 'Dành cho',
      v:
        product.petType === 'dog'
          ? 'Chó'
          : product.petType === 'cat'
            ? 'Mèo'
            : 'Chó & Mèo',
    },
    {
      k: 'Tình trạng',
      v: product.inStock ? 'Còn hàng' : 'Hết hàng',
    },
    { k: 'Mã sản phẩm', v: product.id.slice(0, 8).toUpperCase() },
  ];

  return (
    <div className="space-y-4">
      {/* ── CHI TIẾT SẢN PHẨM ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950"
      >
        {/* Section header */}
        <div className="border-b border-zinc-200/70 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 uppercase dark:text-white">
            Chi tiết sản phẩm
          </h2>
        </div>

        <div className="p-6">
          {/* Specs table */}
          <div className="overflow-hidden rounded-lg border border-zinc-200/60 dark:border-zinc-800/50">
            <table className="w-full text-sm">
              <tbody>
                {specs.map((row, i) => (
                  <tr
                    key={row.k}
                    className={
                      i % 2 === 0
                        ? 'bg-zinc-50/60 dark:bg-zinc-900/40'
                        : 'bg-transparent'
                    }
                  >
                    <td className="w-40 border-r border-zinc-200/60 px-4 py-3 text-zinc-500 dark:border-zinc-800/50 dark:text-zinc-500">
                      {row.k}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-800 capitalize dark:text-zinc-200">
                      {row.v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Separator */}
          <div className="my-6 h-px bg-zinc-100 dark:bg-zinc-800/60" />

          {/* Description heading */}
          <h3 className="mb-4 text-base font-bold tracking-tight text-zinc-900 uppercase dark:text-white">
            Mô tả sản phẩm
          </h3>

          {/* Description content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
            <p>{product.description}</p>
            <p className="mt-3">
              Sản phẩm <strong>{product.name}</strong> của thương hiệu{' '}
              <strong>{product.brandName}</strong> được chọn lọc kỹ lưỡng, đảm
              bảo chất lượng cao cấp dành cho thú cưng của bạn. Phù hợp với
              {product.petType === 'dog'
                ? ' các giống chó'
                : product.petType === 'cat'
                  ? ' các giống mèo'
                  : ' cả chó và mèo'}
              .
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>Nguyên liệu chính hãng, nguồn gốc rõ ràng</li>
              <li>An toàn cho thú cưng mọi lứa tuổi</li>
              <li>Đã được kiểm định chất lượng</li>
              <li>Đóng gói cẩn thận, giao hàng nhanh</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ── ĐÁNH GIÁ SẢN PHẨM ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950"
      >
        {/* Section header */}
        <div className="border-b border-zinc-200/70 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 uppercase dark:text-white">
            Đánh giá sản phẩm
          </h2>
        </div>

        <div className="p-6">
          <ProductReviews
            rating={product.rating}
            totalReviews={product.reviewCount}
          />
        </div>
      </motion.section>
    </div>
  );
}
