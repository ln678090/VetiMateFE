'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900',
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={dec}
        disabled={value <= min}
        aria-label="Giảm"
        className="h-10 w-10 rounded-r-none"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.4} />
      </Button>
      <span className="grid h-10 w-12 place-items-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={inc}
        disabled={value >= max}
        aria-label="Tăng"
        className="h-10 w-10 rounded-l-none"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
      </Button>
    </div>
  );
}
