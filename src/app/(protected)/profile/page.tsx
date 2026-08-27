'use client';

import Link from 'next/link';
import { CalendarDays, ChevronRight, Mail, Package, PawPrint, ShieldCheck, UserRound } from 'lucide-react';
import { useMyCustomer } from '@/features/booking/hooks/use-clinic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect, useState } from 'react';

type ProfileUser = {
  id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  roles?: Array<string | { name?: string }>;
};

function getInitials(name?: string, email?: string) {
  const source = name || email || 'User';

  return source
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getRoleText(user?: ProfileUser | null) {
  if (!user?.roles?.length) {
    return 'Khách hàng';
  }

  return user.roles
    .map((role) => (typeof role === 'string' ? role : role.name))
    .filter(Boolean)
    .join(', ');
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user) as ProfileUser | null;

  const { data: customer, isLoading: loadingCustomer, isError } = useMyCustomer();

  if (loadingCustomer) {
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

  if (!user && isError) {
    return (
      <div className="rounded-3xl border bg-white/80 p-6">
        <h1 className="text-xl font-semibold">Không tải được hồ sơ</h1>
        <p className="mt-2 text-sm text-muted-foreground">Vui lòng đăng nhập lại.</p>
      </div>
    );
  }

  const displayName =
    user?.fullName || user?.username || customer?.fullName || customer?.fullName || 'Người dùng';

  const roleText = getRoleText(user);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-white/20 text-2xl font-bold backdrop-blur">
              {getInitials(displayName, user?.email)}
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">Hồ sơ cá nhân</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{displayName}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
                <Mail className="size-4" />
                {user?.email || 'Chưa có email'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-wide text-white/75">Vai trò</p>
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
            <CardDescription>Thông tin đăng nhập hiện tại.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Họ tên" value={displayName} />
            <InfoRow label="Username" value={user?.username || 'Chưa có'} />
            <InfoRow label="Email" value={user?.email || 'Chưa có'} />
          </CardContent>
        </Card>



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

        <Card className="rounded-3xl md:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-500" />
              Bảo mật
            </CardTitle>
            <CardDescription>
              Access token đang được giữ trong memory store, không lưu trong localStorage hoặc
              sessionStorage.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button disabled variant="outline">
              Chỉnh sửa hồ sơ sẽ làm ở Phase 6.1
            </Button>
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
