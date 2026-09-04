'use client';

import { useState } from 'react';
import { Search, Plus, ToggleLeft, ToggleRight, Edit } from 'lucide-react';
import type { SupplierResp, SupplierRequest } from '@/types/inventory';
import { useCreateSupplier, useUpdateSupplier, useToggleSupplier } from '../hooks/use-inventory';
import { getApiErrorMessage } from '@/lib/axios';
import { toast } from 'sonner';

interface SupplierTableProps {
  data: SupplierResp[] | undefined;
  isLoading: boolean;
}

export function SupplierTable({ data, isLoading }: SupplierTableProps) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<SupplierResp | null>(null);

  const filtered = data?.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm nhà cung cấp..."
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
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200/50 transition-all hover:shadow-lg dark:shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          Thêm NCC
        </button>
      </div>

      {showForm && (
        <SupplierForm
          editItem={editItem}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200/70 bg-zinc-50/80 dark:border-zinc-700/60 dark:bg-zinc-800/40">
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Tên NCC
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Điện thoại
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Email
                </th>
                <th className="px-4 py-3 text-center font-medium text-zinc-600 dark:text-zinc-400">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center font-medium text-zinc-600 dark:text-zinc-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered?.map((supplier) => (
                    <SupplierRow
                      key={supplier.id}
                      supplier={supplier}
                      onEdit={() => {
                        setEditItem(supplier);
                        setShowForm(true);
                      }}
                    />
                  ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered?.length === 0 && (
          <div className="py-12 text-center text-sm text-zinc-500">
            Không tìm thấy nhà cung cấp nào
          </div>
        )}
      </div>
    </div>
  );
}

function SupplierRow({ supplier, onEdit }: { supplier: SupplierResp; onEdit: () => void }) {
  const toggleMutation = useToggleSupplier();

  return (
    <tr className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30">
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{supplier.name}</td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{supplier.phone || '—'}</td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{supplier.email || '—'}</td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            supplier.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          {supplier.isActive ? 'Hoạt động' : 'Ngừng'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleMutation.mutate(supplier.id)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            {supplier.isActive ? (
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

function SupplierForm({
  editItem,
  onClose,
}: {
  editItem: SupplierResp | null;
  onClose: () => void;
}) {
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();

  const [form, setForm] = useState<SupplierRequest>({
    name: editItem?.name || '',
    phone: editItem?.phone || '',
    email: editItem?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data: form });
        toast.success('Cập nhật NCC thành công');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Thêm NCC thành công');
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
        {editItem ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Tên NCC <span className="text-red-500">*</span>
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
            Điện thoại
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
          />
        </div>
        <div className="col-span-full flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
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
