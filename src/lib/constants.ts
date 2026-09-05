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
    forgotPassword: '/api/auth/forgot-password',
    verifyOtp: '/api/auth/verify-otp',
    resetPassword: '/api/auth/reset-password',
  },
  order: {
    customerOrders: '/api/customer/orders',
  },
} as const;

/** Routes cần đăng nhập */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/booking',
  '/cart',
  '/profile',
  '/customer/orders',
] as const;

/** Routes auth (không cho user đã login truy cập) */
export const AUTH_ROUTES = ['/login', '/register', '/forgot-password'] as const;

export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (params?: unknown) => ['orders', 'list', params] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    tracking: (id: string) => ['orders', 'tracking', id] as const,
  },
} as const;
