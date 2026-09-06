'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import type {
  VoucherType,
  VoucherItemRequest,
  CreateVoucherRequest,
  MedicineResp,
} from '@/types/inventory';
import { useCreateVoucher, useMedicines } from '../hooks/use-inventory';
import { getApiErrorMessage } from '@/lib/axios';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/features/shop/api/product.api';
import { useAuthStore } from '@/stores/auth.store';
import { getAuthoritiesFromToken } from '@/lib/auth-roles';

type ItemCategory = 'medicine' | 'product';

export function VoucherForm({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const createMutation = useCreateVoucher();
  const { data: medicines } = useMedicines(true);
  const { data: productsData } = useQuery({
    queryKey: ['products-for-inventory'],
    queryFn: async () => {
      const res = await productApi.getProducts();
      return res.data;
    },
  });

  const products = productsData?.items || [];

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const authorities = getAuthoritiesFromToken(accessToken);
  const isShopStaff = authorities.includes('ROLE_SHOP_STAFF');
  const isWarehouse = authorities.includes('ROLE_WAREHOUSE');

  const defaultCategory = isShopStaff ? 'product' : 'medicine';

  const [type, setType] = useState<VoucherType>('IMPORT');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<VoucherItemRequest[]>([{ quantity: 1, unitPrice: 0 }]);
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([defaultCategory]);

  const addItem = () => {
    setItems([...items, { quantity: 1, unitPrice: 0 }]);
    setItemCategories([...itemCategories, defaultCategory]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_: any, i: number) => i !== idx));
    setItemCategories(itemCategories.filter((_: any, i: number) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof VoucherItemRequest, value: unknown) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const updateItemCategory = (idx: number, cat: ItemCategory) => {
    setItemCategories((prev) => {
      const updated = [...prev];
      updated[idx] = cat;
      return updated;
    });
    setItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], medicineId: undefined, productId: undefined };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some((i) => !i.medicineId && !i.productId)) {
      toast.error('Vui lòng chọn sản phẩm/thuốc cho tất cả các dòng');
      return;
    }

    const req: CreateVoucherRequest = {
      type,
      note: note || undefined,
      items: items.map((item) => ({
        ...item,
        medicineId: item.medicineId || undefined,
        productId: item.productId || undefined,
      })),
    };
    try {
      await createMutation.mutateAsync(req);
      if (onSuccess) onSuccess();
      else router.push('/inventory/vouchers');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const calculateTotal = () => {
    return items.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-m3-on-surface">Tạo Phiếu Kho</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (onCancel) onCancel();
              else router.push('/inventory/vouchers');
            }}
            className="px-4 py-2 border border-m3-outline rounded-lg text-m3-on-surface hover:bg-m3-surface-variant flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Hủy
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-m3-primary text-m3-on-primary rounded-lg hover:bg-m3-primary/90 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      <div className="bg-m3-surface-container rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-m3-on-surface mb-1">
              Loại phiếu *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VoucherType)}
              className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface"
            >
              <option value="IMPORT">Nhập kho</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-m3-on-surface mb-1">Ghi chú</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface"
              placeholder="Nhập ghi chú..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-m3-on-surface">Chi tiết hàng hóa</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-m3-secondary-container text-m3-on-secondary-container rounded-lg flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Thêm dòng
          </button>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="bg-m3-surface-container rounded-xl p-6 relative">
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute top-4 right-4 text-m3-error hover:opacity-80 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-m3-on-surface mb-1">
                  Phân loại
                </label>
                <select
                  value={itemCategories[idx]}
                  onChange={(e) => updateItemCategory(idx, e.target.value as ItemCategory)}
                  className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isShopStaff && !isWarehouse}
                >
                  <option value="medicine">Thuốc & Vật tư</option>
                  <option value="product">Sản phẩm Shop</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-m3-on-surface mb-1">
                  Hàng hóa *
                </label>
                {itemCategories[idx] === 'medicine' ? (
                  <select
                    value={item.medicineId || ''}
                    onChange={(e) => {
                      updateItem(idx, 'medicineId', e.target.value || undefined);
                      if (e.target.value) updateItem(idx, 'productId', undefined);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface"
                  >
                    <option value="">-- Chọn thuốc / vật tư --</option>
                    {medicines?.map((m: MedicineResp) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.unit})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={item.productId || ''}
                    onChange={(e) => {
                      updateItem(idx, 'productId', e.target.value || undefined);
                      if (e.target.value) updateItem(idx, 'medicineId', undefined);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface"
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.sku ? `(${p.sku})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {type === 'IMPORT' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-m3-on-surface mb-1">
                      Số Lô
                    </label>
                    <input
                      value={item.batchCode || ''}
                      onChange={(e) => updateItem(idx, 'batchCode', e.target.value || undefined)}
                      placeholder="VD: LOT-01"
                      className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-m3-on-surface mb-1">
                      Hạn Sử Dụng *
                    </label>
                    <input
                      type="date"
                      required
                      value={item.expiryDate || ''}
                      onChange={(e) => updateItem(idx, 'expiryDate', e.target.value || undefined)}
                      className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-m3-on-surface mb-1">
                  Số lượng *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={item.quantity === 0 ? '' : item.quantity}
                  onChange={(e) =>
                    updateItem(idx, 'quantity', e.target.value ? parseFloat(e.target.value) : 0)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-m3-on-surface mb-1">Đơn giá</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={item.unitPrice === 0 ? '' : item.unitPrice}
                  onChange={(e) =>
                    updateItem(idx, 'unitPrice', e.target.value ? parseFloat(e.target.value) : 0)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-m3-outline bg-m3-surface text-m3-on-surface"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-m3-surface-container rounded-xl p-6 flex justify-between items-center">
        <span className="text-lg font-semibold text-m3-on-surface">Tổng cộng:</span>
        <span className="text-2xl font-bold text-m3-primary">
          {calculateTotal().toLocaleString('vi-VN')} ₫
        </span>
      </div>
    </form>
  );
}
