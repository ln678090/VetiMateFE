'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { shopService } from '@/services/shop.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ProductReviewsProps {
  slug: string;
  rating: number;
  totalReviews: number;
}

interface Review {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  title?: string;
  content: string;
  helpful: number;
  createdAt: string;
}

export function ProductReviews({ slug, rating, totalReviews }: ProductReviewsProps) {
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['product-reviews', slug],
    queryFn: () => shopService.getProductReviews(slug),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (b.helpful !== a.helpful) return b.helpful - a.helpful;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const actualTotal = reviews.length;
  const actualRating = actualTotal > 0 
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / actualTotal 
    : rating;

  // Tính phân bố star
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const pct = actualTotal > 0 ? Math.round((count / actualTotal) * 100) : 0;
    return { star, pct };
  });

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
      {/* Summary */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-200/70 bg-gradient-to-br from-rose-50/60 to-amber-50/40 p-5 dark:border-zinc-800/60 dark:from-rose-500/5 dark:to-amber-500/5">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-zinc-900 dark:text-white">
              {actualRating.toFixed(1)}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-500">/ 5</span>
          </div>
          <div className="mt-2 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < Math.round(actualRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-zinc-300 dark:text-zinc-700'
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Dựa trên {actualTotal > 0 ? actualTotal : totalReviews} đánh giá
          </p>
        </div>

        {/* Distribution */}
        <div className="space-y-2">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-xs">
              <span className="w-6 text-zinc-700 dark:text-zinc-300">{d.star}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                />
              </div>
              <span className="w-9 text-right text-zinc-500 tabular-nums dark:text-zinc-500">
                {d.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-zinc-500">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          paginatedReviews.map((review, idx) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.4,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-2xl border border-zinc-200/70 bg-white/70 p-5 dark:border-zinc-800/60 dark:bg-zinc-900/40"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-rose-100 dark:ring-rose-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-amber-500 text-xs font-semibold text-white">
                    {review.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {review.user}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3.5 w-3.5',
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-300 dark:text-zinc-700'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {review.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {review.content}
                  </p>
                  <Separator className="my-3" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 px-2 text-xs text-zinc-500 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
                  >
                    <ThumbsUp className="h-3 w-3" strokeWidth={2.2} />
                    Hữu ích ({review.helpful})
                  </Button>
                </div>
              </div>
            </motion.article>
          ))
        )}
        
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6 pb-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="border-zinc-200 dark:border-zinc-800 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Trước đó
            </Button>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="border-zinc-200 dark:border-zinc-800 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Tiếp theo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
