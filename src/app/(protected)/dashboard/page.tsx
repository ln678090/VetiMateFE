'use client';

import { motion } from 'framer-motion';
import { UserRoundCog } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAVIGATION_ITEMS, canShowNavigationItemOnDashboard } from '@/config/app-navigation';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';
import { useAuthStore } from '@/stores/auth.store';
import { BatchAlertsWidget } from '@/features/inventory/components/widgets/BatchAlertsWidget';

type DashboardRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'RECEPTIONIST'
  | 'DOCTOR'
  | 'ACCOUNTANT'
  | 'WAREHOUSE'
  | 'SHOP_STAFF'
  | 'USER';

interface DashboardConfiguration {
  title: string;
  description: string;
  activityTitle: string;
  activityDescription: string;
}

const DASHBOARD_CONFIGURATIONS: Record<DashboardRole, DashboardConfiguration> = {
  ADMIN: {
    title: 'Quản trị hệ thống',
    description: 'Quản lý tài khoản, vai trò, quyền truy cập và cấu hình nền tảng.',
    activityTitle: 'Công việc quản trị',
    activityDescription: 'Kiểm tra tài khoản nhân sự, quyền truy cập và trạng thái hệ thống.',
  },

  MANAGER: {
    title: 'Trung tâm điều hành',
    description: 'Quản lý dịch vụ, lịch hẹn, nhân sự và hiệu quả vận hành.',
    activityTitle: 'Công việc quản lý',
    activityDescription: 'Theo dõi hoạt động và xử lý các công việc cần phê duyệt.',
  },

  RECEPTIONIST: {
    title: 'Quầy lễ tân',
    description: 'Tiếp nhận khách hàng, quản lý lịch hẹn và điều phối hàng đợi.',
    activityTitle: 'Công việc lễ tân',
    activityDescription: 'Kiểm tra lịch hẹn, khách đang chờ và hồ sơ cần cập nhật.',
  },

  DOCTOR: {
    title: 'Khu vực bác sĩ',
    description: 'Theo dõi ca chờ khám, bệnh án và lịch sử điều trị.',
    activityTitle: 'Quy trình khám bệnh',
    activityDescription: 'Các ca đã được lễ tân xác nhận sẽ xuất hiện trong danh sách khám.',
  },

  ACCOUNTANT: {
    title: 'Kế toán & Tài chính',
    description: 'Quản lý hóa đơn, thanh toán và công việc đối soát tài chính.',
    activityTitle: 'Công việc kế toán',
    activityDescription: 'Kiểm tra hóa đơn và các giao dịch đang chờ xử lý.',
  },

  WAREHOUSE: {
    title: 'Quản lý kho',
    description: 'Theo dõi nhập, xuất, chuyển kho, tồn và lô hàng.',
    activityTitle: 'Công việc kho',
    activityDescription: 'Kiểm tra tồn kho và các chứng từ đang chờ xử lý.',
  },

  SHOP_STAFF: {
    title: 'Nhân viên cửa hàng',
    description: 'Quản lý sản phẩm, đơn hàng và hỗ trợ bán hàng.',
    activityTitle: 'Công việc cửa hàng',
    activityDescription: 'Kiểm tra sản phẩm và các đơn hàng cần xử lý.',
  },

  USER: {
    title: 'Chăm sóc thú cưng',
    description: 'Quản lý thú cưng, đặt lịch và mua sắm sản phẩm phù hợp.',
    activityTitle: 'Hoạt động gần đây',
    activityDescription: 'Đặt lịch hoặc cập nhật hồ sơ thú cưng để bắt đầu.',
  },
};

function resolveDashboardRole(authorities: readonly string[]): DashboardRole {
  if (authorities.includes('ROLE_ADMIN')) {
    return 'ADMIN';
  }

  if (authorities.includes('ROLE_MANAGER')) {
    return 'MANAGER';
  }

  if (authorities.includes('ROLE_RECEPTIONIST')) {
    return 'RECEPTIONIST';
  }

  if (authorities.includes('ROLE_DOCTOR')) {
    return 'DOCTOR';
  }

  if (authorities.includes('ROLE_ACCOUNTANT')) {
    return 'ACCOUNTANT';
  }

  if (authorities.includes('ROLE_WAREHOUSE')) {
    return 'WAREHOUSE';
  }

  if (authorities.includes('ROLE_SHOP_STAFF')) {
    return 'SHOP_STAFF';
  }

  return 'USER';
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const authorities = useMemo(() => getAuthoritiesFromToken(accessToken), [accessToken]);

  const dashboardRole = useMemo(() => resolveDashboardRole(authorities), [authorities]);

  const dashboardActions = useMemo(
    () =>
      APP_NAVIGATION_ITEMS.filter((item) => canShowNavigationItemOnDashboard(item, authorities)),
    [authorities]
  );

  const configuration = DASHBOARD_CONFIGURATIONS[dashboardRole];

  const greetingName = user?.fullName ?? user?.username;

  const greetingText = greetingName ? `Chào mừng trở lại, ${greetingName}` : 'Chào mừng trở lại';

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <motion.header
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <p className="text-sm font-medium text-rose-600">{configuration.title}</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          {greetingText}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {configuration.description}
        </p>
      </motion.header>
      {['ADMIN', 'MANAGER', 'WAREHOUSE', 'SHOP_STAFF'].includes(dashboardRole) ? (
        <BatchAlertsWidget role={dashboardRole} />
      ) : (
        <Stagger
          delayChildren={0.15}
          staggerChildren={0.08}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {dashboardActions.map((action) => {
            const Icon = action.icon;
            const gradient = action.gradient ?? 'from-rose-500 to-orange-500';

            return (
              <StaggerItem key={action.key}>
                <Link href={action.href} className="block h-full">
                  <Card className="group relative h-full overflow-hidden border-zinc-200/70 bg-white/80 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-100/50 dark:border-zinc-800/60 dark:bg-zinc-900/60">
                    <div
                      className={[
                        'absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl',
                        gradient,
                      ].join(' ')}
                    />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">
                        {action.label}
                      </CardTitle>
                      <span
                        className={[
                          'grid size-10 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md',
                          gradient,
                        ].join(' ')}
                      >
                        <Icon className="size-5" strokeWidth={2.2} />
                      </span>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        {action.dashboardDescription}
                      </p>
                      <p className="mt-4 text-sm font-medium text-rose-600 transition-transform group-hover:translate-x-1 dark:text-rose-400">
                        Mở chức năng →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}

      {!['ADMIN', 'MANAGER', 'WAREHOUSE', 'SHOP_STAFF'].includes(dashboardRole) &&
        dashboardActions.length === 0 && (
          <Card className="border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20">
            <CardContent className="py-6">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Tài khoản chưa có chức năng Dashboard phù hợp. Hãy đăng nhập lại để làm mới quyền.
              </p>
            </CardContent>
          </Card>
        )}
      <motion.section
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Card className="border-zinc-200/70 bg-white/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <CardHeader>
            <CardTitle>{configuration.activityTitle}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid place-items-center py-10 text-center">
              <UserRoundCog
                className="mb-3 size-10 text-zinc-300 dark:text-zinc-700"
                strokeWidth={1.6}
              />

              <p className="max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {configuration.activityDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}
