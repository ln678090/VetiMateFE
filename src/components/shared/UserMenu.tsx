'use client';

import { Loader2, LogOut } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';
import { useAuthStore } from '@/stores/auth.store';

const LOGOUT_TIMEOUT_MS = 1_000;

function resolveRoleLabel(authorities: readonly string[]): string {
  if (authorities.includes('ROLE_ADMIN')) return 'Quản trị viên';
  if (authorities.includes('ROLE_MANAGER')) return 'Quản lý';
  if (authorities.includes('ROLE_RECEPTIONIST')) return 'Lễ tân';
  if (authorities.includes('ROLE_DOCTOR')) return 'Bác sĩ';
  if (authorities.includes('ROLE_ACCOUNTANT')) return 'Kế toán';
  if (authorities.includes('ROLE_WAREHOUSE')) return 'Thủ kho';
  if (authorities.includes('ROLE_SHOP_STAFF')) {
    return 'Nhân viên cửa hàng';
  }
  if (authorities.includes('ROLE_USER')) return 'Khách hàng';

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

function createTimeout(duration: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export function UserMenu() {
  const { logout } = useAuth();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const authorities = useMemo(() => getAuthoritiesFromToken(accessToken), [accessToken]);

  const roleLabel = useMemo(() => resolveRoleLabel(authorities), [authorities]);

  const displayName =
    user?.fullName?.trim() || user?.username?.trim() || user?.email?.trim() || 'Tài khoản';

  const initials = createInitials(displayName);

  async function handleLogout(): Promise<void> {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const logoutRequest = logout().catch(() => undefined);

      await Promise.race([logoutRequest, createTimeout(LOGOUT_TIMEOUT_MS)]);
    } finally {
      // Hard navigation giúp thoát khỏi AuthHydrator hoặc router đang treo.
      window.location.replace('/login');
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
            disabled={isLoggingOut}
            onSelect={() => setIsConfirmOpen(true)}
            className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" strokeWidth={2} />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          if (!isLoggingOut) {
            setIsConfirmOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>

            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Hủy</AlertDialogCancel>

            <AlertDialogAction
              disabled={isLoggingOut}
              onClick={(event) => {
                event.preventDefault();
                void handleLogout();
              }}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Xác nhận đăng xuất
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
