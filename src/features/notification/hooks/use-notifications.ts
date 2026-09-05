import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type NotificationQueryParams,
} from '../api/notification.api';
import type { AppNotification, NotificationPage } from '@/types/notification';

export const NOTIFICATION_QUERY_KEYS = {
  all: ['notifications'] as const,
  list: (params?: NotificationQueryParams) => ['notifications', 'list', params?.filter, params?.page, params?.size] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

export function useNotifications(params?: NotificationQueryParams) {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(params),
    queryFn: () => getNotifications(params),
    staleTime: 10_000,
    refetchInterval: 15_000, // Background polling every 15s
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: getUnreadNotificationCount,
    staleTime: 10_000,
    refetchInterval: 15_000,
    select: (data) => data.unreadCount,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: (updatedNotification) => {
      // Invalidate count & list
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Optimistically set unreadCount to 0
      queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.unreadCount, { unreadCount: 0 });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    },
  });
}
