import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface StaffCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

export function StaffCancelModal({ isOpen, onClose, onConfirm, isPending }: StaffCancelModalProps) {
  const [reason, setReason] = useState('');

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      setReason('');
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hủy đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="VD: Sản phẩm thực tế đã hết hàng, mong quý khách thông cảm..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none h-24"
            />
            <p className="text-[12px] text-zinc-500">
              Lý do này sẽ được lưu lại và gửi đến thông báo của khách hàng.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Đóng
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isPending}
          >
            {isPending ? 'Đang xử lý...' : 'Xác nhận Hủy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
