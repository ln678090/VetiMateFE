'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RequiredLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Label có chấm sao đỏ khi required.
 * Dùng thay <FormLabel> trong form bắt buộc.
 */
export function RequiredLabel({
  required = false,
  children,
  className,
  ...props
}: RequiredLabelProps) {
  return (
    <Label
      className={cn('text-sm font-medium text-zinc-700 dark:text-zinc-300', className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-rose-500 dark:text-rose-400">
          *
        </span>
      )}
    </Label>
  );
}
