'use client';

import { useQuery } from '@tanstack/react-query';
import { Search, ShoppingCart, CreditCard, Printer, Package } from 'lucide-react';
import { useState } from 'react';

import { AuthGuard } from '@/components/shared/AuthGuard';
import { staffService } from '@/services/staff.service';

export default function StaffPOSPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['staff', 'products', 'pos', search],
    queryFn: () => staffService.getProducts(0, 50, search),
  });

  return (
    <AuthGuard requireRoles={['ROLE_SHOP_STAFF', 'ROLE_MANAGER']}>
      <div className="flex h-[calc(100vh-6rem)] gap-6">
        {/* Left Side: Product List & Search */}
        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Quét mã vạch hoặc tìm kiếm sản phẩm..."
              className="w-full rounded-xl border-none bg-zinc-100/80 py-4 pl-12 pr-4 text-base text-zinc-900 transition-colors focus:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-zinc-900/80 dark:text-white dark:focus:bg-zinc-900"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="grid flex-1 grid-cols-3 gap-4 overflow-y-auto pr-2 pb-2">
            {isLoading ? (
              <div className="col-span-3 flex h-full items-center justify-center text-zinc-500">
                Đang tải sản phẩm...
              </div>
            ) : !productsData?.items?.length ? (
              <div className="col-span-3 flex h-full items-center justify-center text-zinc-500">
                Không tìm thấy sản phẩm nào
              </div>
            ) : (
              productsData.items.map((product) => (
                <button 
                  key={product.id} 
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200/70 bg-white text-left transition-all hover:border-indigo-500 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-950 dark:hover:border-indigo-400"
                >
                  <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                    ) : (
                      <Package className="h-10 w-10 text-zinc-400" />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-white" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="mt-1 font-bold text-indigo-600 dark:text-indigo-400">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Tồn kho: {product.stockQuantity}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="flex w-96 flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <ShoppingCart className="h-5 w-5 text-zinc-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Giỏ hàng</h2>
            <span className="ml-auto rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
              {cart.length} món
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                <ShoppingCart className="mb-2 h-12 w-12 opacity-20" />
                <p>Chưa có sản phẩm</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Cart items would go here */}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Tạm tính</span>
                <span>0 ₫</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Giảm giá</span>
                <span>0 ₫</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-bold text-zinc-900 dark:text-white border-t border-zinc-100 dark:border-zinc-800/50">
                <span>Khách phải trả</span>
                <span className="text-indigo-600 dark:text-indigo-400">0 ₫</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                <Printer className="h-4 w-4" />
                In tạm
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 px-4 py-3 font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <CreditCard className="h-5 w-5" />
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
