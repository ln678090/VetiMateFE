'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { CheckoutForm } from '@/features/shop/components/CheckoutForm';
import { useMounted } from '@/hooks/use-mounted';
import { useCartStore } from '@/stores/cart.store';

export default function CheckoutPage() {
  const mounted = useMounted();
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4 rounded-3xl border border-zinc-200/50 bg-white/50 text-center shadow-sm backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/50">
          <div className="rounded-full bg-rose-100 p-4 dark:bg-rose-900/20">
            <ShoppingBag className="h-10 w-10 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán nhé.
            </p>
          </div>
          <Button asChild className="mt-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white">
            <Link href="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50/50 pb-24 pt-8 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-10 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-12 w-12 rounded-full bg-white shadow-sm hover:bg-zinc-50 hover:shadow dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                Thanh Toán
              </h1>
              <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                Vui lòng kiểm tra lại thông tin trước khi đặt hàng
              </p>
            </div>
          </div>

          <CheckoutForm />
        </motion.div>
      </div>
    </main>
  );
}
