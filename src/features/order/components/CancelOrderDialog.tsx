'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCancelOrder } from '../hooks/use-orders';

interface CancelOrderDialogProps {
  orderId: string;
  orderCode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CancelOrderDialog({
  orderId,
  orderCode,
  open,
  onOpenChange,
  onSuccess,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState('');
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  const handleConfirmCancel = () => {
    cancelOrder(
      {
        orderId,
        request: { reason: reason.trim() || 'Khách hàng yêu cầu hủy đơn' },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setReason('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60">
            <AlertTriangle className="size-6 text-rose-600 dark:text-rose-400" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            Xác nhận hủy đơn hàng #{orderCode}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Bạn có chắc chắn muốn hủy đơn hàng này không? Thao tác này sẽ cập nhật trạng
            thái đơn hàng thành <strong>Đã hủy</strong> và không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Lý do hủy đơn (tùy chọn)
          </label>
          <Textarea
            placeholder="Nhập lý do hủy (ví dụ: Thay đổi địa chỉ nhận, đặt nhầm sản phẩm...)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="resize-none text-sm"
            disabled={isPending}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isPending}>
              Quay lại
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            type="button"
            onClick={handleConfirmCancel}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Xác nhận hủy đơn</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
