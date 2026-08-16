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

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isHydrating && isAuthenticated) {
      // Dynamic fallback based on roles
      const userRoles = user?.roles || [];
      const isStaffOrAdmin = userRoles.some(role => role.includes('STAFF') || role.includes('ADMIN'));
      
      let finalTarget = fallback;
      if (isStaffOrAdmin) {
        finalTarget = '/staff/dashboard';
      }
      
      router.replace(finalTarget);
    }
  }, [isHydrating, isAuthenticated, router, fallback, user]);

  // isChecking = true khi: đang hydrate HOẶC đã auth (chờ redirect)
  return {
    isChecking: isHydrating || isAuthenticated,
    isHydrating,
    isAuthenticated,
  };
}
