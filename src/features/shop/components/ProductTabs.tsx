'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@/types/shop';
import { ProductReviews } from './ProductReviews';
import { useQuery } from '@tanstack/react-query';
import { shopService } from '@/services/shop.service';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const { data: reviews = [] } = useQuery({
    queryKey: ['product-reviews', product.slug],
    queryFn: () => shopService.getProductReviews(product.slug),
  });

  const actualReviewCount = reviews.length > 0 ? reviews.length : 0;

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="h-auto w-full justify-start rounded-none border-b border-zinc-200/70 bg-transparent p-0 dark:border-zinc-800/60">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-semibold data-[state=active]:border-rose-500 data-[state=active]:text-rose-600 data-[state=active]:shadow-none dark:data-[state=active]:text-rose-400"
        >
          Mô tả chi tiết
        </TabsTrigger>
        <TabsTrigger
          value="specs"
          className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-semibold data-[state=active]:border-rose-500 data-[state=active]:text-rose-600 data-[state=active]:shadow-none dark:data-[state=active]:text-rose-400"
        >
          Thông số
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-semibold data-[state=active]:border-rose-500 data-[state=active]:text-rose-600 data-[state=active]:shadow-none dark:data-[state=active]:text-rose-400"
        >
          Đánh giá ({actualReviewCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
          <p>{product.description}</p>
          <p className="mt-3">
            Sản phẩm <strong>{product.name}</strong> của thương hiệu{' '}
            <strong>{product.brandName}</strong> được chọn lọc kỹ lưỡng, đảm bảo chất lượng cao cấp
            dành cho thú cưng của bạn. Phù hợp với
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
      </TabsContent>

      <TabsContent value="specs" className="mt-6">
        <div className="overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-800/60">
          <table className="w-full text-sm">
            <tbody>
              {[
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
                { k: 'Mã sản phẩm', v: product.id.toUpperCase() },
              ].map((row, i) => (
                <tr
                  key={row.k}
                  className={i % 2 === 0 ? 'bg-zinc-50/60 dark:bg-zinc-900/40' : 'bg-transparent'}
                >
                  <td className="border-r border-zinc-200/70 px-4 py-3 font-medium text-zinc-700 dark:border-zinc-800/60 dark:text-zinc-300">
                    {row.k}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 capitalize dark:text-zinc-400">{row.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <ProductReviews
          slug={product.slug}
          rating={product.rating}
          totalReviews={product.reviewCount}
        />
      </TabsContent>
    </Tabs>
  );
}
