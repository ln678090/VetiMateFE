'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserRoundCog } from 'lucide-react';

import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAVIGATION_ITEMS, canAccessNavigationItem } from '@/config/app-navigation';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';
import { useAuthStore } from '@/stores/auth.store';

type DashboardRole = 'ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'DOCTOR' | 'ACCOUNTANT' | 'SHOP_STAFF' | 'USER';

interface DashboardConfiguration {
  title: string;
  description: string;
  activityTitle: string;
  activityDescription: string;
}

const DASHBOARD_CONFIGURATIONS: Record<DashboardRole, DashboardConfiguration> = {
  ADMIN: {
    title: 'Trung tâm quản trị',
    description: 'Điều phối hoạt động phòng khám và giám sát các quy trình nghiệp vụ.',
    activityTitle: 'Công việc quản trị',
    activityDescription: 'Chọn một chức năng bên trên để bắt đầu quản lý hệ thống.',
  },

  MANAGER: {
    title: 'Trung tâm quản lý',
    description: 'Quản lý dịch vụ, bảng giá và vận hành phòng khám.',
    activityTitle: 'Công việc quản lý',
    activityDescription: 'Chọn chức năng cần quản lý để bắt đầu.',
  },

  RECEPTIONIST: {
    title: 'Quầy lễ tân',
    description: 'Tiếp nhận khách hàng và điều phối lịch khám trong ngày.',
    activityTitle: 'Công việc lễ tân',
    activityDescription: 'Mở quản lý lịch hẹn để xác nhận và điều phối khách hàng.',
  },

  DOCTOR: {
    title: 'Khu vực bác sĩ',
    description: 'Theo dõi ca chờ khám và tra cứu hồ sơ đã hoàn thành.',
    activityTitle: 'Quy trình khám bệnh',
    activityDescription: 'Các ca được lễ tân xác nhận sẽ xuất hiện trong danh sách ca khám.',
  },

  ACCOUNTANT: {
    title: 'Kế toán & Tài chính',
    description: 'Quản lý hóa đơn, thanh toán và báo cáo tài chính hàng ngày.',
    activityTitle: 'Công việc kế toán',
    activityDescription: 'Mở quản lý hóa đơn để tách/gộp bill và xử lý thanh toán.',
  },

  SHOP_STAFF: {
    title: 'Nhân viên cửa hàng',
    description: 'Quản lý sản phẩm, bán hàng tại quầy và xử lý đơn hàng.',
    activityTitle: 'Công việc bán hàng',
    activityDescription: 'Mở POS để bán hàng hoặc kiểm tra đơn hàng mới.',
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

  if (authorities.includes('ROLE_SHOP_STAFF')) {
    return 'SHOP_STAFF';
  }

  return 'USER';
}

function getFallbackGreeting(role: DashboardRole): string {
  switch (role) {
    case 'ADMIN':
      return 'quản trị viên';

    case 'MANAGER':
      return 'quản lý';

    case 'RECEPTIONIST':
      return 'lễ tân';

    case 'DOCTOR':
      return 'bác sĩ';

    case 'ACCOUNTANT':
      return 'kế toán';

    case 'SHOP_STAFF':
      return 'nhân viên shop';

    default:
      return 'bạn';
  }
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const authorities = useMemo(() => getAuthoritiesFromToken(accessToken), [accessToken]);

  const dashboardRole = useMemo(() => resolveDashboardRole(authorities), [authorities]);

  const dashboardActions = useMemo(
    () =>
      APP_NAVIGATION_ITEMS.filter(
        (item) => Boolean(item.dashboardDescription) && canAccessNavigationItem(item, authorities)
      ),
    [authorities]
  );

  const configuration = DASHBOARD_CONFIGURATIONS[dashboardRole];

  const greeting = user?.fullName ?? user?.username ?? getFallbackGreeting(dashboardRole);

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
          Chào mừng trở lại, {greeting}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {configuration.description}
        </p>
      </motion.header>

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

                    <p className="mt-4 text-sm font-medium text-rose-600 transition-transform group-hover:translate-x-1 dark:text-rose-400 ">
                      Mở chức năng →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      {dashboardActions.length === 0 && (
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
