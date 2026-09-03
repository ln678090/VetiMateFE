import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  Receipt,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onProcessCancel?: (orderId: string, accept: boolean) => void;
}

const STATUS_MAP = {
  PENDING: { label: 'Chờ xác nhận', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Đang xử lý', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  SHIPPING: { label: 'Đang giao', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  DELIVERED: { label: 'Đã giao', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onProcessCancel,
}: OrderDetailsModalProps) {
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);

  if (!order) return null;

  const statusConfig = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
  let parsedNote = order.note && order.note !== 'null' ? order.note : '';
  let parsedAddress =
    order.shippingAddress && order.shippingAddress !== 'null' ? order.shippingAddress : '';
  let parsedPhone =
    order.customerPhone && order.customerPhone !== 'null' ? order.customerPhone : '';

  if (parsedNote.includes('Shipping Address:')) {
    const parts = parsedNote.split('|');
    parts.forEach((part) => {
      const p = part.trim();
      if (p.startsWith('Shipping Address:')) {
        parsedAddress = p.replace('Shipping Address:', '').trim();
      } else if (p.startsWith('Phone:')) {
        parsedPhone = p.replace('Phone:', '').trim();
      } else if (p.startsWith('Note:')) {
        parsedNote = p.replace('Note:', '').trim();
      }
    });
  }

  const cancelReasonMatch = parsedNote.match(/\[CANCEL_REQUEST\]: (.*)$/);
  const cancelReason = cancelReasonMatch ? cancelReasonMatch[1] : '';
  if (cancelReasonMatch) {
    parsedNote = parsedNote.replace(/\| \[CANCEL_REQUEST\]:.*$/, '').trim();
  }

  const customerName =
    order.customerName && order.customerName !== 'null' ? order.customerName : 'Khách vãng lai';
  const customerPhoneToDisplay = parsedPhone || 'Không có SĐT';
  const displayAddress = parsedAddress || 'Không có địa chỉ (Mua tại quầy)';

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] w-[95vw] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Chi tiết đơn hàng {order.code}</DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statusConfig.className}>
                {statusConfig.label}
              </Badge>
              {cancelReason && order.status !== 'CANCELLED' && (
                <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600">
                  Yêu cầu hủy
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          <div className="p-6 space-y-6">
            {cancelReason && order.status !== 'CANCELLED' && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-rose-900">
                      Khách hàng yêu cầu hủy đơn này
                    </h4>
                    <p className="text-sm text-rose-700 mt-1">
                      <span className="font-semibold">Lý do:</span> {cancelReason}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8"
                        onClick={() => {
                          if (onProcessCancel) onProcessCancel(order.id, true);
                          onClose();
                        }}
                      >
                        <Check className="w-4 h-4 mr-1" /> Đồng ý hủy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                        onClick={() => {
                          if (onProcessCancel) onProcessCancel(order.id, false);
                          onClose();
                        }}
                      >
                        <X className="w-4 h-4 mr-1" /> Từ chối
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-zinc-900">Thông tin khách hàng</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <User className="h-4 w-4" />
                    <span>{customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Phone className="h-4 w-4" />
                    <span>{customerPhoneToDisplay}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-zinc-900">Thông tin giao hàng</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-zinc-600">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="leading-tight">{displayAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-zinc-900">
                Sản phẩm ({order.items?.length || 0})
              </h3>
              <div className="rounded-md border divide-y">
                {(isItemsExpanded ? order.items || [] : (order.items || []).slice(0, 2)).map(
                  (item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3">
                      <div className="h-12 w-12 rounded-md bg-zinc-100 overflow-hidden relative shrink-0">
                        {item.productImage && item.productImage !== 'null' ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  )
                )}

                {(order.items?.length || 0) > 2 && (
                  <div className="flex justify-center border-t border-zinc-100 py-2 bg-zinc-50/50">
                    <button
                      type="button"
                      onClick={() => setIsItemsExpanded(!isItemsExpanded)}
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-blue-600 transition-colors"
                    >
                      {isItemsExpanded
                        ? 'Thu gọn'
                        : `Xem thêm ${(order.items?.length || 0) - 2} sản phẩm`}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`h-3 w-3 transition-transform duration-200 ${isItemsExpanded ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-zinc-900">Thanh toán</h3>
              <div className="bg-zinc-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-base text-zinc-900">
                  <span>Tổng thanh toán</span>
                  <span className="text-blue-600">{formatCurrency(order.finalAmount)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 mt-2">
                <CreditCard className="h-4 w-4" />
                <span>Phương thức: {order.paymentMethod || 'Tiền mặt'}</span>
              </div>
              {parsedNote && (
                <div className="flex items-start gap-2 text-sm text-zinc-600 mt-2 bg-yellow-50/50 p-3 rounded-md border border-yellow-100">
                  <Receipt className="h-4 w-4 mt-0.5 shrink-0 text-yellow-600" />
                  <span>Ghi chú: {parsedNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
