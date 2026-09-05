'use client';

import { cn } from '@/lib/utils';
import type { OrderStatus, TrackingStepResponse } from '@/types/order';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  XCircle,
} from 'lucide-react';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  trackingHistory?: TrackingStepResponse[];
  className?: string;
}

interface StepDefinition {
  status: OrderStatus;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NORMAL_STEPS: StepDefinition[] = [
  {
    status: 'PENDING',
    label: 'Đã đặt hàng',
    sublabel: 'Đơn hàng đã được tạo thành công',
    icon: Clock,
  },
  {
    status: 'CONFIRMED',
    label: 'Đã xác nhận',
    sublabel: 'Cửa hàng đã xác nhận đơn hàng',
    icon: CheckCircle2,
  },
  {
    status: 'PREPARING',
    label: 'Đang chuẩn bị',
    sublabel: 'Sản phẩm đang được đóng gói tại kho',
    icon: PackageCheck,
  },
  {
    status: 'SHIPPING',
    label: 'Đang giao hàng',
    sublabel: 'Đơn hàng đang trên đường giao đến bạn',
    icon: Truck,
  },
  {
    status: 'DELIVERED',
    label: 'Đã giao hàng',
    sublabel: 'Giao hàng thành công',
    icon: Check,
  },
];

const CANCELLED_STEPS: StepDefinition[] = [
  {
    status: 'PENDING',
    label: 'Đã đặt hàng',
    sublabel: 'Đơn hàng đã được tạo thành công',
    icon: Clock,
  },
  {
    status: 'CANCELLED',
    label: 'Đã hủy đơn',
    sublabel: 'Đơn hàng đã bị hủy',
    icon: XCircle,
  },
];

function formatTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function OrderTimeline({
  currentStatus,
  trackingHistory = [],
  className,
}: OrderTimelineProps) {
  const isCancelled = currentStatus === 'CANCELLED';
  const steps = isCancelled ? CANCELLED_STEPS : NORMAL_STEPS;

  // Map tracking history by status for quick lookup
  const historyMap = new Map<string, TrackingStepResponse>();
  trackingHistory.forEach((t) => {
    historyMap.set(t.status, t);
  });

  // Calculate current index in the steps list
  const currentStepIndex = steps.findIndex((s) => s.status === currentStatus);

  return (
    <div className={cn('relative py-2', className)}>
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const historyEntry = historyMap.get(step.status);
          const isDone = isCancelled
            ? step.status === 'PENDING' || step.status === 'CANCELLED'
            : currentStepIndex >= idx;
          const isCurrent = step.status === currentStatus;
          const isUpcoming = !isDone && !isCurrent;
          const isLast = idx === steps.length - 1;

          // Icon and status indicators
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative flex items-start gap-4">
              {/* Vertical line connecting to next step */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-5 top-10 -ml-px w-0.5 transition-colors duration-500',
                    isCancelled
                      ? 'bg-rose-200 dark:bg-rose-900/60'
                      : isDone && currentStepIndex > idx
                        ? 'bg-emerald-500 dark:bg-emerald-400'
                        : 'bg-zinc-200 dark:bg-zinc-800'
                  )}
                  style={{ height: 'calc(100% + 8px)' }}
                />
              )}

              {/* Step Circle Icon */}
              <div
                className={cn(
                  'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                  // Cancelled state
                  step.status === 'CANCELLED' &&
                    'border-rose-500 bg-rose-50 text-rose-600 shadow-sm dark:bg-rose-950/70 dark:text-rose-400',
                  // Completed state
                  isDone &&
                    !isCurrent &&
                    step.status !== 'CANCELLED' &&
                    'border-emerald-500 bg-emerald-500 text-white shadow-sm dark:border-emerald-400 dark:bg-emerald-500',
                  // Current active state
                  isCurrent &&
                    step.status !== 'CANCELLED' &&
                    'border-emerald-500 bg-emerald-50 text-emerald-600 ring-4 ring-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-400/20',
                  // Upcoming state
                  isUpcoming &&
                    'border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500'
                )}
              >
                {isDone && !isCurrent && step.status !== 'CANCELLED' ? (
                  <Check className="size-5 stroke-[2.5]" />
                ) : (
                  <Icon className="size-5" />
                )}
              </div>

              {/* Step Information */}
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4
                    className={cn(
                      'text-sm font-semibold tracking-tight',
                      isCurrent
                        ? step.status === 'CANCELLED'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                        : isDone
                          ? 'text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-400 dark:text-zinc-500'
                    )}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                        Hiện tại
                      </span>
                    )}
                  </h4>

                  {/* Timestamp */}
                  {historyEntry?.time && (
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {formatTime(historyEntry.time)}
                    </span>
                  )}
                </div>

                {/* Note / Sublabel */}
                <p
                  className={cn(
                    'mt-0.5 text-xs',
                    isDone || isCurrent
                      ? 'text-zinc-600 dark:text-zinc-400'
                      : 'text-zinc-400 dark:text-zinc-500'
                  )}
                >
                  {historyEntry?.note || step.sublabel}
                </p>

                {/* Additional cancellation warning if cancelled */}
                {step.status === 'CANCELLED' && historyEntry?.note && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/70 p-2.5 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                    <AlertCircle className="size-4 shrink-0 text-rose-500" />
                    <span>{historyEntry.note}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
