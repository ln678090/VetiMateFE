'use client';

import { useState } from 'react';
import { ClinicInvoiceDto, PaymentMethod } from '@/types/billing';
import { useBilling } from '@/hooks/useBilling';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

import { Banknote, CreditCard, Loader2, Landmark, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


interface BillingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: ClinicInvoiceDto;
}

export const BillingSheet = ({ open, onOpenChange, invoice }: BillingSheetProps) => {
  const { payInvoice, cancelInvoice, isPaying, isCanceling } = useBilling();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handlePay = () => {
    payInvoice(
      { id: invoice.id, data: { paymentMethod } },
      {
        onSuccess: () => {
          onOpenChange(false);
        }
      }
    );
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn hủy hóa đơn này không? Các sản phẩm/thuốc sẽ được hoàn lại kho.')) {
      cancelInvoice(invoice.id, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto w-full">
        <SheetHeader className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-xl text-indigo-700">Hóa đơn {invoice.invoiceCode}</SheetTitle>
              <SheetDescription>
                Tạo lúc {format(new Date(invoice.createdAt), 'HH:mm dd/MM/yyyy')}
              </SheetDescription>
            </div>
            {invoice.status === 'PENDING' && <Badge className="bg-amber-500">Chờ TT</Badge>}
            {invoice.status === 'PAID' && <Badge className="bg-green-500">Đã TT</Badge>}
            {invoice.status === 'CANCELLED' && <Badge variant="destructive">Đã hủy</Badge>}
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
            <h4 className="font-semibold text-slate-800 mb-3">Thông tin khách hàng</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Khách hàng:</span>
              <span className="font-medium">{invoice.customerName || 'Khách vãng lai'}</span>
            </div>
            {invoice.customerPhone && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-medium flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {invoice.customerPhone}
                </span>
              </div>
            )}
            {invoice.petName && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Thú cưng:</span>
                <span className="font-medium">{invoice.petName}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-3">Chi tiết dịch vụ</h4>
            <div className="space-y-3">
              {invoice.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1 pr-4">
                    <div className="font-medium text-slate-800">{item.name}</div>
                    <div className="text-slate-500">
                      {formatCurrency(item.unitPrice)} x {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-slate-900">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Tạm tính</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Giảm giá</span>
                <span>- {formatCurrency(invoice.discountAmount)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed">
                <span className="font-semibold text-slate-700">Tổng cộng</span>
                <span className="text-xl font-bold text-indigo-700">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {invoice.status === 'PENDING' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Phương thức thanh toán</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === 'CASH' ? 'default' : 'outline'}
                  className={cn("w-full h-auto py-3 flex-col gap-2", paymentMethod === 'CASH' && "bg-indigo-600 hover:bg-indigo-700")}
                  onClick={() => setPaymentMethod('CASH')}
                >
                  <Banknote className="h-5 w-5" />
                  <span className="text-xs">Tiền mặt</span>
                </Button>
                <Button
                  variant={paymentMethod === 'BANK_TRANSFER' ? 'default' : 'outline'}
                  className={cn("w-full h-auto py-3 flex-col gap-2", paymentMethod === 'BANK_TRANSFER' && "bg-indigo-600 hover:bg-indigo-700")}
                  onClick={() => setPaymentMethod('BANK_TRANSFER')}
                >
                  <Landmark className="h-5 w-5" />
                  <span className="text-xs">Chuyển khoản</span>
                </Button>
                <Button
                  variant={paymentMethod === 'CARD' ? 'default' : 'outline'}
                  className={cn("w-full h-auto py-3 flex-col gap-2", paymentMethod === 'CARD' && "bg-indigo-600 hover:bg-indigo-700")}
                  onClick={() => setPaymentMethod('CARD')}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Quẹt thẻ</span>
                </Button>
              </div>
            </div>
          )}

          {invoice.status === 'PAID' && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Đã thanh toán</span>
              </div>
              <div className="text-sm font-medium text-green-800">
                {invoice.paymentMethod === 'CASH' ? 'Tiền mặt' : 
                 invoice.paymentMethod === 'CARD' ? 'Quẹt thẻ' : 'Chuyển khoản'}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-8 flex-row justify-between sm:justify-between w-full">
          {invoice.status === 'PENDING' ? (
            <>
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                disabled={isCanceling || isPaying}
              >
                {isCanceling ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hủy HĐ'}
              </Button>
              <Button 
                onClick={handlePay} 
                disabled={isPaying || isCanceling}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Thanh toán {formatCurrency(invoice.totalAmount)}
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
