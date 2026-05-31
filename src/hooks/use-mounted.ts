import { useEffect, useState } from 'react';

/**
 * Tránh hydration mismatch khi render UI phụ thuộc client-only state
 * (vd: theme, auth status từ memory store).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
