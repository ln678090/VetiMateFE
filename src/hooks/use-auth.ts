'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/axios';
import { decodeJwtUser } from '@/lib/jwt';
import type { LoginInput, RegisterInput } from '@/schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clear = useAuthStore((s) => s.clear);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  /** Lấy redirect target từ ?from=, mặc định /dashboard. Sanitize để chống open-redirect. */
  const getRedirectTarget = useCallback(
    (roles?: string[]) => {
      // Nếu là staff/admin, luôn redirect về staff dashboard
      const isStaff = roles?.some(
        (r) => r.includes('STAFF') || r.includes('ADMIN') || r.includes('MANAGER'),
      );
      if (isStaff) return '/staff/dashboard';

      const raw = searchParams?.get('from');
      if (!raw) return '/dashboard';
      // Chỉ cho phép path nội bộ (bắt đầu / và không bắt đầu //)
      if (raw.startsWith('/') && !raw.startsWith('//')) return raw;
      return '/dashboard';
    },
    [searchParams],
  );

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (data) => {
      const jwtUser = decodeJwtUser(data.accessToken);
      setAuth({ user: jwtUser, accessToken: data.accessToken });
      toast.success('Đăng nhập thành công');
      router.push(getRedirectTarget(jwtUser?.roles));
      router.refresh();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Đăng nhập thất bại'));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (data) => {
      const jwtUser = decodeJwtUser(data.accessToken);
      setAuth({ user: jwtUser, accessToken: data.accessToken });
      toast.success('Đăng ký thành công');
      router.push(getRedirectTarget(jwtUser?.roles));
      router.refresh();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Đăng ký thất bại'));
    },
  });

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Vẫn clear state dù API fail
    } finally {
      clear();
      toast.success('Đăng xuất thành công');
      router.push('/login');
      router.refresh();
    }
  }, [clear, router]);

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
