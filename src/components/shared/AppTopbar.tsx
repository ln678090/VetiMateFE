'use client';

import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

export function AppTopbar() {
  const router = useRouter();
  
  const notifications: any[] = [];
  const unreadCount = 0;

  const markAllAsReadMutation = { mutate: () => {} };

  const handleNotificationClick = (n: any) => {
    if (n.link) {
      router.push(n.link);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6 dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <MobileNav />

      <div className="flex-1"></div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full" aria-label="Thông báo">
              <Bell className="h-6 w-6 text-zinc-700 dark:text-zinc-300" strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[85vh] overflow-y-auto p-0">
            <div className="flex items-center justify-between p-4">
              <h4 className="font-semibold text-sm">Thông báo</h4>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-rose-500 hover:text-rose-600 hover:bg-transparent" onClick={(e) => {
                  e.preventDefault();
                  markAllAsReadMutation.mutate();
                }}>
                  Đánh dấu đã đọc
                </Button>
              )}
            </div>
            <DropdownMenuSeparator className="m-0" />
            <div className="flex flex-col">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <DropdownMenuItem 
                    key={n.id} 
                    className={`flex flex-col items-start gap-1 p-4 cursor-pointer rounded-none border-b border-border/50 last:border-0 ${!n.isRead ? 'bg-rose-50/50 dark:bg-rose-500/10' : ''}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="flex w-full justify-between gap-2">
                      <span className="font-medium text-sm leading-tight text-zinc-900 dark:text-zinc-100">{n.title}</span>
                      {!n.isRead && <span className="h-2 w-2 mt-1 rounded-full bg-rose-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-zinc-400 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-zinc-500">
                  Không có thông báo nào
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserMenu />
      </div>
    </header>
  );
}
