'use client';

import { Loader2, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
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
import { useAuth } from '@/hooks/use-auth';
import { getAuthoritiesFromToken, getRoleDisplayName, getRoleInitials } from '@/lib/auth-roles';
import { useAuthStore } from '@/stores/auth.store';

export function UserMenu() {
  const { user, logout } = useAuth();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const authorities = useMemo(() => getAuthoritiesFromToken(accessToken), [accessToken]);
  const roleName = useMemo(() => getRoleDisplayName(authorities), [authorities]);

  const displayName = user?.fullName || roleName;
  const initials = useMemo(
    () => getRoleInitials(authorities, user?.fullName || user?.username),
    [authorities, user]
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-full p-1 pr-3.5 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8 ring-2 ring-rose-200/60 dark:ring-rose-500/30">
            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-amber-400 text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start text-left md:flex">
            <span className="text-sm font-semibold leading-tight text-zinc-800 dark:text-zinc-200">
              {displayName}
            </span>
            <span className="text-[11px] font-medium leading-none text-zinc-500 dark:text-zinc-400">
              {roleName}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1 py-1">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{displayName}</span>
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <ShieldCheck className="size-3.5" />
              <span>{roleName}</span>
            </div>
            {user?.email && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <UserCircle2 className="h-4 w-4" strokeWidth={2} />
            Hồ sơ của tôi
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10 cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" strokeWidth={2} />
          )}
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
