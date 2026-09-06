'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';
import { api } from '@/lib/axios';

interface OrderNotification {
  type: string;
  orderId: string;
  orderCode: string;
  totalAmount: string;
}

export function useOrderNotification() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authorities = getAuthoritiesFromToken(accessToken);
  const isShopStaff =
    authorities.includes('ROLE_SHOP_STAFF') ||
    authorities.includes('ROLE_ADMIN') ||
    authorities.includes('ROLE_MANAGER');

  const [pendingCount, setPendingCount] = useState(0);
  const clientRef = useRef<Client | null>(null);

  // Fetch initial pending count
  const fetchPendingCount = useCallback(async () => {
    if (!isShopStaff || !accessToken) return;
    try {
      const res = await api.get<{ count: number }>('/api/orders/pending-count');
      setPendingCount(res.data?.count ?? 0);
    } catch {
      // Silently fail
    }
  }, [isShopStaff, accessToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPendingCount();
  }, [fetchPendingCount]);

  // WebSocket subscription
  useEffect(() => {
    if (!isShopStaff || !accessToken) return;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
    const socketUrl = `${backendUrl}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl) as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        client.subscribe('/topic/shop-orders', (message) => {
          try {
            const data: OrderNotification = JSON.parse(message.body);
            if (data.type === 'NEW_ORDER') {
              setPendingCount((prev) => prev + 1);

              const amount = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(Number(data.totalAmount));

              toast.info(`🛒 Đơn hàng mới: ${data.orderCode}`, {
                description: `Tổng: ${amount}. Nhấn để xem chi tiết.`,
                duration: 10000,
                action: {
                  label: 'Xem',
                  onClick: () => {
                    window.location.href = '/staff/shop/orders';
                  },
                },
              });
            }
          } catch {
            // Ignore parse errors
          }
        });
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
  }, [isShopStaff, accessToken]);

  const resetCount = useCallback(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  return { pendingCount, resetCount };
}
