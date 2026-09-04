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
  Ticket,
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
  WAREHOUSE: 'ROLE_WAREHOUSE',
  SHOP_STAFF: 'ROLE_SHOP_STAFF',
  USER: 'ROLE_USER',
} as const;

export type NavigationRole = (typeof ROLE)[keyof typeof ROLE];

export interface AppNavigationItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;

  /** Có thể mở route trực tiếp. */
  accessRoles?: readonly NavigationRole[];

  /** Được nhìn thấy trong Sidebar. */
  sidebarRoles?: readonly NavigationRole[];

  /** Được nhìn thấy dưới dạng card Dashboard. */
  dashboardRoles?: readonly NavigationRole[];

  showInSidebar?: boolean;
  dashboardDescription?: string;
  gradient?: string;
  group?: string;
  exact?: boolean;
}

export const APP_NAVIGATION_ITEMS: readonly AppNavigationItem[] = [
  {
    key: 'dashboard',
    label: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
  },

  // ─────────────────────────────────────────────
  // Khách hàng
  // ─────────────────────────────────────────────

  {
    key: 'booking',
    label: 'Đặt lịch chăm sóc',
    href: '/booking',
    icon: CalendarHeart,
    accessRoles: [ROLE.USER],
    sidebarRoles: [ROLE.USER],
    dashboardRoles: [ROLE.USER],
    dashboardDescription: 'Chọn dịch vụ và khung giờ phù hợp.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    key: 'my-pets',
    label: 'Thú cưng của tôi',
    href: '/profile/pets',
    icon: PawPrint,
    accessRoles: [ROLE.USER],
    sidebarRoles: [ROLE.USER],
    dashboardRoles: [ROLE.USER],
    dashboardDescription: 'Quản lý hồ sơ và thông tin thú cưng.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'shop',
    label: 'Cửa hàng',
    href: '/shop',
    icon: ShoppingBag,
    accessRoles: [ROLE.USER],
    sidebarRoles: [ROLE.USER],
    dashboardRoles: [ROLE.USER],
    dashboardDescription: 'Tìm thức ăn và phụ kiện chăm sóc.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    key: 'cart',
    label: 'Giỏ hàng',
    href: '/cart',
    icon: ShoppingCart,
    accessRoles: [ROLE.USER],
    sidebarRoles: [ROLE.USER],
  },
  {
    key: 'orders',
    label: 'Đơn hàng',
    href: '/profile/orders',
    icon: ClipboardList,
    accessRoles: [ROLE.USER],
    sidebarRoles: [ROLE.USER],
  },
  {
    key: 'loyalty',
    label: 'Khuyến mãi & Ưu đãi',
    href: '/profile/loyalty',
    icon: Tags,
    accessRoles: [ROLE.USER],
    sidebarRoles: [ROLE.USER],
  },
  {
    key: 'profile',
    label: 'Hồ sơ',
    href: '/profile',
    icon: UserRound,
    accessRoles: [ROLE.USER],
    sidebarRoles: [ROLE.USER],
    exact: true,
  },

  // ─────────────────────────────────────────────
  // Manager và Receptionist
  // ─────────────────────────────────────────────

  {
    key: 'appointments',
    label: 'Quản lý lịch hẹn',
    href: '/management/appointments',
    icon: CalendarCheck,

    // Admin vẫn có thể hỗ trợ khẩn cấp qua URL.
    accessRoles: [ROLE.ADMIN, ROLE.MANAGER, ROLE.RECEPTIONIST],

    // Không đưa nghiệp vụ này vào giao diện Admin.
    sidebarRoles: [ROLE.MANAGER, ROLE.RECEPTIONIST],
    dashboardRoles: [ROLE.MANAGER, ROLE.RECEPTIONIST],

    dashboardDescription: 'Xem, lọc và điều phối lịch hẹn.',
    gradient: 'from-rose-500 to-pink-500',
    group: 'Lịch hẹn',
  },
  {
    key: 'customer-management',
    label: 'Quản lý KH & Pet',
    href: '/staff/customers',
    icon: Users,
    accessRoles: [ROLE.ADMIN, ROLE.RECEPTIONIST],
    sidebarRoles: [ROLE.RECEPTIONIST],
    dashboardRoles: [ROLE.RECEPTIONIST],
    dashboardDescription: 'Quản lý hồ sơ chủ pet và thú cưng.',
    gradient: 'from-sky-500 to-blue-500',
    group: 'Lễ tân',
  },
  {
    key: 'smart-queue',
    label: 'Hàng đợi điện tử',
    href: '/staff/queue',
    icon: ListOrdered,
    accessRoles: [ROLE.ADMIN, ROLE.RECEPTIONIST],
    sidebarRoles: [ROLE.RECEPTIONIST],
    dashboardRoles: [ROLE.RECEPTIONIST],
    dashboardDescription: 'Điều phối hàng đợi khám và chăm sóc.',
    gradient: 'from-violet-500 to-purple-500',
    group: 'Lễ tân',
  },

  // ─────────────────────────────────────────────
  // Accountant
  // ─────────────────────────────────────────────

  {
    key: 'billing',
    label: 'Hóa đơn & Thanh toán',
    href: '/staff/billing',
    icon: Receipt,
    accessRoles: [ROLE.ADMIN, ROLE.ACCOUNTANT],
    sidebarRoles: [ROLE.ACCOUNTANT],
    dashboardRoles: [ROLE.ACCOUNTANT],
    dashboardDescription: 'Quản lý hóa đơn, thanh toán và đối soát.',
    gradient: 'from-amber-500 to-yellow-500',
    group: 'Kế toán',
  },

  // ─────────────────────────────────────────────
  // Shop Staff
  // ─────────────────────────────────────────────

  {
    key: 'shop-products',
    label: 'Sản phẩm Shop',
    href: '/staff/shop/products',
    icon: ShoppingBag,
    accessRoles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    sidebarRoles: [ROLE.SHOP_STAFF],
    dashboardRoles: [ROLE.SHOP_STAFF],
    dashboardDescription: 'Quản lý thông tin sản phẩm bán lẻ.',
    gradient: 'from-orange-500 to-amber-500',
    group: 'Cửa hàng',
  },
  {
    key: 'shop-categories',
    label: 'Danh mục & Thương hiệu',
    href: '/staff/shop/categories',
    icon: Tags,
    accessRoles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    sidebarRoles: [ROLE.SHOP_STAFF],
    dashboardRoles: [ROLE.SHOP_STAFF],
    dashboardDescription: 'Quản lý danh mục và thương hiệu.',
    gradient: 'from-pink-500 to-rose-500',
    group: 'Cửa hàng',
  },
  {
    key: 'shop-orders',
    label: 'Đơn hàng Shop',
    href: '/staff/shop/orders',
    icon: FileText,
    accessRoles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    sidebarRoles: [ROLE.SHOP_STAFF],
    dashboardRoles: [ROLE.SHOP_STAFF],
    dashboardDescription: 'Xác nhận, chuẩn bị và theo dõi đơn hàng.',
    gradient: 'from-lime-500 to-green-500',
    group: 'Cửa hàng',
  },
  {
    key: 'shop-vouchers',
    label: 'Quản lý Voucher',
    href: '/staff/shop/vouchers',
    icon: Ticket,
    accessRoles: [ROLE.ADMIN, ROLE.SHOP_STAFF, ROLE.MANAGER],
    sidebarRoles: [ROLE.SHOP_STAFF, ROLE.MANAGER],
    dashboardRoles: [ROLE.SHOP_STAFF, ROLE.MANAGER],
    dashboardDescription: 'Quản lý mã giảm giá, voucher cho cửa hàng.',
    gradient: 'from-fuchsia-500 to-pink-500',
    group: 'Cửa hàng',
  },

  // POS tạm thuộc Shop Staff cho đến khi backend có ROLE_CASHIER.
  {
    key: 'shop-pos',
    label: 'Bán hàng tại quầy',
    href: '/staff/shop/pos',
    icon: ShoppingCart,
    accessRoles: [ROLE.ADMIN, ROLE.SHOP_STAFF],
    sidebarRoles: [ROLE.SHOP_STAFF],
    dashboardRoles: [ROLE.SHOP_STAFF],
    dashboardDescription: 'Quét sản phẩm, thanh toán và in hóa đơn.',
    gradient: 'from-indigo-500 to-violet-500',
    group: 'Bán hàng',
  },

  // ─────────────────────────────────────────────
  // Warehouse
  // ─────────────────────────────────────────────

  {
    key: 'shop-inventory',
    label: 'Tồn kho Shop',
    href: '/staff/shop/inventory',
    icon: Warehouse,
    accessRoles: [ROLE.ADMIN, ROLE.WAREHOUSE, ROLE.SHOP_STAFF],
    sidebarRoles: [ROLE.WAREHOUSE],
    dashboardRoles: [ROLE.WAREHOUSE],
    dashboardDescription: 'Quản lý nhập, xuất, chuyển và kiểm kê kho.',
    gradient: 'from-teal-500 to-emerald-500',
    group: 'Kho',
  },

  // ─────────────────────────────────────────────
  // Manager
  // ─────────────────────────────────────────────

  {
    key: 'services',
    label: 'Dịch vụ & bảng giá',
    href: '/management/services',
    icon: Settings2,
    accessRoles: [ROLE.ADMIN, ROLE.MANAGER],
    sidebarRoles: [ROLE.MANAGER],
    dashboardRoles: [ROLE.MANAGER],
    dashboardDescription: 'Quản lý dịch vụ, giá và thời lượng.',
    gradient: 'from-violet-500 to-purple-500',
    group: 'Điều hành',
  },

  // ─────────────────────────────────────────────
  // Admin
  // ─────────────────────────────────────────────

  {
    key: 'staff-management',
    label: 'Tài khoản & phân quyền',
    href: '/management/staff',
    icon: UsersRound,
    accessRoles: [ROLE.ADMIN],
    sidebarRoles: [ROLE.ADMIN],
    dashboardRoles: [ROLE.ADMIN],
    dashboardDescription: 'Quản lý tài khoản, vai trò và trạng thái truy cập.',
    gradient: 'from-cyan-500 to-blue-500',
    group: 'Quản trị hệ thống',
  },

  // ─────────────────────────────────────────────
  // Doctor
  // ─────────────────────────────────────────────

  {
    key: 'examinations',
    label: 'Quản lý khám',
    href: '/doctor/examinations',
    icon: Stethoscope,
    accessRoles: [ROLE.ADMIN, ROLE.DOCTOR],
    sidebarRoles: [ROLE.DOCTOR],
    dashboardRoles: [ROLE.DOCTOR],
    dashboardDescription: 'Theo dõi ca chờ và thực hiện khám bệnh.',
    gradient: 'from-emerald-500 to-teal-500',
    group: 'Khám bệnh',
  },
  {
    key: 'examination-history',
    label: 'Lịch sử khám',
    href: '/doctor/examinations?tab=history',
    icon: ClipboardList,
    accessRoles: [ROLE.DOCTOR],
    dashboardRoles: [ROLE.DOCTOR],
    showInSidebar: false,
    dashboardDescription: 'Tra cứu hồ sơ khám đã hoàn thành.',
    gradient: 'from-sky-500 to-indigo-500',
  },
];

function hasRequiredRole(
  roles: readonly NavigationRole[] | undefined,
  authorities: readonly string[]
): boolean {
  if (!roles?.length) {
    return true;
  }

  return roles.some((role) => authorities.includes(role));
}

export function canAccessNavigationItem(
  item: AppNavigationItem,
  authorities: readonly string[]
): boolean {
  return hasRequiredRole(item.accessRoles, authorities);
}

export function canShowNavigationItemInSidebar(
  item: AppNavigationItem,
  authorities: readonly string[]
): boolean {
  if (item.showInSidebar === false) {
    return false;
  }

  return (
    canAccessNavigationItem(item, authorities) && hasRequiredRole(item.sidebarRoles, authorities)
  );
}

export function canShowNavigationItemOnDashboard(
  item: AppNavigationItem,
  authorities: readonly string[]
): boolean {
  if (!item.dashboardDescription) {
    return false;
  }

  return (
    canAccessNavigationItem(item, authorities) && hasRequiredRole(item.dashboardRoles, authorities)
  );
}
