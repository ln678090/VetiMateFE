import { api } from '@/lib/axios';

import type { NotificationDto, UnreadNotificationCountDto } from '../types/notification';

const NOTIFICATION_BASE_URL = '/api/notifications';

export async function getNotifications(): Promise<NotificationDto[]> {
  const response = await api.get<NotificationDto[]>(NOTIFICATION_BASE_URL);

  return response.data;
}

export async function getUnreadNotificationCount(): Promise<UnreadNotificationCountDto> {
  const response = await api.get<UnreadNotificationCountDto>(
    `${NOTIFICATION_BASE_URL}/unread-count`
  );

  return response.data;
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await api.patch(`${NOTIFICATION_BASE_URL}/${notificationId}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch(`${NOTIFICATION_BASE_URL}/read-all`);
}
