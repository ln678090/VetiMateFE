'use client';

import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks/use-mounted';
import { APP } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth.store';

const NAV_LINKS = [
  { label: 'Cửa hàng', href: '/shop' },
  { label: 'Dịch vụ', href: '#services' },
  { label: 'Về chúng tôi', href: '#about' },
  { label: 'Liên hệ', href: '#contact' },
];

export function LandingHeader() {
  const mounted = useMounted();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  const showAuthed = mounted && !isHydrating && isAuthenticated;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-md shadow-rose-200/50 dark:shadow-rose-500/20">
            <PawPrint className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
            {APP.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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
    </motion.header>
  );
}
