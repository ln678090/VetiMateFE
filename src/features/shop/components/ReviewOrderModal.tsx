'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { OrderItem } from '@/types/order';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ReviewProductState {
  productId: string;
  rating: number;
  comment: string;
  hoveredRating: number;
}

interface ReviewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviews: { productId: string; rating: number; comment: string }[]) => void;
  isSubmitting?: boolean;
  items: OrderItem[];
}

export function ReviewOrderModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  items,
}: ReviewOrderModalProps) {
  const [reviews, setReviews] = useState<ReviewProductState[]>([]);

  useEffect(() => {
    if (isOpen && items) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReviews(
        items.map((item) => ({
          productId: item.productId,
          rating: 5,
          comment: '',
          hoveredRating: 0,
        }))
      );
    }
  }, [isOpen, items]);

  const updateReview = (index: number, updates: Partial<ReviewProductState>) => {
    setReviews((prev) => {
      const newReviews = [...prev];
      newReviews[index] = { ...newReviews[index], ...updates };
      return newReviews;
    });
  };

  const handleSubmit = () => {
    onSubmit(reviews.map(({ productId, rating, comment }) => ({ productId, rating, comment })));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle>Đánh giá đơn hàng</DialogTitle>
            <DialogDescription>
              Hãy để lại đánh giá của bạn cho từng sản phẩm để nhận ngay 50 điểm thưởng!
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="flex flex-col gap-6 pb-6">
            {items.map((item, index) => (
              <div key={item.id} className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-zinc-200">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-2">{item.productName}</h4>
                    <p className="text-xs text-zinc-500 mt-1">Phân loại: Mặc định</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => updateReview(index, { hoveredRating: star })}
                        onMouseLeave={() => updateReview(index, { hoveredRating: 0 })}
                        onClick={() => updateReview(index, { rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110 p-1"
                      >
                        <Star
                          className={cn(
                            'h-8 w-8',
                            (
                              reviews[index]?.hoveredRating
                                ? star <= reviews[index]?.hoveredRating
                                : star <= reviews[index]?.rating
                            )
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    {reviews[index]?.rating === 1 && 'Rất không hài lòng'}
                    {reviews[index]?.rating === 2 && 'Không hài lòng'}
                    {reviews[index]?.rating === 3 && 'Bình thường'}
                    {reviews[index]?.rating === 4 && 'Hài lòng'}
                    {reviews[index]?.rating === 5 && 'Tuyệt vời'}
                  </span>
                </div>

                <Textarea
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                  value={reviews[index]?.comment || ''}
                  onChange={(e) => updateReview(index, { comment: e.target.value })}
                  className="resize-none border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 h-20 text-sm"
                />

                {index < items.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t bg-zinc-50/50 dark:bg-zinc-900/50">
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold"
            >
              Gửi đánh giá & Nhận 50 điểm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
