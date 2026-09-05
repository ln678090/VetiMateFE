import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ORDER_STATUS_CONFIG, type OrderStatus } from '@/types/order';
import {
  CheckCheck,
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  XCircle,
} from 'lucide-react';

interface OrderBadgeProps {
  status: OrderStatus;
  className?: string;
  showIcon?: boolean;
}

export function OrderBadge({ status, className, showIcon = true }: OrderBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] ?? {
    label: status,
    color: 'text-zinc-700 dark:text-zinc-300',
    badgeBg: 'bg-zinc-100 dark:bg-zinc-800',
    badgeBorder: 'border-zinc-200 dark:border-zinc-700',
    dotColor: 'bg-zinc-400',
  };

  const renderIcon = () => {
    switch (status) {
      case 'PENDING':
        return <Clock className="size-3.5" />;
      case 'CONFIRMED':
        return <CheckCircle2 className="size-3.5" />;
      case 'PREPARING':
        return <PackageCheck className="size-3.5" />;
      case 'SHIPPING':
        return <Truck className="size-3.5 animate-pulse" />;
      case 'DELIVERED':
        return <CheckCheck className="size-3.5" />;
      case 'CANCELLED':
        return <XCircle className="size-3.5" />;
      default:
        return null;
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors',
        config.color,
        config.badgeBg,
        config.badgeBorder,
        className
      )}
    >
      {showIcon && renderIcon()}
      <span>{config.label}</span>
    </Badge>
  );
}
