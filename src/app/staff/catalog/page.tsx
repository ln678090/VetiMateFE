'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, Tags } from 'lucide-react';
import { useState } from 'react';

import { AuthGuard } from '@/components/shared/AuthGuard';
import { staffService } from '@/services/staff.service';

export default function StaffCatalogPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');

  const { data: categories, isLoading: isLoadingCats, isError: isErrorCats } = useQuery({
    queryKey: ['staff', 'catalog', 'categories'],
    queryFn: () => staffService.getCategories(),
  });

  const { data: brands, isLoading: isLoadingBrands, isError: isErrorBrands } = useQuery({
    queryKey: ['staff', 'catalog', 'brands'],
    queryFn: () => staffService.getBrands(),
  });

  return (
    <AuthGuard requireRoles={['ROLE_SHOP_STAFF', 'ROLE_MANAGER']}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Quản lý Danh mục & Thương hiệu</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Phân loại sản phẩm và quản lý các thương hiệu.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            <span>Thêm {activeTab === 'categories' ? 'danh mục' : 'thương hiệu'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="flex items-center gap-6 border-b border-zinc-200/70 px-6 pt-4 dark:border-zinc-800/60">
            <button
              className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'categories' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
              onClick={() => setActiveTab('categories')}
            >
              <div className="flex items-center gap-2">
                <Tags className="h-4 w-4" />
                Danh mục
              </div>
            </button>
            <button
              className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'brands' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
              onClick={() => setActiveTab('brands')}
            >
              <div className="flex items-center gap-2">
                <Tags className="h-4 w-4" />
                Thương hiệu
              </div>
            </button>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'categories' ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tên</th>
                    <th className="px-6 py-4 font-medium">Đường dẫn (Slug)</th>
                    <th className="px-6 py-4 font-medium">Danh mục con</th>
                    <th className="px-6 py-4 font-medium">Mô tả</th>
                    <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/60">
                  {isLoadingCats ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Đang tải dữ liệu...</td>
                    </tr>
                  ) : isErrorCats ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-rose-500">Đã có lỗi xảy ra khi tải dữ liệu.</td>
                    </tr>
                  ) : !categories?.length ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Không có danh mục nào.</td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            {category.icon ? (
                              <img 
                                src={category.icon} 
                                alt={category.name} 
                                className="h-8 w-8 rounded object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.png';
                                }}
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                                <Tags className="h-4 w-4 text-zinc-400" />
                              </div>
                            )}
                            {category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{category.slug}</td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">0</td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-xs">{category.description || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">Sửa</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tên</th>
                    <th className="px-6 py-4 font-medium">Đường dẫn (Slug)</th>
                    <th className="px-6 py-4 font-medium">Mô tả</th>
                    <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/60">
                  {isLoadingBrands ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">Đang tải dữ liệu...</td>
                    </tr>
                  ) : isErrorBrands ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-rose-500">Đã có lỗi xảy ra khi tải dữ liệu.</td>
                    </tr>
                  ) : !brands?.length ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">Không có thương hiệu nào.</td>
                    </tr>
                  ) : (
                    brands.map((brand) => (
                      <tr key={brand.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            {brand.logoUrl ? (
                              <img 
                                src={brand.logoUrl} 
                                alt={brand.name} 
                                className="h-8 w-8 rounded object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.png';
                                }}
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                                <Tags className="h-4 w-4 text-zinc-400" />
                              </div>
                            )}
                            {brand.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{brand.slug}</td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-xs">{brand.description || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">Sửa</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
