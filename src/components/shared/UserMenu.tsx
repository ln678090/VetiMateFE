'use client';

import { Loader2, LogOut, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Initials từ fullName hoặc username, fallback "S"
  const accessToken = useAuthStore((s) => s.accessToken);
  const authorities = getAuthoritiesFromToken(accessToken);
  const isCustomer = authorities.includes('ROLE_USER');
  const fallbackName = isCustomer ? 'Khách hàng' : 'Nhân viên';
  const displayName = user?.fullName || user?.username || fallbackName;
  const initials = displayName
    .split(' ')
    .map((s) => s[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-1 pr-3 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="User menu"
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

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{displayName}</span>
            {user?.email && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10"
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
