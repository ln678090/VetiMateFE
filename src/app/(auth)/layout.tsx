import { ChevronLeft, PawPrint } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { GuestOnly } from '@/components/shared/AuthGuard';
import { APP } from '@/lib/constants';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GuestOnly redirectTo="/dashboard">
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-sky-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Decorative blurred blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-rose-300/40 blur-3xl dark:bg-rose-500/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-500/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/5"
        />

        {/* Brand bar */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
          <Link
            href="/"
            className="group flex items-center gap-2 text-zinc-900 transition hover:opacity-80 dark:text-white"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-400 to-amber-400 text-white shadow-md shadow-rose-200/50 dark:shadow-rose-500/20">
              <PawPrint className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="text-base font-semibold tracking-tight">{APP.name}</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
            Về trang chủ
          </Link>
        </header>

        <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pb-12">
          {children}
        </main>
      </div>
    </GuestOnly>
  );
}
