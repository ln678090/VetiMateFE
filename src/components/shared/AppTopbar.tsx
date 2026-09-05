'use client';

import Link from 'next/link';
import { Bell, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';
import { NotificationPopover } from '@/features/notification/components/NotificationPopover';
import { useCartStore } from '@/stores/cart.store';
import { useMounted } from '@/hooks/use-mounted';

export function AppTopbar() {
  const mounted = useMounted();
  const totalCartItems = useCartStore((s) => s.getTotalItems());

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6 dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <MobileNav />

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
          strokeWidth={2}
        />
        <Input type="search" placeholder="Tìm sản phẩm, dịch vụ..." className="h-10 pl-10" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Cart Button */}
        <Button asChild variant="ghost" size="icon" className="relative" aria-label="Giỏ hàng">
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            {mounted && totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
                {totalCartItems > 99 ? '99+' : totalCartItems}
              </span>
            )}
          </Link>
        </Button>

        {/* Notifications Popover */}
        <NotificationPopover />

        <UserMenu />
      </div>
    </header>
  );
}
