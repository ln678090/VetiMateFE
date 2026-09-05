'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, PawPrint, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks/use-mounted';
import { APP } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

const NAV_LINKS = [
  { label: 'Cửa hàng', href: '/shop' },
  { label: 'Dịch vụ', href: '/booking' },
  { label: 'Về chúng tôi', href: '/#about' },
  { label: 'Liên hệ', href: '/#contact' },
];

export function LandingHeader() {
  const mounted = useMounted();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const cartItems = useCartStore((s) => s.items);

  const totalCartItems = mounted
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const showAuthed = mounted && !isHydrating && isAuthenticated;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-md shadow-rose-200/50 dark:shadow-rose-500/20">
            <PawPrint className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
            {APP.name}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Cart Icon Button */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Giỏ hàng"
          >
            <Link href="/cart">
              <ShoppingCart className="size-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </span>
              )}
            </Link>
          </Button>

          {/* Auth Buttons */}
          {showAuthed ? (
            <Button
              asChild
              className="bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25"
            >
              <Link href="/dashboard">Vào Dashboard</Link>
            </Button>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25"
              >
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-zinc-200/80 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 flex flex-col gap-2 border-t pt-3 dark:border-zinc-800">
                {showAuthed ? (
                  <Button asChild className="w-full bg-gradient-to-br from-rose-500 to-amber-500 text-white">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Vào Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Đăng nhập
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-br from-rose-500 to-amber-500 text-white">
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Đăng ký tài khoản
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
