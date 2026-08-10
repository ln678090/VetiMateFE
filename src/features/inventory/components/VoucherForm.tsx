'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Plus, Trash2, Package, QrCode, CreditCard } from 'lucide-react';
import type {
  VoucherType,
  VoucherItemRequest,
  CreateVoucherRequest,
  MedicineResp,
} from '@/types/inventory';
import { useCreateVoucher, useMedicines } from '../hooks/use-inventory';
import { getApiErrorMessage } from '@/lib/axios';
import { toast } from 'sonner';

export function VoucherForm() {
  const router = useRouter();
  const createMutation = useCreateVoucher();
  const { data: medicines } = useMedicines(true);

  const [type, setType] = useState<VoucherType>('IMPORT');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<VoucherItemRequest[]>([
    { quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => setItems([...items, { quantity: 1, unitPrice: 0 }]);
  const removeItem = (idx: number) =>
    setItems(items.filter((_: any, i: number) => i !== idx));

  const updateItem = (idx: number, field: keyof VoucherItemRequest, value: unknown) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const req: CreateVoucherRequest = {
      type,
      note: note || undefined,
      items: items.map((item: VoucherItemRequest) => ({
        ...item,
        medicineId: item.medicineId || undefined,
        productId: item.productId || undefined,
      })),
    };
    try {
      await createMutation.mutateAsync(req);
      toast.success('Tạo phiếu kho thành công');
      router.push('/inventory/vouchers');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const calculateTotal = () => {
    return items.reduce((acc: number, item: VoucherItemRequest) => acc + (item.quantity * (item.unitPrice || 0)), 0);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-m3-background min-h-full">
      {/* Header Area */}
      <header className="px-4 md:px-[48px] py-[24px] md:py-[40px] bg-m3-surface-container-lowest border-b border-m3-outline-variant/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px]">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-[24px] md:text-[32px] font-semibold text-m3-on-surface mb-1">
              {type === 'IMPORT' ? 'Nhập Kho Mới' : type === 'EXPORT' ? 'Xuất Kho Mới' : 'Phiếu Kiểm Kê'}
            </h2>
            <p className="font-body-md text-[16px] text-m3-on-surface-variant">
              Tạo phiếu ghi nhận giao dịch vào hệ thống kho Central Clinic.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => router.push('/inventory/vouchers')}
              className="flex-1 md:flex-none px-[24px] py-[12px] bg-m3-surface text-m3-primary border border-m3-primary font-label-md text-[14px] font-semibold rounded-lg hover:bg-m3-primary-container/10 transition-colors flex items-center justify-center gap-1.5"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 md:flex-none px-[24px] py-[12px] bg-m3-primary text-m3-on-primary font-label-md text-[14px] font-semibold rounded-lg hover:bg-m3-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-[18px] h-[18px]" /> 
              {createMutation.isPending ? 'Đang lưu...' : 'Lưu Phiếu'}
            </button>
          </div>
        </div>
      </header>

      {/* Form Area */}
      <div className="flex-1 px-4 md:px-[48px] py-[24px] md:py-[40px] overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-[24px]">
          
          {/* General Info */}
          <section className="bg-m3-surface-container-lowest p-[24px] rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-m3-outline-variant/20">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
               <div className="space-y-[4px]">
                  <label className="font-label-sm text-[12px] text-m3-on-surface-variant">Loại phiếu <span className="text-m3-error">*</span></label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as VoucherType)}
                    className="w-full px-[12px] py-[12px] bg-m3-surface border border-m3-outline-variant rounded-lg font-body-md text-[16px] text-m3-on-surface focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 transition-all outline-none"
                  >
                    <option value="IMPORT">Nhập kho</option>
                    <option value="EXPORT">Xuất kho</option>
                    <option value="STOCKTAKE">Kiểm kê</option>
                  </select>
               </div>
               <div className="space-y-[4px]">
                  <label className="font-label-sm text-[12px] text-m3-on-surface-variant">Ghi chú chung</label>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="VD: Nhập lô hàng tháng 8..."
                    className="w-full px-[12px] py-[12px] bg-m3-surface border border-m3-outline-variant rounded-lg font-body-md text-[16px] text-m3-on-surface focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 transition-all outline-none"
                  />
               </div>
             </div>
          </section>

          {/* Line Items */}
          <div className="flex items-center justify-between mb-2">
             <h3 className="font-headline-md text-[24px] font-semibold text-m3-on-surface">Chi tiết mặt hàng</h3>
             <button
               type="button"
               onClick={addItem}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-m3-surface-container text-m3-on-surface-variant hover:bg-m3-surface-variant transition-colors font-label-md text-[14px]"
             >
               <Plus className="w-4 h-4" /> Thêm dòng
             </button>
          </div>

          {items.map((item: VoucherItemRequest, idx: number) => (
             <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-[24px] pb-6 border-b border-m3-outline-variant/30 last:border-0 relative">
               
               {/* Main Form Column */}
               <div className="md:col-span-8 space-y-[24px]">
                 
                 {/* Product Selection */}
                 <section className="bg-m3-surface-container-lowest p-[24px] rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-m3-outline-variant/20">
                    <h4 className="font-headline-md text-[18px] font-semibold text-m3-on-surface mb-[12px] flex items-center gap-[12px]">
                       <span className="text-m3-primary bg-m3-primary-container/20 p-[4px] rounded-full"><Package className="w-5 h-5"/></span>
                       Thông tin Sản phẩm #{idx + 1}
                    </h4>
                    <div className="space-y-[12px]">
                      <div className="space-y-[4px]">
                        <label className="font-label-sm text-[12px] text-m3-on-surface-variant">Sản phẩm / Vật tư <span className="text-m3-error">*</span></label>
                        <select
                          value={item.medicineId || ''}
                          onChange={(e) => {
                            updateItem(idx, 'medicineId', e.target.value || undefined);
                            if (e.target.value) updateItem(idx, 'productId', undefined);
                          }}
                          className="w-full px-[12px] py-[12px] bg-m3-surface border border-m3-outline-variant rounded-lg font-body-md text-[16px] text-m3-on-surface focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 transition-all outline-none"
                        >
                          <option value="">-- Chọn sản phẩm --</option>
                          {medicines?.map((m: MedicineResp) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                 </section>

                 {/* Batch Details (Only for IMPORT) */}
                 {type === 'IMPORT' && (
                 <section className="bg-m3-surface-container-lowest p-[24px] rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-m3-outline-variant/20">
                    <h4 className="font-headline-md text-[18px] font-semibold text-m3-on-surface mb-[12px] flex items-center gap-[12px]">
                       <span className="text-m3-tertiary-container bg-m3-tertiary-container/20 p-[4px] rounded-full"><QrCode className="w-5 h-5"/></span>
                       Chi tiết Lô hàng
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                      <div className="space-y-[4px]">
                        <label className="font-label-sm text-[12px] text-m3-on-surface-variant">Số Lô (Batch Code)</label>
                        <input
                          value={item.note || ''}
                          onChange={(e) => updateItem(idx, 'note', e.target.value || undefined)}
                          placeholder="VD: LOT-2024-01"
                          className="w-full px-[12px] py-[12px] bg-m3-surface border border-m3-outline-variant rounded-lg font-body-md text-[16px] text-m3-on-surface focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 transition-all outline-none"
                        />
                      </div>
                      {/* Note: Full expiration date logic requires adding expiryDate to VoucherItemRequest, simplifying to note for now */}
                      <div className="space-y-[4px]">
                        <label className="font-label-sm text-[12px] text-m3-on-surface-variant">Ghi chú mặt hàng</label>
                        <input
                          placeholder="Ghi chú thêm..."
                          className="w-full px-[12px] py-[12px] bg-m3-surface border border-m3-outline-variant rounded-lg font-body-md text-[16px] text-m3-on-surface focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 transition-all outline-none"
                        />
                      </div>
                    </div>
                 </section>
                 )}
               </div>

               {/* Side Panel Column (Pricing & Quantity) */}
               <div className="md:col-span-4 space-y-[24px]">
                 <section className="bg-m3-surface-container-lowest p-[24px] rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-m3-outline-variant/20 h-full flex flex-col relative">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="absolute top-4 right-4 p-2 text-m3-error/60 hover:text-m3-error hover:bg-m3-error/10 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <h4 className="font-headline-md text-[18px] font-semibold text-m3-on-surface mb-[12px] flex items-center gap-[12px]">
                       <span className="text-m3-secondary bg-m3-secondary/20 p-[4px] rounded-full"><CreditCard className="w-5 h-5"/></span>
                       Số lượng & Giá
                    </h4>
                    <div className="space-y-[12px] flex-1 mt-4">
                      <div className="space-y-[4px]">
                        <label className="font-label-sm text-[12px] text-m3-on-surface-variant">Số lượng <span className="text-m3-error">*</span></label>
                        <input
                          type="number"
                          min="0.01" step="0.01" required
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-[12px] py-[12px] text-right bg-m3-surface border border-m3-outline-variant rounded-lg font-body-md text-[16px] text-m3-on-surface focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 transition-all outline-none"
                        />
                      </div>
                      
                      <div className="space-y-[4px] pt-[4px]">
                        <label className="font-label-sm text-[12px] text-m3-on-surface-variant">Đơn giá (VNĐ) <span className="text-m3-error">*</span></label>
                        <div className="relative">
                          <input
                            type="number" min="0" step="1"
                            value={item.unitPrice || 0}
                            onChange={(e) => updateItem(idx, 'unitPrice', e.target.value ? parseFloat(e.target.value) : 0)}
                            className="w-full pr-[40px] pl-[12px] py-[12px] text-right bg-m3-surface border border-m3-outline-variant rounded-lg font-body-md text-[16px] text-m3-on-surface focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 transition-all outline-none"
                          />
                          <span className="absolute right-[12px] top-1/2 -translate-y-1/2 text-m3-on-surface-variant font-label-md text-[14px]">₫</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-[24px] border-t border-m3-outline-variant/50">
                        <div className="flex justify-between items-center mb-[4px]">
                          <span className="font-body-sm text-[14px] text-m3-on-surface-variant">Tạm tính:</span>
                          <span className="font-headline-md text-[24px] font-semibold text-m3-primary">
                            {(item.quantity * (item.unitPrice || 0)).toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      </div>
                    </div>
                 </section>
               </div>
             </div>
          ))}

          {/* Grand Total */}
          <div className="bg-m3-surface-container-lowest p-[24px] rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-m3-outline-variant/20 flex justify-between items-center">
             <span className="font-headline-md text-[24px] font-semibold text-m3-on-surface">Tổng cộng:</span>
             <span className="font-display-lg text-[32px] font-bold text-m3-primary">{calculateTotal().toLocaleString('vi-VN')} ₫</span>
          </div>

        </div>
      </div>
    </form>
  );
}
