import {
  CalendarCheck,
  CalendarHeart,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ListOrdered,
  PawPrint,
  Receipt,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  Tags,
  UserRound,
  Users,
  UsersRound,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

export const ROLE = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  RECEPTIONIST: 'ROLE_RECEPTIONIST',
  DOCTOR: 'ROLE_DOCTOR',
  ACCOUNTANT: 'ROLE_ACCOUNTANT',
  SHOP_STAFF: 'ROLE_SHOP_STAFF',
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
  group?: string;
  exact?: boolean;
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
    group: 'Dịch vụ Khách hàng',
  },
  {
    key: 'my-pets',
    label: 'Thú cưng của tôi',
    href: '/profile/pets',
    icon: PawPrint,
    roles: [ROLE.USER],
    dashboardDescription: 'Quản lý hồ sơ và thông tin thú cưng.',
    gradient: 'from-emerald-500 to-teal-500',
    group: 'Dịch vụ Khách hàng',
  },
  {
    key: 'shop',
    label: 'Cửa hàng',
    href: '/shop',
    icon: ShoppingBag,
    roles: [ROLE.USER],
    dashboardDescription: 'Tìm thức ăn và phụ kiện chăm sóc.',
    gradient: 'from-amber-500 to-orange-500',
    group: 'Dịch vụ Khách hàng',
  },
  {
    key: 'cart',
    label: 'Giỏ hàng',
    href: '/cart',
    icon: ShoppingBag,
    roles: [ROLE.USER],
    group: 'Dịch vụ Khách hàng',
  },
  {
    key: 'orders',
    label: 'Đơn hàng',
    href: '/profile/orders',
    icon: ClipboardList,
    roles: [ROLE.USER],
  },
  {
    key: 'profile',
    label: 'Hồ sơ',
    href: '/profile',
    icon: UserRound,
    roles: [ROLE.USER],
    group: 'Dịch vụ Khách hàng',
    exact: true,
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
    group: 'Lễ tân',
  },

  // ═══ Lễ tân (RECEPTIONIST) ═══
  {
    key: 'customer-management',
    label: 'Quản lý KH & Pet',
    href: '/staff/customers',
    icon: Users,
    roles: [ROLE.ADMIN, ROLE.RECEPTIONIST],
    dashboardDescription: 'Quản lý hồ sơ chủ pet và thú cưng.',
    gradient: 'from-sky-500 to-blue-500',
    group: 'Lễ tân',
  },
  {
    key: 'smart-queue',
    label: 'Hàng đợi điện tử',
    href: '/staff/queue',
    icon: ListOrdered,
    roles: [ROLE.ADMIN, ROLE.RECEPTIONIST],
    dashboardDescription: 'Hàng đợi thông minh, phân luồng khám & spa.',
    gradient: 'from-violet-500 to-purple-500',
    group: 'Lễ tân',
  },
  {
    key: 'appointment-calendar',
    label: 'Lịch hẹn Calendar',
    href: '/staff/appointments',
    icon: CalendarCheck,
    roles: [ROLE.ADMIN, ROLE.RECEPTIONIST],
    dashboardDescription: 'Xem/tạo/sửa lịch hẹn theo ngày, tuần, tháng.',
    gradient: 'from-emerald-500 to-teal-500',
    group: 'Lễ tân',
  },

  // ═══ Kế toán (ACCOUNTANT) ═══
  {
    key: 'billing',
    label: 'Hóa đơn & Thanh toán',
    href: '/staff/billing',
    icon: Receipt,
    roles: [ROLE.ADMIN, ROLE.ACCOUNTANT],
    dashboardDescription: 'Tách/gộp hóa đơn, quản lý thanh toán.',
    gradient: 'from-amber-500 to-yellow-500',
    group: 'Kế toán',
  },

  // ═══ Nhân viên Shop (SHOP_STAFF) ═══
  {
    key: 'shop-products',
    label: 'Sản phẩm Shop',
    href: '/staff/shop/products',
    icon: ShoppingBag,
    roles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    dashboardDescription: 'Quản lý sản phẩm bán lẻ: thức ăn, đồ chơi, phụ kiện.',
    gradient: 'from-orange-500 to-amber-500',
    group: 'Bán hàng',
  },
  {
    key: 'shop-categories',
    label: 'Danh mục & Thương hiệu',
    href: '/staff/shop/categories',
    icon: Tags,
    roles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    dashboardDescription: 'Phân cấp danh mục sản phẩm, quản lý brand.',
    gradient: 'from-pink-500 to-rose-500',
    group: 'Bán hàng',
  },
  {
    key: 'shop-inventory',
    label: 'Tồn kho Shop',
    href: '/staff/shop/inventory',
    icon: Warehouse,
    roles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    dashboardDescription: 'Nhập/xuất/chuyển kho, kiểm kê thời gian thực.',
    gradient: 'from-teal-500 to-emerald-500',
    group: 'Bán hàng',
  },
  {
    key: 'shop-pos',
    label: 'Bán hàng tại quầy',
    href: '/staff/shop/pos',
    icon: ShoppingCart,
    roles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    dashboardDescription: 'POS: quét barcode, giỏ hàng, in hóa đơn.',
    gradient: 'from-indigo-500 to-violet-500',
    group: 'Bán hàng',
  },
  {
    key: 'shop-orders',
    label: 'Đơn hàng Shop',
    href: '/staff/shop/orders',
    icon: FileText,
    roles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    dashboardDescription: 'Quản lý đơn hàng: xác nhận, chuẩn bị, giao, hoàn tất.',
    gradient: 'from-lime-500 to-green-500',
    group: 'Bán hàng',
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
    group: 'Quản lý',
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
    group: 'Quản lý',
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
    group: 'Khám bệnh',
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
