import { api } from '@/lib/axios';
import type { AppNotification, NotificationPage, UnreadCountResponse } from '@/types/notification';

export interface NotificationQueryParams {
  filter?: string; // 'ALL' | 'UNREAD' | 'CLINICAL_ALERT' | 'APPOINTMENT' | etc.
  page?: number;
  size?: number;
}

export async function getNotifications(params?: NotificationQueryParams): Promise<NotificationPage> {
  const res = await api.get('/api/notifications', {
    params: {
      filter: params?.filter || undefined,
      page: params?.page ?? 0,
      size: params?.size ?? 20,
    },
  });
  const data = res.data?.data ?? res.data;
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
    };
  }
  return data ?? { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 };
}

export async function getUnreadNotificationCount(): Promise<UnreadCountResponse> {
  const res = await api.get('/api/notifications/unread-count');
  const data = res.data?.data ?? res.data;
  return data ?? { unreadCount: 0 };
}

export async function markNotificationAsRead(id: string): Promise<AppNotification> {
  const res = await api.patch(`/api/notifications/${encodeURIComponent(id)}/read`);
  return res.data?.data ?? res.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch('/api/notifications/mark-all-read');
}

export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`/api/notifications/${encodeURIComponent(id)}`);
}
