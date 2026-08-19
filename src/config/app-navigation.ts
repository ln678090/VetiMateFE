import {
  CalendarCheck,
  CalendarHeart,
  ClipboardList,
  LayoutDashboard,
  PawPrint,
  Settings2,
  ShoppingBag,
  Stethoscope,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

export const ROLE = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  RECEPTIONIST: 'ROLE_RECEPTIONIST',
  DOCTOR: 'ROLE_DOCTOR',
  USER: 'ROLE_USER',
} as const;

export type NavigationRole = (typeof ROLE)[keyof typeof ROLE];

export interface AppNavigationItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: readonly NavigationRole[];
  showInSidebar?: boolean;
  dashboardDescription?: string;
  gradient?: string;
}

export const APP_NAVIGATION_ITEMS: readonly AppNavigationItem[] = [
  // Chung
  {
    key: 'dashboard',
    label: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
  },

  // Khách hàng
  {
    key: 'booking',
    label: 'Đặt lịch chăm sóc',
    href: '/booking',
    icon: CalendarHeart,
    roles: [ROLE.USER],
    dashboardDescription: 'Chọn dịch vụ và khung giờ phù hợp.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    key: 'my-pets',
    label: 'Thú cưng của tôi',
    href: '/profile/pets',
    icon: PawPrint,
    roles: [ROLE.USER],
    dashboardDescription: 'Quản lý hồ sơ và thông tin thú cưng.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'shop',
    label: 'Cửa hàng',
    href: '/shop',
    icon: ShoppingBag,
    roles: [ROLE.USER],
    dashboardDescription: 'Tìm thức ăn và phụ kiện chăm sóc.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    key: 'cart',
    label: 'Giỏ hàng',
    href: '/cart',
    icon: ShoppingBag,
    roles: [ROLE.USER],
  },
  {
    key: 'profile',
    label: 'Hồ sơ',
    href: '/profile',
    icon: UserRound,
    roles: [ROLE.USER],
  },

  // Quản lý lịch hẹn
  {
    key: 'appointments',
    label: 'Quản lý lịch hẹn',
    href: '/management/appointments',
    icon: CalendarCheck,
    roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.RECEPTIONIST],
    dashboardDescription: 'Xem, lọc và điều phối lịch hẹn.',
    gradient: 'from-rose-500 to-pink-500',
  },

  // Dịch vụ
  {
    key: 'services',
    label: 'Dịch vụ & bảng giá',
    href: '/management/services',
    icon: Settings2,
    roles: [ROLE.ADMIN, ROLE.MANAGER],
    dashboardDescription: 'Quản lý dịch vụ, giá và thời lượng.',
    gradient: 'from-violet-500 to-purple-500',
  },

  // Nhân sự: chỉ Admin
  {
    key: 'staff-management',
    label: 'Nhân viên & bác sĩ',
    href: '/management/staff',
    icon: UsersRound,
    roles: [ROLE.ADMIN],
    dashboardDescription: 'Quản lý nhân viên, bác sĩ và trạng thái làm việc.',
    gradient: 'from-cyan-500 to-blue-500',
  },

  // Khám bệnh
  {
    key: 'examinations',
    label: 'Quản lý khám',
    href: '/doctor/examinations',
    icon: Stethoscope,
    roles: [ROLE.ADMIN, ROLE.DOCTOR],
    dashboardDescription: 'Theo dõi ca chờ và hồ sơ hoàn thành.',
    gradient: 'from-emerald-500 to-teal-500',
  },

  // Chỉ hiện card cho bác sĩ
  {
    key: 'examination-history',
    label: 'Lịch sử khám',
    href: '/doctor/examinations?tab=history',
    icon: ClipboardList,
    roles: [ROLE.DOCTOR],
    showInSidebar: false,
    dashboardDescription: 'Tra cứu hồ sơ khám đã hoàn thành.',
    gradient: 'from-sky-500 to-indigo-500',
  },
];

export function canAccessNavigationItem(
  item: AppNavigationItem,
  authorities: readonly string[]
): boolean {
  if (!item.roles?.length) {
    return true;
  }

  return item.roles.some((role) => authorities.includes(role));
}
