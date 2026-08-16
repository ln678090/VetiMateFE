import {
  CalendarHeart,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  Truck,
  UserCircle2,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

/** Nav items của khu vực protected */
export const PROTECTED_NAV: NavItem[] = [
  { label: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Đặt lịch chăm sóc', href: '/booking', icon: CalendarHeart },
  { label: 'Khám thú y', href: '/vet', icon: Stethoscope },
  { label: 'Cửa hàng', href: '/shop', icon: ShoppingBag },
  { label: 'Theo dõi đơn hàng', href: '/order-tracking', icon: Truck },
  { label: 'Giỏ hàng', href: '/cart', icon: ShoppingCart },
  { label: 'Hồ sơ', href: '/profile', icon: UserCircle2 },
];

export const STAFF_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
  { label: 'Sản phẩm', href: '/staff/products', icon: ShoppingBag },
  { label: 'Danh mục', href: '/staff/catalog', icon: ShoppingBag },
  { label: 'Tồn kho', href: '/staff/inventory', icon: ShoppingBag },
  { label: 'Đơn hàng', href: '/staff/orders', icon: ShoppingCart },
  { label: 'Bán hàng (POS)', href: '/staff/pos', icon: ShoppingCart },
];
