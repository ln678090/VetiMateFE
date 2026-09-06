'use client';

import { Product } from '@/features/shop/types/product.types';
import { PackageOpen, AlertTriangle, XOctagon, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@/lib/utils';

interface ProductStatisticsProps {
  products: Product[];
}

export function ProductStatistics({ products }: ProductStatisticsProps) {
  const totalProducts = products.length;

  const activeProducts = products.filter((p) => p.isActive).length;

  const outOfStock = products.filter((p) => p.stockQuantity === 0).length;

  const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;

  // Tổng giá trị tồn kho = sum(price * stockQuantity)
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
          <PackageOpen className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tổng sản phẩm</p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{totalProducts}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Giá trị tồn kho</p>
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatVND(totalInventoryValue)}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Sắp hết hàng {'(<10)'}
          </p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lowStock}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
          <XOctagon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Hết hàng (0)</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">{outOfStock}</h3>
        </div>
      </div>
    </div>
  );
}
