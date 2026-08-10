'use client';

import { useState } from 'react';
import { Search, Bone, Pill, Stethoscope, Plus, Edit2, Archive } from 'lucide-react';
import Link from 'next/link';
import { useMedicines } from '@/features/inventory/hooks/use-inventory';
import type { MedicineResp } from '@/types/inventory';

export default function MedicinesInventoryPage() {
  const { data, isLoading } = useMedicines(true);
  const [selectedItem, setSelectedItem] = useState<MedicineResp | null>(null);

  // Default to first item if none selected and data is available
  const activeItem = selectedItem || (data && data.length > 0 ? data[0] : null);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-[48px] bg-m3-background h-full">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-[40px]">
          <div>
            <h2 className="font-headline-lg text-[24px] md:text-[32px] font-semibold text-m3-on-surface mb-1 tracking-tight">
              Kho hàng
            </h2>
            <p className="font-body-md text-[16px] text-m3-on-surface-variant">
              Quản lý sản phẩm, thuốc và vật tư y tế.
            </p>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-m3-on-surface-variant group-focus-within:text-m3-primary transition-colors" />
              <input 
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-m3-outline-variant bg-m3-surface-container-lowest focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 transition-all outline-none font-body-sm text-[14px]" 
                placeholder="Tìm kiếm sản phẩm..." 
                type="text" 
              />
            </div>
            <div className="flex gap-3">
              <select className="h-10 px-3 rounded-lg border border-m3-outline-variant bg-m3-surface-container-lowest focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 outline-none font-body-sm text-[14px] text-m3-on-surface">
                <option value="">Tất cả danh mục</option>
                <option value="medicine">Thuốc</option>
                <option value="accessory">Vật tư y tế</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: List-Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
          
          {/* Main List (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* Header Row (Hidden on mobile) */}
            <div className="hidden md:grid grid-cols-12 gap-3 px-3 py-1 font-label-md text-[14px] font-semibold text-m3-on-surface-variant border-b border-m3-outline-variant/50">
              <div className="col-span-5">Sản phẩm / Vật tư</div>
              <div className="col-span-3">Đơn vị</div>
              <div className="col-span-4">Trạng thái</div>
            </div>

            {/* List Items */}
            {isLoading ? (
              <div className="p-12 text-center text-m3-on-surface-variant">Đang tải dữ liệu...</div>
            ) : data?.length === 0 ? (
              <div className="p-12 text-center text-m3-on-surface-variant">Chưa có vật tư nào</div>
            ) : (
              data?.map((item: MedicineResp) => {
                const isActive = activeItem?.id === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className={`bg-m3-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center cursor-pointer border ${isActive ? 'border-m3-primary/50' : 'border-transparent hover:border-m3-primary/20'}`}
                  >
                    <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-m3-surface-container flex items-center justify-center shrink-0 border border-m3-outline-variant/30">
                        {item.unit.toLowerCase().includes('viên') || item.unit.toLowerCase().includes('hộp') ? (
                          <Pill className="w-5 h-5 text-m3-primary" />
                        ) : (
                          <Stethoscope className="w-5 h-5 text-m3-tertiary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-label-md text-[14px] font-semibold text-m3-on-surface">{item.name}</h3>
                        <p className="font-body-sm text-[12px] text-m3-on-surface-variant">Mã: {item.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-3 flex items-center gap-1.5">
                      <span className="font-body-sm text-[14px] text-m3-on-surface">{item.unit}</span>
                    </div>
                    
                    <div className="col-span-1 md:col-span-4 flex items-center">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${item.isActive ? 'bg-m3-primary-container/20 text-m3-primary' : 'bg-m3-error/10 text-m3-error'}`}>
                        {item.isActive ? 'Đang hoạt động' : 'Ngừng sử dụng'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail Panel (4 cols) */}
          <div className="lg:col-span-4 hidden lg:block">
            {activeItem ? (
              <div className="bg-m3-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-[24px] sticky top-[24px] border border-m3-outline-variant/30">
                <div className="flex justify-between items-start mb-[24px]">
                  <h3 className="font-headline-md text-[24px] font-semibold text-m3-on-surface">Chi tiết vật tư</h3>
                  <button className="text-m3-on-surface-variant hover:text-m3-primary transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="w-full h-48 bg-m3-surface-container/50 rounded-lg mb-[24px] flex items-center justify-center border border-m3-outline-variant/20">
                   {activeItem.unit.toLowerCase().includes('viên') || activeItem.unit.toLowerCase().includes('hộp') ? (
                      <Pill className="w-16 h-16 text-m3-primary/40" />
                    ) : (
                      <Stethoscope className="w-16 h-16 text-m3-tertiary/40" />
                    )}
                </div>
                
                <h4 className="font-headline-lg-mobile text-[24px] font-semibold text-m3-on-surface mb-1">
                  {activeItem.name}
                </h4>
                
                <div className="flex gap-2 mb-[24px]">
                  <span className="px-2 py-1 bg-m3-surface-container rounded-md font-label-sm text-[12px] text-m3-on-surface-variant">
                    {activeItem.unit}
                  </span>
                  <span className={`px-2 py-1 rounded-md font-label-sm text-[12px] ${activeItem.isActive ? 'bg-m3-primary-container/20 text-m3-primary' : 'bg-m3-error/10 text-m3-error'}`}>
                    {activeItem.isActive ? 'Đang hoạt động' : 'Ngừng sử dụng'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-1.5 border-b border-m3-outline-variant/30">
                    <span className="font-body-sm text-[14px] text-m3-on-surface-variant">Mã hệ thống</span>
                    <span className="font-label-md text-[14px] font-semibold text-m3-on-surface font-mono">{activeItem.id.slice(0,8)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-m3-outline-variant/30">
                    <span className="font-body-sm text-[14px] text-m3-on-surface-variant">Quy cách</span>
                    <span className="font-label-md text-[14px] font-semibold text-m3-on-surface">{activeItem.unit}</span>
                  </div>
                </div>
                
                <div className="mt-[40px] flex gap-3">
                  <Link href="/inventory/vouchers/new" className="flex-1 bg-m3-primary text-m3-on-primary py-2.5 rounded-lg font-label-md text-[14px] font-semibold hover:bg-m3-surface-tint transition-colors text-center shadow-sm">
                    Nhập lô mới
                  </Link>
                  <button className="flex-1 border border-m3-primary text-m3-primary py-2.5 rounded-lg font-label-md text-[14px] font-semibold hover:bg-m3-primary/5 transition-colors text-center">
                    Ghi chú
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-m3-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-[24px] sticky top-[24px] border border-m3-outline-variant/30 h-64 flex flex-col items-center justify-center text-center">
                <Archive className="w-12 h-12 text-m3-outline-variant mb-4" />
                <p className="text-m3-on-surface-variant text-[14px]">Chọn một vật tư để xem chi tiết</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
