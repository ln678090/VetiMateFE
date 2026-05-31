import type { ReactNode } from 'react';

import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingHeader } from '@/features/landing/components/LandingHeader';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}
