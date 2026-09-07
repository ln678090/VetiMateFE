import { api } from '@/lib/axios';

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getNotifications: () => api.get<NotificationDto[]>('/api/notifications'),
  getUnreadCount: () => api.get<{ count: number }>('/api/notifications/unread-count'),
  markAsRead: (id: string) => api.put(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.put('/api/notifications/read-all'),
};
