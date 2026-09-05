import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Tránh hydration mismatch khi render UI phụ thuộc client-only state
 * (vd: theme, auth status từ memory store).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

