'use client';

import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { APP } from '@/lib/constants';
import { STAFF_NAV } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function StaffSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 sticky top-0 border-r border-zinc-200/70 bg-white/70 backdrop-blur-xl lg:flex lg:flex-col dark:border-zinc-800/60 dark:bg-zinc-950/60">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200/70 px-5 dark:border-zinc-800/60">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-500/20">
          <Store className="h-5 w-5" strokeWidth={2.4} />
        </span>
        <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
          {APP.name} Staff
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {STAFF_NAV.map((item, idx) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.05 + idx * 0.04,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-gradient-to-br from-indigo-500/10 to-blue-500/10 text-indigo-700 dark:from-indigo-500/20 dark:to-blue-500/10 dark:text-indigo-300'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active-staff"
                      className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-blue-400"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      active ? 'text-indigo-600 dark:text-indigo-400' : ''
                    )}
                    strokeWidth={2}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
