export interface NotificationDto {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadNotificationCountDto {
  unreadCount: number;
}
