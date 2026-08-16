'use client';

import { useRedirectIfAuthed } from '@/hooks/use-redirect-if-authed';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useAuthStore } from '@/stores/auth.store';
import type { ReactNode } from 'react';
import { FullScreenLoader } from './FullScreenLoader';

// ─────────────────────────────────────────────────────────────
// GuestOnly: chỉ cho phép user CHƯA login truy cập (login, register)
// ─────────────────────────────────────────────────────────────
interface GuestOnlyProps {
  children: ReactNode;
  redirectTo?: string;
}

export function GuestOnly({ children, redirectTo = '/dashboard' }: GuestOnlyProps) {
  const { isChecking } = useRedirectIfAuthed(redirectTo);

  if (isChecking) {
    return <FullScreenLoader message="Đang chuyển hướng" />;
  }
  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────
// RequireAuth: chỉ cho phép user ĐÃ login truy cập (dashboard, booking...)
// ─────────────────────────────────────────────────────────────
interface RequireAuthProps {
  children: ReactNode;
  loadingMessage?: string;
}

export function RequireAuth({
  children,
  loadingMessage = 'Đang xác thực phiên đăng nhập',
}: RequireAuthProps) {
  const { isChecking } = useRequireAuth();

  if (isChecking) {
    return <FullScreenLoader message={loadingMessage} />;
  }
  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────
// AuthGuard: yêu cầu login + kiểm tra roles (staff pages)
// ─────────────────────────────────────────────────────────────
interface AuthGuardProps {
  children: ReactNode;
  requireRoles?: string[];
  loadingMessage?: string;
}

export function AuthGuard({
  children,
  requireRoles,
  loadingMessage = 'Đang xác thực phiên đăng nhập',
}: AuthGuardProps) {
  const { isChecking } = useRequireAuth();
  const user = useAuthStore((s) => s.user);

  if (isChecking) {
    return <FullScreenLoader message={loadingMessage} />;
  }

  // Kiểm tra roles nếu được yêu cầu
  if (requireRoles && requireRoles.length > 0 && user) {
    const userRoles = user.roles || [];
    const hasRole = requireRoles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Không có quyền truy cập
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Bạn không có quyền truy cập trang này.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

