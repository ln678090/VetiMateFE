'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Mail,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  Tv,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useMyCustomer } from '@/features/booking/hooks/use-clinic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth.store';
import { getAuthoritiesFromToken, getRoleDisplayName, getRoleInitials } from '@/lib/auth-roles';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: customer, isLoading: loadingCustomer, isError } = useMyCustomer();

  const authorities = useMemo(() => getAuthoritiesFromToken(accessToken), [accessToken]);
  const roleText = useMemo(() => getRoleDisplayName(authorities), [authorities]);

  const isDoctor = authorities.includes('ROLE_DOCTOR');
  const isAdmin = authorities.includes('ROLE_ADMIN');
  const isManager = authorities.includes('ROLE_MANAGER');
  const isReceptionist = authorities.includes('ROLE_RECEPTIONIST');
  const isStaffOrAbove = isAdmin || isManager || isReceptionist;
  const isCustomer = !isDoctor && !isStaffOrAbove;

  if (loadingCustomer && isCustomer) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36 rounded-3xl" />
          <Skeleton className="h-36 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!user && isError && isCustomer) {
    return (
      <div className="rounded-3xl border bg-white/80 p-6">
        <h1 className="text-xl font-semibold">Không tải được hồ sơ</h1>
        <p className="mt-2 text-sm text-muted-foreground">Vui lòng đăng nhập lại.</p>
      </div>
    );
  }

  const displayName =
    user?.fullName ||
    customer?.fullName ||
    (isDoctor
      ? 'BS. Trần Văn Bác Sĩ'
      : isAdmin
        ? 'Quản Trị Viên Hệ Thống'
        : isReceptionist
          ? 'Lễ Tân Nguyễn Thị Mai'
          : user?.username || 'Người dùng');

  const email =
    user?.email ||
    (isDoctor
      ? 'doctor@vetimate.vn'
      : isAdmin
        ? 'admin@vetimate.vn'
        : isReceptionist
          ? 'receptionist@vetimate.vn'
          : 'Chưa có email');

  const username =
    user?.username ||
    (isDoctor
      ? 'doctor_test'
      : isAdmin
        ? 'admin_test'
        : isReceptionist
          ? 'receptionist'
          : 'Chưa có');

  const initials = getRoleInitials(authorities, displayName);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-white/20 text-2xl font-bold backdrop-blur">
              {initials}
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">Hồ sơ nghiệp vụ</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{displayName}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
                <Mail className="size-4" />
                {email}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-wide text-white/75">Vai trò hệ thống</p>
            <p className="mt-1 font-semibold">{roleText}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-5 text-rose-500" />
              Thông tin tài khoản
            </CardTitle>
            <CardDescription>Thông tin định danh và phân quyền hiện tại.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Họ tên" value={displayName} />
            <InfoRow label="Username" value={username} />
            <InfoRow label="Email" value={email} />
          </CardContent>
        </Card>

        {/* Khách hàng thông thường */}
        {isCustomer && (
          <>
            <ActionCard
              href="/profile/pets"
              icon={<PawPrint className="size-5" />}
              title="Hồ sơ thú cưng"
              description="Quản lý danh sách chó mèo, xem chi tiết và cập nhật thông tin."
            />

            <ActionCard
              href="/booking"
              icon={<CalendarDays className="size-5" />}
              title="Đặt lịch chăm sóc"
              description="Tạo lịch khám hoặc chăm sóc dựa trên thú cưng đã lưu."
            />
          </>
        )}

        {/* Nghiệp vụ Lễ tân / Quản lý / Admin */}
        {isStaffOrAbove && (
          <>
            <ActionCard
              href="/management/customers"
              icon={<UsersRound className="size-5" />}
              title="Hồ sơ khách & thú cưng"
              description="Thêm, xem, sửa, xóa thông tin chủ pet và thú cưng. Hỗ trợ gộp hồ sơ trùng."
            />

            <ActionCard
              href="/management/tasks"
              icon={<CalendarCheck className="size-5" />}
              title="Việc cần làm sáng"
              description="Gọi thăm hỏi ca mổ hôm qua và nhắc lịch hẹn tiêm phòng hôm nay."
            />

            <ActionCard
              href="/lobby-queue"
              icon={<Tv className="size-5" />}
              title="Màn hình TV sảnh"
              description="Mở màn hình hiển thị số thứ tự sảnh chờ (hỗ trợ chuông & đọc tiếng Việt)."
            />

            <ActionCard
              href="/management/appointments"
              icon={<CalendarCheck className="size-5" />}
              title="Quản lý lịch hẹn"
              description="Tiếp nhận, xác nhận và điều phối lịch hẹn của khách hàng."
            />
          </>
        )}

        {/* Bác sĩ có quản lý khám */}
        {isDoctor && (
          <ActionCard
            href="/doctor/examinations"
            icon={<Stethoscope className="size-5" />}
            title="Quản lý khám bệnh"
            description="Theo dõi danh sách ca chờ khám và tra cứu lịch sử hồ sơ bệnh án."
          />
        )}

        {/* Admin có các lối tắt quản trị nâng cao */}
        {isAdmin && (
          <>
            <ActionCard
              href="/management/revenue"
              icon={<TrendingUp className="size-5" />}
              title="Báo cáo doanh thu"
              description="Thống kê doanh thu phòng khám và đơn hàng shop."
            />

            <ActionCard
              href="/management/staff"
              icon={<UsersRound className="size-5" />}
              title="Nhân sự & Bác sĩ"
              description="Quản lý nhân viên, bác sĩ và ca làm việc."
            />
          </>
        )}

        <Card className="rounded-3xl md:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-500" />
              Bảo mật & Phiên làm việc
            </CardTitle>
            <CardDescription>
              Access token đang được giữ an toàn trong memory store, tự động làm mới và xóa khi đăng xuất.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Trạng thái kết nối: Hoạt động bình thường</span>
            <span className="font-medium text-emerald-600">Đã đồng bộ thời gian thực</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 px-4 py-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-3xl transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-rose-500">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Button asChild className="w-full">
          <Link href={href}>
            Mở
            <ChevronRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
