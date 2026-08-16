'use client';

import { useQuery } from '@tanstack/react-query';
import { Search, Package } from 'lucide-react';
import { useState } from 'react';

import { AuthGuard } from '@/components/shared/AuthGuard';
import { staffService } from '@/services/staff.service';

export default function StaffInventoryPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['staff', 'inventory', page, search],
    queryFn: () => staffService.getInventory(page, 20, search),
  });

  return (
    <AuthGuard requireRoles={['ROLE_SHOP_STAFF', 'ROLE_MANAGER']}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Quản lý Tồn kho</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Theo dõi và kiểm soát số lượng sản phẩm trong kho.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80">
              <span>Nhập kho</span>
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80">
              <span>Xuất kho</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, SKU..."
              className="w-full rounded-xl border-none bg-zinc-100/50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 transition-colors focus:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/50 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Sản phẩm</th>
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 font-medium">Tồn kho hiện tại</th>
                  <th className="px-6 py-4 font-medium">Tình trạng</th>
                  <th className="px-6 py-4 font-medium text-right">Cập nhật nhanh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-rose-500">Đã có lỗi xảy ra khi tải dữ liệu.</td>
                  </tr>
                ) : !data?.items?.length ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Không tìm thấy sản phẩm nào trong kho.</td>
                  </tr>
                ) : (
                  data.items.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.png';
                              }}
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                              <Package className="h-5 w-5 text-zinc-400" />
                            </div>
                          )}
                          <span className="font-medium text-zinc-900 dark:text-white line-clamp-1 max-w-[200px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{product.sku || 'N/A'}</td>
                      <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                        {product.stockQuantity}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.stockQuantity > 10 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : product.stockQuantity > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                          {product.stockQuantity > 10 ? 'Còn hàng' : product.stockQuantity > 0 ? 'Sắp hết' : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input
                          type="number"
                          className="w-20 rounded-lg border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                          defaultValue={product.stockQuantity}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
