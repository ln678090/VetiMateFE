'use client';

import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';
import { notificationApi, NotificationDto } from '@/features/notification/api/notification.api';

export function useNotifications() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const authorities = getAuthoritiesFromToken(accessToken);
  const queryClient = useQueryClient();

  const isStaff =
    authorities.includes('ROLE_SHOP_STAFF') ||
    authorities.includes('ROLE_ADMIN') ||
    authorities.includes('ROLE_MANAGER');

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationApi.getNotifications();
      return res.data;
    },
    enabled: !!accessToken,
  });

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await notificationApi.getUnreadCount();
      return res.data;
    },
    enabled: !!accessToken,
    refetchInterval: 60000, // optionally poll every minute
  });

  const unreadCount = unreadData?.count || 0;

  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!accessToken || !user) return;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
    const socketUrl = `${backendUrl}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl) as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // Callback for incoming notifications
        const handleMessage = (message: any) => {
          try {
            const newNotif: NotificationDto = JSON.parse(message.body);
            
            // Update cache
            queryClient.setQueryData<NotificationDto[]>(['notifications'], (old) => {
              return [newNotif, ...(old || [])];
            });
            queryClient.setQueryData<{count: number}>(['notifications', 'unread-count'], (old) => {
              return { count: (old?.count || 0) + 1 };
            });

            // Show toast
            toast.info(newNotif.title, {
              description: newNotif.message,
              action: newNotif.link ? {
                label: 'Xem',
                onClick: () => {
                  window.location.href = newNotif.link;
                }
              } : undefined,
            });
          } catch (e) {
            console.error('Error parsing notification', e);
          }
        };

        // Staff subscribes to shop orders
        if (isStaff) {
          client.subscribe('/topic/shop-orders', handleMessage);
        }

        // Everyone subscribes to their personal notifications
        client.subscribe(`/topic/user-orders-${user.id}`, handleMessage);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [accessToken, user, isStaff, queryClient]);

  const markAsRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    queryClient.setQueryData<NotificationDto[]>(['notifications'], (old) => {
      return old?.map(n => n.id === id ? { ...n, isRead: true } : n) || [];
    });
    queryClient.setQueryData<{count: number}>(['notifications', 'unread-count'], (old) => {
      return { count: Math.max(0, (old?.count || 1) - 1) };
    });
  };

  const markAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    queryClient.setQueryData<NotificationDto[]>(['notifications'], (old) => {
      return old?.map(n => ({ ...n, isRead: true })) || [];
    });
    queryClient.setQueryData<{count: number}>(['notifications', 'unread-count'], () => {
      return { count: 0 };
    });
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead
  };
}
