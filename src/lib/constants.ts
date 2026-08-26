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
    changePassword: '/api/auth/change-password',
  },
  users: {
    me: '/api/users/me',
    profile: '/api/users/me/profile',
  },
} as const;

/** Routes cần đăng nhập */
export const PROTECTED_ROUTES = ['/dashboard', '/booking', '/cart', '/profile', '/management', '/doctor', '/staff'] as const;

/** Routes auth (không cho user đã login truy cập) */
export const AUTH_ROUTES = ['/login', '/register'] as const;

export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },
} as const;
