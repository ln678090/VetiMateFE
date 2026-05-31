'use client';

import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect, useRef } from 'react';

/** Promise.race với timeout cứng */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Refresh timeout')), ms)),
  ]);
}

/**
 * Khi app mount lần đầu:
 *   - Gọi /refresh (refresh_token gửi tự động qua cookie, path=/api/auth)
 *   - Thành công → setAuth (accessToken vào Zustand memory)
 *   - Fail / timeout → clear state
 *   - LUÔN LUÔN gọi setHydrating(false) ở finally
 *
 * Quan trọng: timeout cứng 6s để tránh treo do CORS / network hang.
 */
export function AuthHydrator() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clear = useAuthStore((s) => s.clear);
  const setHydrating = useAuthStore((s) => s.setHydrating);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      try {
        const data = await withTimeout(authService.refresh(), 6000);
        setAuth({ user: null, accessToken: data.accessToken });
      } catch {
        clear();
      } finally {
        setHydrating(false);
      }
    })();
  }, [setAuth, clear, setHydrating]);

  return null;
}
