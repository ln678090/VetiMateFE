'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthSubmitButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthSubmitButton({
  isLoading,
  loadingText = 'Đang xử lý',
  children,
  className,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn(
        'relative h-11 w-full overflow-hidden bg-gradient-to-br from-rose-500 via-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/40 disabled:opacity-70',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/0 before:via-white/20 before:to-white/0 before:opacity-0 before:transition-opacity hover:before:opacity-100',
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </span>
    </Button>
  );
}
