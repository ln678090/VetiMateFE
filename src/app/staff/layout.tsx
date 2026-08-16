import { ReactNode } from 'react';

import { AppTopbar } from '@/components/shared/AppTopbar';
import { StaffSidebar } from '@/components/shared/StaffSidebar';

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50">
      <StaffSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
