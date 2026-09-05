'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Stethoscope,
  Calendar,
  PackageCheck,
  Sparkles,
  ExternalLink,
  BellOff,
  UserPlus,
  LoaderCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '../hooks/use-notifications';
import type { AppNotification, NotificationType } from '@/types/notification';

type FilterTab = 'ALL' | 'UNREAD' | 'CLINICAL' | 'APPOINTMENT';

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return [
      String(date.getDate()).padStart(2, '0'),
      String(date.getMonth() + 1).padStart(2, '0'),
      date.getFullYear(),
    ].join('/');
  } catch {
    return dateString;
  }
}

function getNotificationMeta(type: NotificationType) {
  switch (type) {
    case 'CLINICAL_ALERT':
      return {
        icon: ShieldAlert,
        bg: 'bg-red-500/10 text-red-600 dark:bg-red-950/40 dark:text-red-400',
        badge: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300',
        label: 'Cảnh báo lâm sàng',
      };
    case 'SLA_WARNING':
      return {
        icon: Clock,
        bg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
        badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
        label: 'Nhắc nhở SLA',
      };
    case 'WALK_IN':
      return {
        icon: UserPlus,
        bg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300',
        label: 'Tiếp nhận Walk-in',
      };
    case 'APPOINTMENT':
      return {
        icon: Calendar,
        bg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
        badge: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
        label: 'Lịch hẹn',
      };
    case 'ORDER':
      return {
        icon: PackageCheck,
        bg: 'bg-purple-500/10 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
        badge: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
        label: 'Đơn hàng',
      };
    default:
      return {
        icon: Sparkles,
        bg: 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
        badge: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300',
        label: 'Thông báo',
      };
  }
}

export function NotificationPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Queries & Mutations
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const notificationsQuery = useNotifications();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const allNotifications = notificationsQuery.data?.content ?? [];

  // Filter items based on activeTab
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'UNREAD') {
      return allNotifications.filter((n) => !n.read);
    }
    if (activeTab === 'CLINICAL') {
      return allNotifications.filter(
        (n) => n.notificationType === 'CLINICAL_ALERT' || n.notificationType === 'SLA_WARNING'
      );
    }
    if (activeTab === 'APPOINTMENT') {
      return allNotifications.filter(
        (n) => n.notificationType === 'APPOINTMENT' || n.notificationType === 'WALK_IN'
      );
    }
    return allNotifications;
  }, [allNotifications, activeTab]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (notification: AppNotification) => {
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.linkUrl) {
      setIsOpen(false);
      router.push(notification.linkUrl);
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllReadMutation.mutate();
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative transition-colors ${
          isOpen ? 'bg-zinc-100 text-rose-600 dark:bg-zinc-800' : ''
        }`}
        aria-label="Thông báo"
      >
        <Bell className="h-5 w-5" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white shadow-md shadow-rose-600/40 ring-2 ring-white dark:ring-zinc-950 animate-in zoom-in">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-12 z-50 flex w-[90vw] max-w-sm sm:max-w-md flex-col rounded-3xl border border-zinc-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    Thông báo
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:bg-rose-500/20">
                        {unreadCount} mới
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={markAllReadMutation.isPending}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <CheckCheck className="size-3.5" />
                  Đọc tất cả
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 border-b border-zinc-100 px-3 py-2 text-xs dark:border-zinc-800/80 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                  activeTab === 'ALL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                Tất cả ({allNotifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('UNREAD')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                  activeTab === 'UNREAD'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('CLINICAL')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                  activeTab === 'CLINICAL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                🚨 Y tế
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('APPOINTMENT')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                  activeTab === 'APPOINTMENT'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                📅 Lịch khám
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {notificationsQuery.isLoading && (
                <div className="flex flex-col items-center justify-center p-8 text-zinc-400 space-y-2">
                  <LoaderCircle className="size-6 animate-spin text-rose-500" />
                  <p className="text-xs">Đang tải thông báo...</p>
                </div>
              )}

              {!notificationsQuery.isLoading && filteredNotifications.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                    <BellOff className="size-6" />
                  </div>
                  <p className="mt-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Không có thông báo nào
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Bạn đã cập nhật mọi thông tin mới nhất.
                  </p>
                </div>
              )}

              {!notificationsQuery.isLoading &&
                filteredNotifications.map((n) => {
                  const meta = getNotificationMeta(n.notificationType);
                  const Icon = meta.icon;

                  return (
                    <article
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={`group relative flex items-start gap-3 p-3.5 transition-all cursor-pointer ${
                        !n.read
                          ? 'bg-rose-500/5 hover:bg-rose-500/10 dark:bg-rose-500/10 dark:hover:bg-rose-500/15'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}
                      >
                        <Icon className="size-4.5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-xs leading-snug line-clamp-2 ${
                              !n.read
                                ? 'font-black text-zinc-900 dark:text-white'
                                : 'font-semibold text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {n.title}
                          </h4>

                          {!n.read && (
                            <span className="size-2 rounded-full bg-rose-600 shrink-0 ring-2 ring-rose-300" />
                          )}
                        </div>

                        <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {n.body}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                          <span>{formatRelativeTime(n.createdAt)}</span>

                          {/* Action icons on hover */}
                          <div
                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {!n.read && (
                              <button
                                type="button"
                                title="Đánh dấu đã đọc"
                                onClick={() => markReadMutation.mutate(n.id)}
                                className="rounded-md p-1 hover:bg-zinc-200 text-zinc-500 dark:hover:bg-zinc-700"
                              >
                                <Check className="size-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              title="Xóa thông báo"
                              onClick={() => deleteMutation.mutate(n.id)}
                              className="rounded-md p-1 hover:bg-red-100 text-red-500 dark:hover:bg-red-950/40"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-100 bg-zinc-50/70 p-2.5 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <Link
                href="/doctor/examinations"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
              >
                Xem quản lý khám bệnh & phác đồ
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
