'use client';

import { useRedirectIfAuthed } from '@/hooks/use-redirect-if-authed';
import { useRequireAuth } from '@/hooks/use-require-auth';
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
