import { CheckCircle2, ListOrdered, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <h1 className="mb-4 text-3xl font-black text-zinc-900 dark:text-white sm:text-4xl">
        Đặt hàng thành công!
      </h1>

      <p className="mb-10 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Cảm ơn bạn đã mua sắm tại PetCare Vet Shop. Đơn hàng của bạn đang được xử lý và sẽ sớm được
        giao đến bạn.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg" className="h-12 rounded-xl px-8 font-bold">
          <Link href="/profile/orders">
            <ListOrdered className="mr-2 h-5 w-5" />
            Theo dõi đơn hàng
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 rounded-xl border-zinc-200 px-8 font-bold dark:border-zinc-800"
        >
          <Link href="/shop">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Tiếp tục mua sắm
          </Link>
        </Button>
      </div>
    </div>
  );
}
