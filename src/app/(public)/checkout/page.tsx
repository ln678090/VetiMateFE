'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, MapPin, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks/use-mounted';
import { formatVND } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useMounted();
  const cartItems = useCartStore((s) => s.items);
  const selectedItemIds = useCartStore((s) => s.selectedItemIds);
  const getSelectedTotalPrice = useCartStore((s) => s.getSelectedTotalPrice);
  const removeSelectedItems = useCartStore((s) => s.removeSelectedItems);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    ward: '',
    address: '',
    note: '',
  });

  // States for administrative units
  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedWardCode, setSelectedWardCode] = useState('');

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [activeAddressId, setActiveAddressId] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'LIST' | 'ADD' | 'EDIT'>('LIST');
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const selectedItems = cartItems.filter((item) => selectedItemIds.includes(item.id));
  const subtotal = getSelectedTotalPrice();
  const shippingFee = 30000; // Phí ship cố định cho demo
  const total = subtotal + shippingFee;

  // Load saved address on mount
  useEffect(() => {
    const saved = localStorage.getItem('vetimate_saved_addresses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAddresses(parsed);
          const defaultAddress = parsed.find(a => a.isDefault) || parsed[0];
          setActiveAddressId(defaultAddress.id);
          setFormData({
            fullName: defaultAddress.fullName,
            phone: defaultAddress.phone,
            city: defaultAddress.city,
            ward: defaultAddress.ward,
            address: defaultAddress.address,
            note: defaultAddress.note || '',
          });
          setSelectedProvinceCode(defaultAddress.provinceCode);
          setSelectedWardCode(defaultAddress.wardCode);
        }
      } catch (e) {
        console.error('Failed to parse saved addresses');
      }
    }
  }, []);

  // Nếu không có item nào được chọn, đá về giỏ hàng (chỉ khi client đã mount)
  useEffect(() => {
    if (mounted && !isSuccess && selectedItems.length === 0) {
      router.replace('/cart');
    }
  }, [mounted, isSuccess, selectedItems.length, router]);

  // Fetch new provinces on mount (2025 structure)
  useEffect(() => {
    fetch('https://tinhthanhpho.com/api/v1/new-provinces?limit=100')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setProvinces(res.data);
      })
      .catch((err) => console.error('Failed to fetch new provinces', err));
  }, []);

  // Restore wards if province is already selected (e.g. from saved address)
  useEffect(() => {
    if (selectedProvinceCode) {
      fetch(`https://tinhthanhpho.com/api/v1/new-provinces/${selectedProvinceCode}/wards?limit=1000`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) setWards(res.data);
        })
        .catch((err) => console.error('Failed to fetch new wards', err));
    }
  }, [selectedProvinceCode]);

  if (!mounted) return null;

  // Giao diện đặt hàng thành công
  if (isSuccess) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white">
            Đặt Hàng Thành Công!
          </h2>
          <p className="mt-4 max-w-md text-zinc-500 dark:text-zinc-400">
            Cảm ơn bạn đã mua sắm tại VetiMate. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến địa chỉ của bạn.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button asChild variant="outline" className="h-12 px-8">
              <Link href="/order-tracking">Theo Dõi Đơn Hàng</Link>
            </Button>
            <Button asChild className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white">
              <Link href="/shop">Tiếp Tục Mua Sắm</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Không render form nếu mảng rỗng (sẽ bị redirect bởi useEffect)
  if (selectedItems.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAddressId) {
      toast.error('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }
    
    setIsSubmitting(true);
    const address = savedAddresses.find(a => a.id === activeAddressId);

    try {
      // Lazy import to avoid cycle if any, or just use the existing service since we added it
      const { orderService } = await import('@/services/order.service');
      await orderService.createOrder({
        recipientName: address.fullName,
        recipientPhone: address.phone,
        shippingAddress: `${address.address}, ${address.ward}, ${address.city}`,
        paymentMethod: 'COD',
        note: address.note,
        items: selectedItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      });

      setIsSuccess(true);
      removeSelectedItems();
      toast.success('Đơn hàng đã được tạo thành công!');
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveMainFormAddress = () => {
    if (!formData.fullName || !formData.phone || !formData.city || !formData.ward || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin trước khi lưu!');
      return;
    }
    
    const newAddress = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      provinceCode: selectedProvinceCode,
      ward: formData.ward,
      wardCode: selectedWardCode,
      address: formData.address,
      note: formData.note,
      isDefault: savedAddresses.length === 0,
    };
    
    const updated = [...savedAddresses, newAddress];
    setSavedAddresses(updated);
    setActiveAddressId(newAddress.id);
    localStorage.setItem('vetimate_saved_addresses', JSON.stringify(updated));
    toast.success('Đã lưu địa chỉ giao hàng!');
  };

  const handleAddNewClick = () => {
    setFormData({ fullName: '', phone: '', city: '', ward: '', address: '', note: '' });
    setSelectedProvinceCode('');
    setSelectedWardCode('');
    setModalView('ADD');
  };

  const handleEditClick = (address: any) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      ward: address.ward,
      address: address.address,
      note: address.note || '',
    });
    setSelectedProvinceCode(address.provinceCode);
    setSelectedWardCode(address.wardCode);
    setEditingAddressId(address.id);
    setModalView('EDIT');
  };

  const handleBackToList = () => {
    setModalView('LIST');
  };

  const handleSaveAddressForm = () => {
    if (!formData.fullName || !formData.phone || !formData.city || !formData.ward || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin trước khi lưu!');
      return;
    }
    
    if (modalView === 'ADD') {
      const newAddress = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        provinceCode: selectedProvinceCode,
        ward: formData.ward,
        wardCode: selectedWardCode,
        address: formData.address,
        note: formData.note,
        isDefault: savedAddresses.length === 0,
      };
      const updated = [...savedAddresses, newAddress];
      setSavedAddresses(updated);
      if (updated.length === 1) setActiveAddressId(newAddress.id);
      localStorage.setItem('vetimate_saved_addresses', JSON.stringify(updated));
      toast.success('Thêm địa chỉ thành công!');
    } else if (modalView === 'EDIT' && editingAddressId) {
      const updated = savedAddresses.map(a => 
        a.id === editingAddressId 
          ? { ...a, fullName: formData.fullName, phone: formData.phone, city: formData.city, provinceCode: selectedProvinceCode, ward: formData.ward, wardCode: selectedWardCode, address: formData.address, note: formData.note }
          : a
      );
      setSavedAddresses(updated);
      localStorage.setItem('vetimate_saved_addresses', JSON.stringify(updated));
      toast.success('Cập nhật địa chỉ thành công!');
    }
    
    setModalView('LIST');
  };
  
  const handleSelectAddress = (address: any) => {
    setActiveAddressId(address.id);
    setIsAddressModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedProvinceCode(code);
    setSelectedWardCode('');
    setFormData({ ...formData, city: code ? name : '', ward: '' });
    setWards([]);
    
    if (code) {
      fetch(`https://tinhthanhpho.com/api/v1/new-provinces/${code}/wards?limit=1000`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) setWards(res.data);
        })
        .catch((err) => console.error('Failed to fetch new provinces', err));
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedWardCode(code);
    setFormData({ ...formData, ward: code ? name : '' });
  };

  const fullAddressText = `${formData.address}, ${formData.ward}, ${formData.city}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/cart">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
          Thanh Toán
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* Cột trái: Thông tin giao hàng */}
        <div className="flex flex-col gap-6">
          {/* Static block for active saved address (Shopee style) */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* Shopee style decorative border */}
            <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)' }}></div>
            
            <div className="mb-4 flex items-center gap-2 text-rose-600 dark:text-rose-400 mt-2">
              <MapPin className="h-5 w-5" />
              <h2 className="text-lg font-bold">Địa Chỉ Nhận Hàng</h2>
            </div>
            
            {savedAddresses.length > 0 && activeAddressId ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {savedAddresses.find(a => a.id === activeAddressId)?.fullName} (+84) {savedAddresses.find(a => a.id === activeAddressId)?.phone?.replace(/^0/, '')}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {savedAddresses.find(a => a.id === activeAddressId)?.address}, {savedAddresses.find(a => a.id === activeAddressId)?.ward}, {savedAddresses.find(a => a.id === activeAddressId)?.city}
                  </span>
                  {savedAddresses.find(a => a.id === activeAddressId)?.isDefault && (
                    <span className="inline-block rounded border border-rose-500 px-1 py-0.5 text-[10px] uppercase text-rose-500 w-fit">
                      Mặc Định
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModalView('LIST');
                    setIsAddressModalOpen(true);
                  }}
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 shrink-0 text-left"
                >
                  Thay Đổi
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <p className="mb-4 text-sm text-zinc-500">Bạn chưa có địa chỉ nhận hàng nào</p>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleAddNewClick();
                    setIsAddressModalOpen(true);
                  }}
                  className="border-rose-500 text-rose-500 hover:bg-rose-50"
                >
                  <Plus className="mr-2 h-4 w-4" /> Thêm Địa Chỉ Mới
                </Button>
              </div>
            )}
          </div>

          {/* Form nhập liệu (luôn hiển thị) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-6 text-lg font-bold text-zinc-900 dark:text-white">Chi tiết giao hàng</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Tỉnh / Thành phố <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    required
                    value={selectedProvinceCode}
                    onChange={handleProvinceChange}
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    <option value="" disabled>Chọn Tỉnh / Thành phố</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="ward" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Phường / Xã <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="ward"
                    name="ward"
                    required
                    disabled={!selectedProvinceCode}
                    value={selectedWardCode}
                    onChange={handleWardChange}
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    <option value="" disabled>Chọn Phường / Xã</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="address" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Địa chỉ cụ thể <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Số nhà, Tên đường..."
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSaveMainFormAddress}
                      className="shrink-0 border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Lưu địa chỉ
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="note" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Ghi chú cho đơn vị vận chuyển
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Thời gian nhận hàng, chỉ dẫn đường đi..."
                    className="w-full resize-none rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700"
                  />
                </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">Phương Thức Thanh Toán</h2>
            
            <div className="flex items-center gap-4 rounded-lg border-2 border-rose-500 bg-rose-50 p-4 dark:bg-rose-500/10">
              <input 
                type="radio" 
                id="cod" 
                name="paymentMethod" 
                value="cod" 
                checked 
                readOnly
                className="h-5 w-5 text-rose-600 focus:ring-rose-600"
              />
              <div className="flex flex-col">
                <label htmlFor="cod" className="font-semibold text-rose-700 dark:text-rose-300">
                  Thanh toán khi nhận hàng (COD)
                </label>
                <span className="text-sm text-rose-600/80 dark:text-rose-400/80">
                  Kiểm tra hàng trước khi thanh toán.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Summary & Place Order */}
        <div>
          <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Đơn Hàng Của Bạn
            </h2>
            <div className="mt-4 text-sm text-zinc-500">
              {selectedItems.length} sản phẩm
            </div>

            <div className="my-6 max-h-[320px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-100 dark:border-zinc-800">
                    <Image
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-zinc-500 text-xs text-white">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </span>
                    <span className="mt-1 text-sm font-semibold text-rose-600 dark:text-rose-400">
                      {formatVND(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <div className="flex justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <span>Tạm tính</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              
              {/* Phương thức vận chuyển mockup */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Phương thức vận chuyển</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Nhanh</span>
                  <span className="text-zinc-500">Thay Đổi</span>
                  <span className="font-bold text-rose-500">{formatVND(shippingFee)}</span>
                </div>
              </div>
              
              <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-800" />
              
              <div className="flex items-end justify-between">
                <span className="font-bold text-zinc-900 dark:text-white">Tổng cộng</span>
                <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {formatVND(total)}
                </span>
              </div>
            </div>

            <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
              <DialogContent className="sm:max-w-[500px] gap-0 p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                  <DialogTitle className="text-lg font-bold">
                    {modalView === 'LIST' ? 'Địa Chỉ Của Tôi' : modalView === 'ADD' ? 'Địa chỉ mới' : 'Chỉnh sửa địa chỉ'}
                  </DialogTitle>
                </DialogHeader>
                
                {modalView === 'LIST' ? (
                  <>
                    <div className="max-h-[50vh] overflow-y-auto px-6 py-2">
                      {savedAddresses.map(addr => (
                        <div key={addr.id} className="flex gap-4 border-b border-zinc-100 py-4 last:border-0 dark:border-zinc-800">
                          <input 
                            type="radio" 
                            name="address_select" 
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-rose-500" 
                            checked={activeAddressId === addr.id}
                            onChange={() => handleSelectAddress(addr)}
                          />
                          <div className="flex-1 cursor-pointer" onClick={() => handleSelectAddress(addr)}>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100">{addr.fullName}</span>
                              <span className="text-zinc-400 text-sm">|</span>
                              <span className="text-zinc-500 text-sm">(+84) {addr.phone?.replace(/^0/, '')}</span>
                            </div>
                            <div className="text-zinc-600 text-sm mt-1.5 dark:text-zinc-400">{addr.address}</div>
                            <div className="text-zinc-600 text-sm dark:text-zinc-400">{addr.ward}, {addr.city}</div>
                            {addr.isDefault && (
                              <span className="inline-block mt-2 rounded border border-rose-500 px-1 py-0.5 text-[10px] uppercase text-rose-500">
                                Mặc Định
                              </span>
                            )}
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleEditClick(addr)}
                            className="text-blue-500 text-sm font-medium hover:underline self-start shrink-0"
                          >
                            Cập nhật
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t border-zinc-100 flex justify-end dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                      <Button 
                        type="button" 
                        className="bg-rose-500 hover:bg-rose-600 text-white h-10 px-6 rounded-sm shadow-sm"
                        onClick={handleAddNewClick}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Thêm Địa Chỉ Mới
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5 md:col-span-1">
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Họ và tên"
                            className="w-full rounded-sm border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            className="w-full rounded-sm border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <select
                            name="city"
                            required
                            value={selectedProvinceCode}
                            onChange={handleProvinceChange}
                            className="w-full rounded-sm border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700 dark:bg-zinc-950"
                          >
                            <option value="" disabled>Tỉnh/Thành phố</option>
                            {provinces.map((p) => (
                              <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <select
                            name="ward"
                            required
                            disabled={!selectedProvinceCode}
                            value={selectedWardCode}
                            onChange={handleWardChange}
                            className="w-full rounded-sm border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
                          >
                            <option value="" disabled>Phường/Xã</option>
                            {wards.map((w) => (
                              <option key={w.code} value={w.code}>{w.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Địa chỉ cụ thể"
                            className="w-full rounded-sm border border-zinc-300 bg-transparent px-3 py-2 text-sm transition focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-zinc-100 flex justify-end gap-3 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={handleBackToList}
                        className="px-6 rounded-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Trở Lại
                      </Button>
                      <Button 
                        type="button" 
                        className="bg-rose-500 hover:bg-rose-600 text-white px-6 rounded-sm shadow-sm"
                        onClick={handleSaveAddressForm}
                      >
                        Hoàn thành
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 h-12 w-full bg-gradient-to-r from-rose-500 to-amber-500 text-base font-bold text-white shadow-lg shadow-rose-500/25 transition hover:shadow-xl hover:shadow-rose-500/40 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang Xử Lý...' : 'Đặt Hàng'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
