import { env } from './env';

export const APP = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: 'Cửa hàng & dịch vụ chăm sóc thú cưng cao cấp cho chó mèo',
} as const;

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

/** Tất cả endpoint backend tập trung 1 chỗ — dễ thay đổi */
export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    loginMobile: '/api/auth/login-mobile',
    registerMobile: '/api/auth/register-mobile',
    refresh: '/api/auth/refresh',
    refreshMobile: '/api/auth/refresh-mobile',
    logout: '/api/auth/logout',
    test: '/api/auth/test',
  },
  inventory: {
    suppliers: '/api/inventory/suppliers',
    medicines: '/api/inventory/medicines',
    vouchers: '/api/inventory/vouchers',
    batches: '/api/inventory/batches',
    dashboard: '/api/inventory/dashboard',
    alerts: '/api/inventory/alerts',
  },
} as const;

/** Routes cần đăng nhập */
export const PROTECTED_ROUTES = ['/dashboard', '/booking', '/cart', '/profile', '/inventory'] as const;

/** Routes auth (không cho user đã login truy cập) */
export const AUTH_ROUTES = ['/login', '/register'] as const;

export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },
} as const;
