'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';

// Mock review data - sau swap với BE API
const MOCK_REVIEWS = [
  {
    id: 1,
    user: 'Nguyễn Minh A',
    avatar: 'NA',
    rating: 5,
    date: '2 ngày trước',
    title: 'Pet nhà mình rất thích',
    content:
      'Sản phẩm chất lượng tốt, đóng gói cẩn thận. Bé Mochi nhà mình ăn ngon miệng hơn hẳn từ khi đổi sang loại này.',
    helpful: 24,
  },
  {
    id: 2,
    user: 'Trần Lan B',
    avatar: 'TB',
    rating: 4,
    date: '1 tuần trước',
    title: 'Giao hàng nhanh',
    content: 'Ship cực nhanh, chỉ 3 tiếng đã có. Giá hơi cao một chút nhưng đáng tiền.',
    helpful: 12,
  },
  {
    id: 3,
    user: 'Lê Quang C',
    avatar: 'LC',
    rating: 5,
    date: '2 tuần trước',
    title: 'Sẽ mua lại',
    content:
      'Mua lần thứ 3 rồi, ổn định. Shop tư vấn nhiệt tình, có voucher giảm giá khi đặt qua app.',
    helpful: 8,
  },
];

interface ProductReviewsProps {
  rating: number;
  totalReviews: number;
}

export function ProductReviews({ rating, totalReviews }: ProductReviewsProps) {
  // Tính phân bố star (mock)
  const distribution = [
    { star: 5, pct: 72 },
    { star: 4, pct: 18 },
    { star: 3, pct: 6 },
    { star: 2, pct: 2 },
    { star: 1, pct: 2 },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
      {/* Summary */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-200/70 bg-gradient-to-br from-rose-50/60 to-amber-50/40 p-5 dark:border-zinc-800/60 dark:from-rose-500/5 dark:to-amber-500/5">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-zinc-900 dark:text-white">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-500">/ 5</span>
          </div>
          <div className="mt-2 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < Math.round(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-zinc-300 dark:text-zinc-700'
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Dựa trên {totalReviews} đánh giá
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
        {MOCK_REVIEWS.map((review, idx) => (
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
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">{review.date}</p>
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
        ))}
      </div>
    </div>
  );
}
