import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const REASONS = [
  'Tôi muốn cập nhật địa chỉ/sđt nhận hàng',
  'Tôi muốn thay đổi sản phẩm/số lượng',
  'Thủ tục thanh toán quá rắc rối',
  'Tôi tìm thấy chỗ khác giá tốt hơn',
  'Tôi không có nhu cầu mua nữa',
  'Khác',
];

interface CancelOrderRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting?: boolean;
}

export function CancelOrderRequestModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CancelOrderRequestModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) return;
    const finalReason = selectedReason === 'Khác' ? otherReason : selectedReason;
    if (selectedReason === 'Khác' && !otherReason.trim()) return;

    onSubmit(finalReason);
  };

  const isFormValid =
    selectedReason && (selectedReason !== 'Khác' || otherReason.trim().length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lý do hủy đơn hàng</DialogTitle>
          <DialogDescription>
            Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này. Yêu cầu của bạn sẽ được gửi
            đến cửa hàng để xử lý.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="gap-3">
            {REASONS.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <RadioGroupItem value={reason} id={reason} />
                <Label htmlFor={reason} className="text-sm font-medium cursor-pointer">
                  {reason}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === 'Khác' && (
            <div className="pt-2">
              <Textarea
                placeholder="Vui lòng chia sẻ lý do cụ thể..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Không, giữ lại đơn
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hủy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
