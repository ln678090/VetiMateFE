'use client';

import { motion } from 'framer-motion';
import { PawPrint, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks/use-mounted';
import { APP } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

const NAV_LINKS = [
  { label: 'Cửa hàng', href: '/shop' },
  { label: 'Dịch vụ', href: '#services' },
  { label: 'Về chúng tôi', href: '#about' },
  { label: 'Liên hệ', href: '#contact' },
];

export function LandingHeader() {
  const mounted = useMounted();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  // Lấy tổng số loại hàng trong giỏ
  const cartUniqueItems = useCartStore((s) => s.getTotalUniqueItems());

  const showAuthed = mounted && !isHydrating && isAuthenticated;
  const isCartPage = pathname === '/cart';

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-md shadow-rose-200/50 dark:shadow-rose-500/20">
            <PawPrint className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
            {APP.name}
          </span>
          {isCartPage && (
            <span className="ml-2 hidden text-lg font-medium text-zinc-400 md:block">
              | Giỏ Hàng
            </span>
          )}
        </Link>

        {/* Nav Links */}
        {!isCartPage && (
          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          {!isCartPage && (
            <Link
              href="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-zinc-600 transition hover:bg-zinc-100 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-rose-400"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={2.2} />
              {mounted && cartUniqueItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
                  {cartUniqueItems > 99 ? '99+' : cartUniqueItems}
                </span>
              )}
            </Link>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {showAuthed ? (
              <Button
                asChild
                className="bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25"
              >
                <Link href="/dashboard">Vào Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25"
                >
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
