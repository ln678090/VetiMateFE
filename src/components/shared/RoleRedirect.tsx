'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

export function RoleRedirect() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      const roles = user.roles || [];
      const isStaffOrAdmin = roles.some(role => role.includes('STAFF') || role.includes('ADMIN'));
      if (isStaffOrAdmin) {
        router.replace('/staff/dashboard');
      }
    }
  }, [user, router]);

  return null;
}
