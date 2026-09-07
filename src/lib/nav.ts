import {
  CalendarHeart,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  UserCircle2,
  Warehouse,
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
  { label: 'Kho hàng', href: '/inventory', icon: Warehouse },
  { label: 'Cửa hàng', href: '/shop', icon: ShoppingBag },
  { label: 'Giỏ hàng', href: '/cart', icon: ShoppingCart },
  { label: 'Hồ sơ', href: '/profile', icon: UserCircle2 },
  { label: 'Quản lý lịch  khám  ', href: '/management/appointments', icon: Stethoscope },
  { label: 'Quản lý khám ', href: '/doctor/examinations', icon: Stethoscope },
];
