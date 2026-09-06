'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { notificationApi, NotificationDto } from '@/features/notification/api/notification.api';

export function useNotifications() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationApi.getNotifications();
      return res.data;
    },
    enabled: !!accessToken,
    refetchInterval: 15000, // Poll every 15s since websocket is disabled
  });

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await notificationApi.getUnreadCount();
      return res.data;
    },
    enabled: !!accessToken,
    refetchInterval: 15000, // Poll every 15s
  });

  const unreadCount = unreadData?.count || 0;

  const markAsRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    queryClient.setQueryData<NotificationDto[]>(['notifications'], (old) => {
      return old?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) || [];
    });
    queryClient.setQueryData<{ count: number }>(['notifications', 'unread-count'], (old) => {
      return { count: Math.max(0, (old?.count || 1) - 1) };
    });
  };

  const markAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    queryClient.setQueryData<NotificationDto[]>(['notifications'], (old) => {
      return old?.map((n) => ({ ...n, isRead: true })) || [];
    });
    queryClient.setQueryData<{ count: number }>(['notifications', 'unread-count'], () => {
      return { count: 0 };
    });
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
}
