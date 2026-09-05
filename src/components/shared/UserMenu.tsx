'use client';

import { Loader2, LogOut, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';
import { useAuthStore } from '@/stores/auth.store';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';

function resolveRoleLabel(authorities: readonly string[]): string {
  if (authorities.includes('ROLE_ADMIN')) {
    return 'Quản trị viên';
  }

  if (authorities.includes('ROLE_MANAGER')) {
    return 'Quản lý';
  }

  if (authorities.includes('ROLE_RECEPTIONIST')) {
    return 'Lễ tân';
  }

  if (authorities.includes('ROLE_DOCTOR')) {
    return 'Bác sĩ';
  }

  if (authorities.includes('ROLE_ACCOUNTANT')) {
    return 'Kế toán';
  }

  if (authorities.includes('ROLE_WAREHOUSE')) {
    return 'Thủ kho';
  }

  if (authorities.includes('ROLE_SHOP_STAFF')) {
    return 'Nhân viên cửa hàng';
  }

  if (authorities.includes('ROLE_USER')) {
    return 'Khách hàng';
  }

  return 'Đang xác thực';
}

function createInitials(displayName: string): string {
  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(-2)
    .join('')
    .toUpperCase();

  return initials || 'TK';
}

export function UserMenu() {
  const { logout } = useAuth();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const authorities = useMemo(() => getAuthoritiesFromToken(accessToken), [accessToken]);

  const roleLabel = useMemo(() => resolveRoleLabel(authorities), [authorities]);

  const displayName =
    user?.fullName?.trim() || user?.username?.trim() || user?.email?.trim() || 'Tài khoản';

  const initials = createInitials(displayName);

  async function handleLogout(): Promise<void> {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-1 pr-3 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Mở menu tài khoản"
        >
          <Avatar className="h-8 w-8 ring-2 ring-rose-200/60 dark:ring-rose-500/30">
            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-amber-400 text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="hidden text-sm font-medium text-zinc-700 md:inline dark:text-zinc-300">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">{displayName}</span>

            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {roleLabel}
            </span>

            {user?.email && user.email !== displayName && (
              <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user.email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setIsPasswordModalOpen(true)}
          className="cursor-pointer"
        >
          <ShieldCheck className="mr-2 h-4 w-4" strokeWidth={2} />
          Đổi mật khẩu
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
          className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10"
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" strokeWidth={2} />
          )}

          {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Cập nhật mật khẩu mới cho tài khoản của bạn.
          </DialogDescription>
        </DialogHeader>
        <ChangePasswordForm onSuccess={() => setIsPasswordModalOpen(false)} />
      </DialogContent>
    </Dialog>
    </>
  );
}
