'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Dùng trên các page auth (login/register):
 * - Nếu user đã login → redirect sang fallback (mặc định /dashboard)
 * - Trong lúc đang hydrate (gọi /refresh) → return isChecking=true để hiển thị loader
 */
export function useRedirectIfAuthed(fallback: string = '/dashboard') {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  useEffect(() => {
    if (!isHydrating && isAuthenticated) {
      router.replace(fallback);
    }
  }, [isHydrating, isAuthenticated, router, fallback]);

  // isChecking = true khi: đang hydrate HOẶC đã auth (chờ redirect)
  return {
    isChecking: isHydrating || isAuthenticated,
    isHydrating,
    isAuthenticated,
  };
}
