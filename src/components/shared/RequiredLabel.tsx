import type { ComponentPropsWithoutRef } from 'react';

import { Label } from '@/components/ui/label';

type RequiredLabelProps = ComponentPropsWithoutRef<typeof Label>;

export function RequiredLabel({ children, ...props }: RequiredLabelProps) {
  return (
    <Label {...props}>
      {children}
      <span className="ml-0.5 text-rose-500" aria-hidden="true">
        *
      </span>
    </Label>
  );
}
