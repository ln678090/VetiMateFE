'use client';

import { useState } from 'react';
import { Store, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn, formatVND } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import { Order, OrderStatus } from '@/types/order';
import { ProductCardCompat } from '@/types/shop';
import { CustomerOrderDetailsModal } from './CustomerOrderDetailsModal';
import { CancelOrderRequestModal } from './CancelOrderRequestModal';

const STATUS_MAP: Record<OrderStatus, { label: string; colorClass: string }> = {
  PENDING: { label: 'CHỜ XÁC NHẬN', colorClass: 'text-amber-500' },
  CONFIRMED: { label: 'ĐANG XỬ LÝ', colorClass: 'text-blue-500' },
  SHIPPING: { label: 'ĐANG GIAO', colorClass: 'text-indigo-500' },
  DELIVERED: { label: 'ĐÃ GIAO', colorClass: 'text-emerald-500' },
  CANCELLED: { label: 'ĐÃ HỦY', colorClass: 'text-rose-500' },
};

interface OrderCardProps {
  order: Order;
  onCancelOrder?: (orderId: string, reason: string) => void;
}

export function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const statusInfo = STATUS_MAP[order.status];
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);
  const hasCancelRequest = order.note?.includes('[CANCEL_REQUEST]:');

  const handleBuyAgain = () => {
    // Add all items from this order to the cart
    order.items.forEach((item) => {
      const mockProduct: ProductCardCompat = {
        id: item.productId,
        name: item.productName,
        price: item.price,
        image: item.productImage,
        imageUrl: item.productImage,
        stockQuantity: 100, // Fallback since we don't know the exact stock
        brand: 'PetCare',
        brandName: 'PetCare',
        category: 'pet-supplies',
        categoryName: 'Pet Supplies',
        categorySlug: 'pet-supplies',
        brandId: 'b1',
        brandSlug: 'petcare',
        categoryId: 'c1',
        inStock: true,
        isFeatured: false,
        isNew: false,
        petType: 'both',
        rating: 5,
        reviewCount: 1,
        slug: item.productId,
      };

      addItem(mockProduct, item.quantity);
    });

    toast.success('Đã thêm sản phẩm vào giỏ hàng', {
      description: 'Chuyển hướng đến giỏ hàng...',
    });

    router.push('/cart');
  };

  const handleCancelOrder = (reason: string) => {
    if (onCancelOrder) {
      onCancelOrder(order.id, reason);
      setIsCancelDialogOpen(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100/80 bg-zinc-50/50 p-5 dark:border-zinc-800/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <Store className="h-4 w-4" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-white">PetCare Vet Shop</span>
          <Button variant="secondary" size="sm" onClick={() => setIsDetailsOpen(true)} className="ml-2 h-7 rounded-full px-3 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-400">
            Xem chi tiết
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          {order.status === 'SHIPPING' && (
            <span className="hidden items-center gap-1 text-emerald-600 sm:flex">
              <Truck className="h-4 w-4" /> Đơn hàng đang được giao đến bạn
            </span>
          )}
          <span className={cn('rounded-full px-3 py-1 text-xs font-bold tracking-wider',
            order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500' :
              order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500' :
                order.status === 'SHIPPING' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-500' :
                  order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-500' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-500'
          )}>
            {statusInfo.label}
          </span>
          {hasCancelRequest && order.status !== 'CANCELLED' && (
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold tracking-wider text-rose-500 dark:bg-rose-500/10 dark:text-rose-400">
              ĐANG YÊU CẦU HỦY
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <ul className="space-y-5">
          {(isItemsExpanded ? order.items : order.items.slice(0, 2)).map((item) => (
            <li key={item.id} className="flex gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized />
              </div>
              <div className="flex flex-1 flex-col justify-start py-1">
                <h4 className="line-clamp-2 text-base font-bold text-zinc-900 dark:text-white">
                  {item.productName}
                </h4>
                <p className="mt-1.5 text-xs font-medium tracking-wider text-zinc-500 uppercase">Phân loại: Mặc định</p>
                <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">x{item.quantity}</p>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-base font-bold text-rose-500">
                  {formatVND(item.price)}
                </span>
              </div>
            </li>
          ))}
        </ul>
        
        {order.items.length > 2 && (
          <div className="mt-4 flex justify-center border-t border-zinc-100 pt-4 dark:border-zinc-800/50">
            <button
              type="button"
              onClick={() => setIsItemsExpanded(!isItemsExpanded)}
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-rose-500 transition-colors dark:text-zinc-400 dark:hover:text-rose-400"
            >
              {isItemsExpanded ? 'Thu gọn' : `Xem thêm ${order.items.length - 2} sản phẩm`}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn('h-4 w-4 transition-transform duration-200', isItemsExpanded && 'rotate-180')}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <Separator />

      {/* Footer: Total & Actions */}
      <div className="flex flex-col items-end bg-zinc-50/80 p-5 dark:bg-zinc-900/30">
        <div className="mb-5 flex items-center gap-3">
          <span className="text-base font-medium text-zinc-600 dark:text-zinc-400">Thành tiền:</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatVND(order.finalAmount)}
          </span>
        </div>

        <div className="flex gap-3">
          {order.status === 'PENDING' && !hasCancelRequest && (
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(true)}
              className="h-10 rounded-xl border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300"
            >
              Hủy Đơn Hàng
            </Button>
          )}
          {order.status === 'DELIVERED' && (
            <Button
              onClick={handleBuyAgain}
              className="h-10 rounded-xl bg-rose-500 font-bold text-white shadow-md shadow-rose-500/20 hover:bg-rose-600"
            >
              Mua Lại
            </Button>
          )}

        </div>
      </div>

      <CustomerOrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        order={order}
        onOpenCancelDialog={() => setIsCancelDialogOpen(true)}
      />

      <CancelOrderRequestModal
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onSubmit={handleCancelOrder}
      />
    </div>
  );
}
