'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VoucherForm } from '@/features/inventory/components/VoucherForm';

interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateVoucherModal({ isOpen, onClose }: CreateVoucherModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Tạo phiếu kho</DialogTitle>
        <VoucherForm onSuccess={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
