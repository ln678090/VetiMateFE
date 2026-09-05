export type NotificationType =
  | 'GENERAL'
  | 'CLINICAL_ALERT'
  | 'SLA_WARNING'
  | 'WALK_IN'
  | 'APPOINTMENT'
  | 'MEDICATION'
  | 'SYSTEM'
  | 'ORDER';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  notificationType: NotificationType;
  linkUrl?: string | null;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationPage {
  content: AppNotification[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
