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
  staff: {
    products: '/api/staff/products',
    catalog: '/api/staff/catalog',
    orders: '/api/staff/orders',
    inventory: '/api/staff/inventory',
  },
  catalog: {
    categories: '/api/catalog/categories',
    brands: '/api/catalog/brands',
  }
} as const;

/** Routes cần đăng nhập */
export const PROTECTED_ROUTES = ['/dashboard', '/booking', '/cart', '/profile'] as const;

/** Routes auth (không cho user đã login truy cập) */
export const AUTH_ROUTES = ['/login', '/register'] as const;

export const GUEST_NAV = [
  { title: 'Trang chủ', href: '/' },
  { title: 'Giới thiệu', href: '/about' },
  { title: 'Dịch vụ & Bảng giá', href: '/services' },
  { title: 'Đội ngũ bác sĩ', href: '/doctors' },
  { title: 'Cửa hàng', href: '/shop' },
] as const;

export const STAFF_NAV = [
  { title: 'Dashboard', href: '/staff/dashboard', icon: 'LayoutDashboard' },
  { title: 'Sản phẩm', href: '/staff/products', icon: 'Package' },
  { title: 'Danh mục & Thương hiệu', href: '/staff/catalog', icon: 'Tags' },
  { title: 'Quản lý Tồn kho', href: '/staff/inventory', icon: 'Archive' },
  { title: 'Đơn hàng', href: '/staff/orders', icon: 'ShoppingCart' },
  { title: 'Bán hàng (POS)', href: '/staff/pos', icon: 'MonitorSmartphone' },
] as const;

export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },
} as const;
