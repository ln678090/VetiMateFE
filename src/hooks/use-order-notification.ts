'use client';

import { useEffect, useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';
import { api } from '@/lib/axios';

export function useOrderNotification() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authorities = getAuthoritiesFromToken(accessToken);
  const isShopStaff =
    authorities.includes('ROLE_SHOP_STAFF') ||
    authorities.includes('ROLE_ADMIN') ||
    authorities.includes('ROLE_MANAGER');

  const [pendingCount, setPendingCount] = useState(0);

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
    fetchPendingCount();

    // Poll every 15 seconds since websocket is removed
    if (!isShopStaff || !accessToken) return;

    const intervalId = setInterval(() => {
      fetchPendingCount();
    }, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchPendingCount, isShopStaff, accessToken]);

  const resetCount = useCallback(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  return { pendingCount, resetCount };
}
