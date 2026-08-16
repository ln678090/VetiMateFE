import type { ReactNode } from 'react';

import { AppSidebar } from '@/components/shared/AppSidebar';
import { AppTopbar } from '@/components/shared/AppTopbar';
import { RequireAuth } from '@/components/shared/AuthGuard';
import { RoleRedirect } from '@/components/shared/RoleRedirect';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <RoleRedirect />
      <div className="min-h-screen bg-gradient-to-br from-rose-50/40 via-white to-sky-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="flex">
          <AppSidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <AppTopbar />
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
