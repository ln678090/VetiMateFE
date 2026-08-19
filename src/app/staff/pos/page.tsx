'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, ShoppingCart, CreditCard, Trash2, Plus, Minus, Package, CheckCircle2 } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

import { AuthGuard } from '@/components/shared/AuthGuard';
import { getApiErrorMessage } from '@/lib/axios';
import { staffService } from '@/services/staff.service';
import type { Product } from '@/types/shop';

interface CartItem {
  product: Product;
  quantity: number;
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function StaffPOSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['staff', 'products', 'pos', search],
    queryFn: () => staffService.getProducts(0, 50, search),
  });

  const checkoutMutation = useMutation({
    mutationFn: () =>
      staffService.createPosOrder({
        paymentMethod: 'CASH',
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }),
    onSuccess: () => {
      toast.success('Thanh toán thành công!');
      setCart([]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      // Refresh product list to update stock
      queryClient.invalidateQueries({ queryKey: ['staff', 'products'] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Thanh toán thất bại'));
    },
  });

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Check stock limit
        if (existing.quantity >= product.stockQuantity) {
          toast.error(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (product.stockQuantity <= 0) {
        toast.error('Sản phẩm đã hết hàng');
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stockQuantity) {
            toast.error(`Chỉ còn ${item.product.stockQuantity} sản phẩm trong kho`);
            return item;
          }
          return { ...item, quantity: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const { subtotal, totalItems } = useMemo(() => {
    return cart.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.product.price * item.quantity,
        totalItems: acc.totalItems + item.quantity,
      }),
      { subtotal: 0, totalItems: 0 }
    );
  }, [cart]);

  return (
    <AuthGuard requireRoles={['ROLE_SHOP_STAFF', 'ROLE_MANAGER']}>
      {/* Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 flex flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-2xl dark:bg-zinc-900">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">Thanh toán thành công!</p>
          </div>
        </div>
      )}

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
              productsData.items.map((product) => {
                const inCart = cart.find((item) => item.product.id === product.id);
                const outOfStock = product.stockQuantity <= 0;
                return (
                  <button 
                    key={product.id} 
                    onClick={() => addToCart(product)}
                    disabled={outOfStock}
                    className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border text-left transition-all
                      ${outOfStock 
                        ? 'cursor-not-allowed border-zinc-200/50 opacity-50 dark:border-zinc-800/40' 
                        : inCart 
                          ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-400' 
                          : 'border-zinc-200/70 bg-white hover:border-indigo-500 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-950 dark:hover:border-indigo-400'
                      }`}
                  >
                    {inCart && (
                      <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-lg">
                        {inCart.quantity}
                      </div>
                    )}
                    {outOfStock && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-zinc-950/60">
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">Hết hàng</span>
                      </div>
                    )}
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
                        {formatVND(product.price)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Tồn kho: {product.stockQuantity}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="flex w-96 flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <ShoppingCart className="h-5 w-5 text-zinc-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Giỏ hàng</h2>
            <span className="ml-auto rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
              {totalItems} món
            </span>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="ml-1 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                title="Xóa tất cả"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                <ShoppingCart className="mb-2 h-12 w-12 opacity-20" />
                <p>Chưa có sản phẩm</p>
                <p className="mt-1 text-xs">Nhấn vào sản phẩm để thêm vào giỏ</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800/50 dark:bg-zinc-900/50"
                  >
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-5 w-5 text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                        {item.product.name}
                      </p>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatVND(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200/80 text-zinc-600 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-zinc-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200/80 text-zinc-600 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-bold text-zinc-900 dark:text-white border-t border-zinc-100 dark:border-zinc-800/50">
                <span>Khách phải trả</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatVND(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={() => checkoutMutation.mutate()}
              disabled={cart.length === 0 || checkoutMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 px-4 py-3.5 font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {checkoutMutation.isPending ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Thanh toán {cart.length > 0 ? formatVND(subtotal) : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
