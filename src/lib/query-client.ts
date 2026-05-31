import { QueryClient } from '@tanstack/react-query';

/**
 * Default config:
 * - staleTime 30s: tránh refetch quá thường xuyên khi user navigate nhanh
 * - retry 1 lần với delay tăng dần
 * - không refetch on window focus (UX nhẹ nhàng hơn cho dashboard)
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8_000),
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

// Singleton cho client-side (browser dùng chung 1 instance)
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: tạo mới mỗi request
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
