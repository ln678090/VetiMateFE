'use client';

import { useState, useRef, useCallback } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, History, Clock, ArrowLeft, Printer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productApi } from '@/features/shop/api/product.api';
import { orderApi, OrderResponse } from '@/features/shop/api/order.api';
import { Product } from '@/features/shop/types/product.types';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderItem {
  id: string;
  productId: string;
  productImage?: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: string;
  code: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: string;
  shippingAddress?: string;
  note?: string;
  items: OrderItem[];
}
const formatDate = (dateStr: string, includeYear = true) => {
  const d = new Date(dateStr);
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  return includeYear ? `${time} - ${date}/${d.getFullYear()}` : `${time} - ${date}`;
};

const formatFullDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const pad = (n: number) => n < 10 ? '0' + n : n;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// ============================================================
// Print Receipt Component (hidden on screen, visible on print)
// ============================================================
function PrintReceipt({ order, note }: { order: OrderResponse | null; note?: string }) {
  if (!order) return null;
  return (
    <div
      id="print-receipt"
      style={{
        display: 'none',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '13px',
        width: '80mm',
        padding: '8mm 5mm',
        color: '#000',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 2px' }}>PetCare Vet Shop</h2>
        <p style={{ margin: '0', fontSize: '11px' }}>Phòng khám thú y &amp; Shop thú cưng</p>
        <p style={{ margin: '2px 0 0', fontSize: '11px' }}>Hotline: 0123 456 789</p>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>HÓA ĐƠN BÁN HÀNG</h3>
      </div>

      {/* Order info */}
      <div style={{ marginBottom: '6px', fontSize: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Mã HĐ:</span>
          <span style={{ fontWeight: 'bold' }}>{order.code}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Ngày:</span>
          <span>{formatFullDate(order.createdAt)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Thanh toán:</span>
          <span>{order.paymentMethod === 'CASH' ? 'Tiền mặt' : order.paymentMethod}</span>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      {/* Items list */}
      <div style={{ fontSize: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', padding: '2px 0', fontWeight: 'bold' }}>
          <span>Sản phẩm</span>
          <span>T.Tiền</span>
        </div>
        {order.items.map((item, idx) => (
          <div key={item.id} style={{ borderBottom: '1px dotted #ccc', padding: '4px 0' }}>
            <div style={{ fontWeight: 500 }}>{idx + 1}. {item.productName}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '1px' }}>
              <span style={{ color: '#555' }}>{item.quantity} x {item.price.toLocaleString('vi-VN')}</span>
              <span style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

      {/* Totals */}
      <div style={{ fontSize: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span>Tạm tính:</span>
          <span>{order.totalAmount.toLocaleString('vi-VN')} ₫</span>
        </div>
        {order.shippingFee > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Phí vận chuyển:</span>
            <span>{order.shippingFee.toLocaleString('vi-VN')} ₫</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginTop: '4px', borderTop: '1px solid #000', paddingTop: '4px' }}>
          <span>TỔNG CỘNG:</span>
          <span>{(order.finalAmount || order.totalAmount).toLocaleString('vi-VN')} ₫</span>
        </div>
      </div>

      {/* Note */}
      {(note || order.note) && (
        <>
          <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
          <div style={{ fontSize: '11px' }}>
            <span style={{ fontWeight: 'bold' }}>Ghi chú: </span>
            <span>{note || order.note}</span>
          </div>
        </>
      )}

      <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: '11px' }}>
        <p style={{ margin: '0 0 2px' }}>Cảm ơn quý khách đã mua hàng!</p>
        <p style={{ margin: 0, fontStyle: 'italic' }}>Hẹn gặp lại ❤</p>
      </div>
    </div>
  );
}

// ============================================================
// Print CSS (injected into <head> once)
// ============================================================
const PRINT_STYLE_ID = 'pos-print-style';
function ensurePrintStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(PRINT_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = PRINT_STYLE_ID;
  style.textContent = `
    @media print {
      /* Hide everything except the receipt */
      body > *:not(#print-receipt-portal) { display: none !important; }
      #print-receipt-portal { display: block !important; }
      #print-receipt-portal #print-receipt {
        display: block !important;
        width: 80mm !important;
        margin: 0 auto !important;
      }
      @page {
        size: 80mm auto;
        margin: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [note, setNote] = useState('');
  const [lastOrder, setLastOrder] = useState<OrderResponse | null>(null);
  const [lastNote, setLastNote] = useState('');
  // History state

  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch products
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts(),
  });

  const products = productsData?.data?.items || [];
  const filteredProducts = products.filter(
    (p) =>
      p.stockQuantity > 0 &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  // Fetch history
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['pos-history', dateRange],
    queryFn: () => orderApi.getPosHistory(dateRange),
  });
  const historyOrders = historyData || [];

  const posCheckoutMutation = useMutation({
    mutationFn: orderApi.posCheckout,
    onSuccess: (data) => {
      toast.success('Thanh toán thành công!');
      // Save order for printing
      const orderData = (data as any)?.data || data;
      setLastOrder(orderData);
      setLastNote(note);
      setCart([]);
      setNote('');
      refetch();
      refetchHistory();
    },
    onError: (error) => {
      toast.error('Thanh toán thất bại: ' + (error as Error).message);
    },
  });

  // Print function
  const handlePrint = useCallback((orderToPrint?: OrderResponse, noteToPrint?: string) => {
    const order = orderToPrint || lastOrder;
    if (!order) {
      toast.error('Không có hóa đơn để in!');
      return;
    }

    ensurePrintStyles();

    // Create a portal element for printing
    let portal = document.getElementById('print-receipt-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'print-receipt-portal';
      portal.style.display = 'none';
      document.body.appendChild(portal);
    }

    const printNote = noteToPrint ?? lastNote;

    // Build receipt HTML
    portal.innerHTML = `
      <div id="print-receipt" style="font-family: 'Courier New', Courier, monospace; font-size: 13px; width: 80mm; padding: 8mm 5mm; color: #000; background: #fff;">
        <div style="text-align: center; margin-bottom: 8px;">
          <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 2px;">PetCare Vet Shop</h2>
          <p style="margin: 0; font-size: 11px;">Phòng khám thú y &amp; Shop thú cưng</p>
          <p style="margin: 2px 0 0; font-size: 11px;">Hotline: 0123 456 789</p>
        </div>
        <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>
        <div style="text-align: center; margin-bottom: 6px;">
          <h3 style="font-size: 16px; font-weight: bold; margin: 0;">HÓA ĐƠN BÁN HÀNG</h3>
        </div>
        <div style="margin-bottom: 6px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between;"><span>Mã HĐ:</span><span style="font-weight: bold;">${order.code}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>Ngày:</span><span>${formatFullDate(order.createdAt)}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>Thanh toán:</span><span>${order.paymentMethod === 'CASH' ? 'Tiền mặt' : order.paymentMethod}</span></div>
        </div>
        <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>
        <div style="font-size: 12px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding: 2px 0; font-weight: bold;">
            <span>Sản phẩm</span>
            <span>T.Tiền</span>
          </div>
          ${order.items.map((item, idx) => `
            <div style="border-bottom: 1px dotted #ccc; padding: 4px 0;">
              <div style="font-weight: 500;">${idx + 1}. ${item.productName}</div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 1px;">
                <span style="color: #555;">${item.quantity} x ${item.price.toLocaleString('vi-VN')}</span>
                <span style="font-weight: bold;">${(item.price * item.quantity).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>
        <div style="font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Tạm tính:</span><span>${order.totalAmount.toLocaleString('vi-VN')} ₫</span>
          </div>
          ${order.shippingFee > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 2px;"><span>Phí vận chuyển:</span><span>${order.shippingFee.toLocaleString('vi-VN')} ₫</span></div>` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 4px; border-top: 1px solid #000; padding-top: 4px;">
            <span>TỔNG CỘNG:</span><span>${(order.finalAmount || order.totalAmount).toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
        ${(printNote || order.note) ? `
          <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>
          <div style="font-size: 11px;"><span style="font-weight: bold;">Ghi chú: </span><span>${printNote || order.note}</span></div>
        ` : ''}
        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        <div style="text-align: center; font-size: 11px;">
          <p style="margin: 0 0 2px;">Cảm ơn quý khách đã mua hàng!</p>
          <p style="margin: 0; font-style: italic;">Hẹn gặp lại ❤</p>
        </div>
      </div>
    `;

    // Trigger print
    setTimeout(() => {
      window.print();
    }, 100);
  }, [lastOrder, lastNote]);

  // Print from history
  const handlePrintHistoryOrder = useCallback((order: OrderResponse) => {
    handlePrint(order, order.note);
  }, [handlePrint]);

  const addToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          toast.error('Số lượng vượt quá tồn kho!');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return item;
          if (newQuantity > item.product.stockQuantity) {
            toast.error('Số lượng vượt quá tồn kho!');
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    posCheckoutMutation.mutate({
      paymentMethod: 'CASH', // default for POS
      note: note.trim() || undefined,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
      <header className="shrink-0 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
          Bán hàng tại quầy (POS)
        </h1>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left side: Products List */}
        <div className="flex-1 flex flex-col bg-zinc-50/50 rounded-xl border border-zinc-200 p-4 gap-4 overflow-hidden">
          <div className="flex gap-2 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                className="pl-9 bg-white"
                placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-white">
              Quét mã vạch
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">Đang tải sản phẩm...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white p-3 rounded-lg border shadow-sm cursor-pointer transition-all hover:border-orange-500 hover:shadow-md flex flex-col h-full ${product.stockQuantity <= 0 ? 'opacity-50 grayscale' : ''}`}
                    onClick={() => addToCart(product)}
                  >
                    <div className="aspect-square bg-zinc-100 rounded-md mb-3 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-sm font-medium line-clamp-2 mb-3" title={product.name}>
                        {product.name}
                      </h3>
                      <div className="mt-auto flex flex-col gap-1.5">
                        <span className="text-orange-600 font-bold text-base">
                          {product.price.toLocaleString('vi-VN')} ₫
                        </span>
                        <span className="text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md self-start font-medium border border-zinc-200">
                          Còn lại: {product.stockQuantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Cart & History Tabs */}
        <div className="w-[420px] flex flex-col overflow-hidden shrink-0">
          <Card className="flex-1 flex flex-col shadow-sm border-zinc-200 overflow-hidden bg-white">
            <Tabs defaultValue="cart" className="flex-1 flex flex-col h-full overflow-hidden">
              <TabsList className="grid w-full grid-cols-2 shrink-0 rounded-none border-b bg-zinc-50/50 h-[52px] p-1">
                <TabsTrigger
                  value="cart"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Giỏ hàng{' '}
                  {cart.length > 0 && (
                    <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-xs">
                      {cart.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <History className="w-4 h-4" />
                  Lịch sử
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="cart"
                className="flex-1 flex flex-col m-0 data-[state=active]:flex overflow-hidden"
              >
                <div className="flex-1 flex flex-col p-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                        <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
                        <p>Chưa có sản phẩm nào trong giỏ</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-3 bg-white border border-zinc-100 rounded-lg p-2 shadow-sm"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div className="flex-1 flex flex-col">
                            <h4 className="text-sm font-medium line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-orange-600 text-sm font-semibold mt-1">
                              {(item.product.price * item.quantity).toLocaleString('vi-VN')} ₫
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center border rounded-md">
                                <button
                                  className="p-1 text-zinc-500 hover:bg-zinc-100 rounded-l-md"
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-medium w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  className="p-1 text-zinc-500 hover:bg-zinc-100 rounded-r-md"
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                </div>
                  {/* Note section */}
                  <div className="px-4 pb-2 pt-2 border-t">
                    <label className="text-sm font-semibold text-zinc-700 mb-1.5 block">Ghi chú</label>
                    <Textarea
                      placeholder="Nhập ghi chú đơn hàng"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="resize-none h-16 text-sm bg-zinc-50 border-zinc-200 focus:bg-white"
                    />
                  </div>

                  <div className="border-t p-4 bg-zinc-50">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-zinc-600">
                        <span>Tạm tính:</span>
                        <span>{totalAmount.toLocaleString('vi-VN')} ₫</span>
                      </div>
                      <div className="flex justify-between text-sm text-zinc-600">
                        <span>Giảm giá:</span>
                        <span>0 ₫</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>Tổng tiền:</span>
                        <span className="text-orange-600">
                          {totalAmount.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                        disabled={cart.length === 0 || posCheckoutMutation.isPending}
                        onClick={handleCheckout}
                      >
                        {posCheckoutMutation.isPending ? 'Đang xử lý...' : 'Thanh toán'}
                      </Button>
                      {lastOrder && (
                        <Button
                          variant="outline"
                          className="h-12 px-4 border-zinc-300 hover:bg-zinc-100"
                          onClick={() => handlePrint()}
                          title="In hóa đơn gần nhất"
                        >
                          <Printer className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="history"
                className="flex-1 flex flex-col m-0 data-[state=active]:flex overflow-hidden"
              >
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                  {selectedOrder ? (
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-4 shrink-0 border-b pb-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(null)}
                          className="-ml-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                          <h3 className="font-semibold">{selectedOrder.code}</h3>
                          <p className="text-xs text-zinc-500">
                            {formatDate(selectedOrder.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex gap-3 items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.productImage || '/placeholder.png'}
                              className="w-12 h-12 rounded border object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">{item.productName}</p>
                              <div className="flex justify-between mt-1 items-center">
                                <p className="text-xs text-zinc-500">
                                  {item.quantity} x {item.price.toLocaleString('vi-VN')}
                                </p>
                                <p className="font-semibold text-sm">
                                  {(item.quantity * item.price).toLocaleString('vi-VN')} ₫
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3 mt-3 flex justify-between items-center shrink-0">
                        <span className="font-medium text-sm">Tổng cộng:</span>
                        <span className="text-lg font-bold text-orange-600">
                          {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => handlePrintHistoryOrder(selectedOrder)}
                      >
                        <Printer className="w-4 h-4" />
                        In HĐ
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-4 shrink-0">
                        <Input
                          type="date"
                          className="text-sm h-9"
                          value={dateRange.startDate}
                          onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                          }
                        />
                        <span className="text-zinc-400">-</span>
                        <Input
                          type="date"
                          className="text-sm h-9"
                          value={dateRange.endDate}
                          onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                          }
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto border rounded-md divide-y pr-1">
                        {isLoadingHistory ? (
                          <div className="p-4 text-center text-zinc-500 text-sm">Đang tải...</div>
                        ) : historyOrders.length === 0 ? (
                          <div className="p-4 text-center text-zinc-500 text-sm">
                            Không có giao dịch.
                          </div>
                        ) : (
                          historyOrders.map((order) => (
                            <div
                              key={order.id}
                              className="p-3 hover:bg-zinc-50 cursor-pointer transition-colors"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm text-blue-600">
                                  {order.code}
                                </span>
                                <span className="font-semibold text-sm text-orange-600">
                                  {order.totalAmount.toLocaleString('vi-VN')} ₫
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs text-zinc-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(order.createdAt, false)}
                                </div>
                                <span>{order.items.length} SP</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
