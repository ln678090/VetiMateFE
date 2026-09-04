'use client';

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
}

export function AppTopbar() {
  const router = useRouter();

  // Placeholder có type rõ ràng.
  // Thay bằng dữ liệu từ Notification API sau.
  const notifications: AppNotification[] = [];

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  function markAllAsRead(): void {
    // Sẽ nối mutation Notification API sau.
  }

  function handleNotificationClick(notification: AppNotification): void {
    if (notification.link && notification.link.startsWith('/')) {
      router.push(notification.link);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6 dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <MobileNav />

      <div className="flex-1" />

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full"
              aria-label="Thông báo"
            >
              <Bell className="h-6 w-6 text-zinc-700 dark:text-zinc-300" strokeWidth={2} />

              {unreadCount > 0 && (
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="max-h-[85vh] w-80 overflow-y-auto p-0">
            <div className="flex items-center justify-between p-4">
              <h4 className="text-sm font-semibold">Thông báo</h4>

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-rose-500 hover:bg-transparent hover:text-rose-600"
                  onClick={(event) => {
                    event.preventDefault();
                    markAllAsRead();
                  }}
                >
                  Đánh dấu đã đọc
                </Button>
              )}
            </div>

            <DropdownMenuSeparator className="m-0" />

            <div className="flex flex-col">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={[
                      'flex cursor-pointer flex-col items-start gap-1 rounded-none',
                      'border-b border-border/50 p-4 last:border-0',
                      !notification.isRead ? 'bg-rose-50/50 dark:bg-rose-500/10' : '',
                    ].join(' ')}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex w-full justify-between gap-2">
                      <span className="text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-100">
                        {notification.title}
                      </span>

                      {!notification.isRead && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                      )}
                    </div>

                    <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {notification.message}
                    </p>

                    <span className="mt-1 text-[10px] text-zinc-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-zinc-500">Không có thông báo nào</div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserMenu />
      </div>
    </header>
  );
}
