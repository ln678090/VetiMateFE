'use client';

import { useState } from 'react';
import { Search, Plus, ToggleLeft, ToggleRight, Edit } from 'lucide-react';
import type { MedicineResp, MedicineRequest } from '@/types/inventory';
import { useCreateMedicine, useUpdateMedicine, useToggleMedicine } from '../hooks/use-inventory';
import { getApiErrorMessage } from '@/lib/axios';
import { toast } from 'sonner';

interface MedicineTableProps {
  data: MedicineResp[] | undefined;
  isLoading: boolean;
}

export function MedicineTable({ data, isLoading }: MedicineTableProps) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MedicineResp | null>(null);

  const filtered = data?.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.sku && m.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-rose-200/50 transition-all hover:shadow-lg dark:shadow-rose-500/20"
        >
          <Plus className="h-4 w-4" />
          Thêm thuốc/vật tư
        </button>
      </div>

      {/* Form Dialog */}
      {showForm && (
        <MedicineForm
          editItem={editItem}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
        />
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200/70 bg-zinc-50/80 dark:border-zinc-700/60 dark:bg-zinc-800/40">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Tên
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  SKU
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  ĐVT
                </th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                  Tồn kho
                </th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                  Tồn tối thiểu
                </th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                  Giá nhập
                </th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
                  Giá bán
                </th>
                <th className="px-4 py-3 text-center font-medium text-zinc-600 dark:text-zinc-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered?.map((med) => (
                    <MedicineRow
                      key={med.id}
                      med={med}
                      onEdit={() => {
                        setEditItem(med);
                        setShowForm(true);
                      }}
                    />
                  ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered?.length === 0 && (
          <div className="py-12 text-center text-sm text-zinc-500">
            Không tìm thấy thuốc/vật tư nào
          </div>
        )}
      </div>
    </div>
  );
}

function MedicineRow({ med, onEdit }: { med: MedicineResp; onEdit: () => void }) {
  const toggleMutation = useToggleMedicine();
  const isLowStock = med.totalStock < med.minStock && med.minStock > 0;

  return (
    <tr className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-900 dark:text-white">{med.name}</span>
          {!med.isActive && (
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
              Ẩn
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{med.sku || '—'}</td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{med.unit}</td>
      <td className="px-4 py-3 text-right">
        <span
          className={`font-semibold ${
            isLowStock ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-white'
          }`}
        >
          {med.totalStock}
        </span>
        {isLowStock && <span className="ml-1 text-[10px] text-red-500">⚠ thấp</span>}
      </td>
      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{med.minStock}</td>
      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
        {med.importPrice.toLocaleString('vi-VN')}₫
      </td>
      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
        {med.sellPrice.toLocaleString('vi-VN')}₫
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            title="Sửa"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleMutation.mutate(med.id)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            title={med.isActive ? 'Ẩn' : 'Hiện'}
          >
            {med.isActive ? (
              <ToggleRight className="h-4 w-4 text-emerald-500" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

function MedicineForm({
  editItem,
  onClose,
}: {
  editItem: MedicineResp | null;
  onClose: () => void;
}) {
  const createMutation = useCreateMedicine();
  const updateMutation = useUpdateMedicine();

  const [form, setForm] = useState<MedicineRequest>({
    name: editItem?.name || '',
    sku: editItem?.sku || '',
    unit: editItem?.unit || '',
    minStock: editItem?.minStock || 0,
    importPrice: editItem?.importPrice || 0,
    sellPrice: editItem?.sellPrice || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data: form });
        toast.success('Cập nhật thuốc/vật tư thành công');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Thêm thuốc/vật tư thành công');
      }
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white/90 p-6 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80">
      <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">
        {editItem ? 'Sửa thuốc/vật tư' : 'Thêm thuốc/vật tư mới'}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            SKU
          </label>
          <input
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Đơn vị tính <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="viên, lọ, ml, ống..."
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Tồn tối thiểu
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.minStock}
            onChange={(e) => setForm({ ...form, minStock: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Giá nhập (₫)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.importPrice}
            onChange={(e) => setForm({ ...form, importPrice: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Giá bán (₫)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.sellPrice}
            onChange={(e) => setForm({ ...form, sellPrice: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <div className="col-span-full flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
          >
            {isPending ? 'Đang xử lý...' : editItem ? 'Cập nhật' : 'Thêm mới'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
