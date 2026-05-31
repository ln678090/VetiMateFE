'use client';

import { useAuthStore } from '@/stores/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Protected page guard:
 * - isHydrating = true → vẫn đang gọi /refresh, hiển thị loader
 * - isHydrating = false + !isAuthenticated → đẩy về /login?from=...
 * - isHydrating = false + isAuthenticated → render children
 */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  useEffect(() => {
    //  CHỈ redirect SAU KHI hydrate xong (đã thử /refresh)
    if (isHydrating) return;

    if (!isAuthenticated) {
      const loginUrl = `/login?from=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [isHydrating, isAuthenticated, pathname, router]);

  return {
    isChecking: isHydrating || !isAuthenticated,
    isHydrating,
    isAuthenticated,
  };
}
