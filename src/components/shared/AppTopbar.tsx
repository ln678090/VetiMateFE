'use client';

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Bell, LoaderCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Skeleton } from '@/components/ui/skeleton';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from '@/features/notifications/hooks/use-notifications';

import type { NotificationDto } from '@/features/notifications/types/notification';

const NOTIFICATION_LIMIT = 20;

function isSafeInternalLink(link: string | null): link is string {
  return Boolean(link && link.startsWith('/') && !link.startsWith('//') && !link.includes('\\'));
}

function formatNotificationTime(createdAt: string): string {
  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return '';
  }

  return formatDistanceToNow(createdDate, {
    addSuffix: true,
    locale: vi,
  });
}

function NotificationSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2 border-b border-border/50 pb-3 last:border-0">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function AppTopbar() {
  const router = useRouter();
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const notificationQuery = useNotifications(isNotificationOpen);

  const unreadCountQuery = useUnreadNotificationCount();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationQuery.data ?? [];
  const unreadCount = unreadCountQuery.data?.unreadCount ?? 0;

  async function handleMarkAllAsRead(): Promise<void> {
    try {
      await markAllReadMutation.mutateAsync();
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
    } catch {
      toast.error('Không thể cập nhật thông báo');
    }
  }

  async function handleNotificationClick(notification: NotificationDto): Promise<void> {
    try {
      if (!notification.isRead) {
        await markReadMutation.mutateAsync(notification.id);
      }

      setNotificationOpen(false);

      if (isSafeInternalLink(notification.link)) {
        router.push(notification.link);
      }
    } catch {
      toast.error('Không thể đánh dấu thông báo là đã đọc');
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6 dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <MobileNav />

      <div className="flex-1" />

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu open={isNotificationOpen} onOpenChange={setNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full"
              aria-label={unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Thông báo'}
            >
              <Bell className="h-6 w-6 text-zinc-700 dark:text-zinc-300" strokeWidth={2} />

              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-zinc-950">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="max-h-[85vh] w-80 overflow-y-auto p-0 sm:w-96"
          >
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <h4 className="text-sm font-semibold">Thông báo</h4>

                {unreadCount > 0 && (
                  <p className="mt-0.5 text-xs text-zinc-500">{unreadCount} thông báo chưa đọc</p>
                )}
              </div>

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={markAllReadMutation.isPending}
                  className="h-auto p-0 text-xs text-rose-500 hover:bg-transparent hover:text-rose-600"
                  onClick={(event) => {
                    event.preventDefault();
                    void handleMarkAllAsRead();
                  }}
                >
                  {markAllReadMutation.isPending && (
                    <LoaderCircle className="mr-1 h-3 w-3 animate-spin" />
                  )}
                  Đánh dấu đã đọc
                </Button>
              )}
            </div>

            <DropdownMenuSeparator className="m-0" />

            {notificationQuery.isPending ? (
              <NotificationSkeleton />
            ) : notificationQuery.isError ? (
              <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
                <p className="text-sm text-zinc-500">Không thể tải thông báo</p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(event) => {
                    event.preventDefault();
                    void notificationQuery.refetch();
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-zinc-500">
                Không có thông báo nào
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    disabled={markReadMutation.isPending}
                    className={[
                      'flex cursor-pointer flex-col items-start gap-1',
                      'rounded-none border-b border-border/50 p-4',
                      'last:border-0 focus:bg-zinc-100',
                      'dark:focus:bg-zinc-900',
                      !notification.isRead ? 'bg-rose-50/50 dark:bg-rose-500/10' : '',
                    ].join(' ')}
                    onSelect={(event) => {
                      event.preventDefault();
                      void handleNotificationClick(notification);
                    }}
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
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <UserMenu />
      </div>
    </header>
  );
}
