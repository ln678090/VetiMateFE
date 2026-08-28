'use client';

import { Button } from '@/components/ui/button';

import { Bell } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6 dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <MobileNav />

      <div className="flex-1"></div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" aria-label="Thông báo">
          <Bell className="h-5 w-5" strokeWidth={2} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
