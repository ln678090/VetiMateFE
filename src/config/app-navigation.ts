import {
  CalendarCheck,
  CalendarHeart,
  ClipboardCheck,
  ClipboardList,
  LayoutDashboard,
  Package,
  PawPrint,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  TrendingUp,
  Tv,
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

  // Khách hàng (Admin cũng sở hữu)
  {
    key: 'booking',
    label: 'Đặt lịch chăm sóc',
    href: '/booking',
    icon: CalendarHeart,
    roles: [ROLE.USER, ROLE.ADMIN],
    dashboardDescription: 'Chọn dịch vụ và khung giờ phù hợp.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    key: 'my-pets',
    label: 'Thú cưng của tôi',
    href: '/profile/pets',
    icon: PawPrint,
    roles: [ROLE.USER, ROLE.ADMIN],
    dashboardDescription: 'Quản lý hồ sơ và thông tin thú cưng.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'shop',
    label: 'Cửa hàng',
    href: '/shop',
    icon: ShoppingBag,
    roles: [ROLE.USER, ROLE.ADMIN],
    dashboardDescription: 'Tìm thức ăn và phụ kiện chăm sóc.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    key: 'cart',
    label: 'Giỏ hàng',
    href: '/cart',
    icon: ShoppingCart,
    roles: [ROLE.USER, ROLE.ADMIN],
  },
  {
    key: 'customer-orders',
    label: 'Đơn hàng của tôi',
    href: '/customer/orders',
    icon: Package,
    roles: [ROLE.USER, ROLE.ADMIN],
    dashboardDescription: 'Theo dõi hành trình và lịch sử đơn hàng.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    key: 'profile',
    label: 'Hồ sơ',
    href: '/profile',
    icon: UserRound,
    roles: [ROLE.USER, ROLE.ADMIN, ROLE.MANAGER, ROLE.RECEPTIONIST, ROLE.DOCTOR],
  },

  // Quản lý Hồ sơ Khách & Pet (Admin, Manager, Receptionist)
  {
    key: 'customers-management',
    label: 'Khách & Thú cưng',
    href: '/management/customers',
    icon: UsersRound,
    roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.RECEPTIONIST],
    dashboardDescription: 'Quản lý hồ sơ chủ nuôi, thú cưng và công cụ gộp hồ sơ trùng.',
    gradient: 'from-teal-500 to-emerald-500',
  },

  // Danh sách việc sáng nay (Admin, Manager, Receptionist)
  {
    key: 'morning-tasks',
    label: 'Việc cần làm sáng',
    href: '/management/tasks',
    icon: ClipboardCheck,
    roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.RECEPTIONIST],
    dashboardDescription: 'Thăm hỏi ca mổ hôm qua & nhắc lịch hẹn tiêm phòng hôm nay.',
    gradient: 'from-amber-500 to-rose-500',
  },

  // Màn hình TV sảnh chờ (Admin, Manager, Receptionist)
  {
    key: 'lobby-tv',
    label: 'Màn hình TV sảnh',
    href: '/lobby-queue',
    icon: Tv,
    roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.RECEPTIONIST],
    dashboardDescription: 'Màn hình TV sảnh chờ phân luồng Khám bệnh và Spa/Grooming.',
    gradient: 'from-sky-500 to-blue-600',
  },

  // Quản lý lịch hẹn & Điều phối (Admin, Manager, Receptionist)
  {
    key: 'appointments',
    label: 'Quản lý lịch hẹn',
    href: '/management/appointments',
    icon: CalendarCheck,
    roles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.RECEPTIONIST],
    dashboardDescription: 'Xem, lọc và điều phối lịch hẹn.',
    gradient: 'from-rose-500 to-pink-500',
  },

  // Dịch vụ & Bảng giá
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

  // Doanh thu & Báo cáo
  {
    key: 'revenue',
    label: 'Báo cáo doanh thu',
    href: '/management/revenue',
    icon: TrendingUp,
    roles: [ROLE.ADMIN, ROLE.MANAGER],
    dashboardDescription: 'Thống kê doanh thu phòng khám và bán hàng shop.',
    gradient: 'from-amber-500 to-emerald-500',
  },

  // Khám bệnh: CHỈ DÀNH CHO BÁC SĨ (Không dành cho Admin)
  {
    key: 'examinations',
    label: 'Quản lý khám',
    href: '/doctor/examinations',
    icon: Stethoscope,
    roles: [ROLE.DOCTOR],
    dashboardDescription: 'Theo dõi ca chờ và hồ sơ hoàn thành.',
    gradient: 'from-emerald-500 to-teal-500',
  },

  // Lịch sử khám: CHỈ DÀNH CHO BÁC SĨ (Không dành cho Admin)
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

  const isAdmin = authorities.includes(ROLE.ADMIN);
  const isDoctor = authorities.includes(ROLE.DOCTOR);

  // Tính năng khám bệnh của Bác sĩ chỉ dành riêng cho Bác sĩ (Admin không sở hữu)
  if (item.key === 'examinations' || item.key === 'examination-history') {
    return isDoctor;
  }

  // Admin sở hữu tất cả các tính năng của các role khác (Khách hàng, Lễ tân, Quản lý...)
  if (isAdmin) {
    return true;
  }

  return item.roles.some((role) => authorities.includes(role));
}
