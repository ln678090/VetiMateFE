'use client';

import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCcw,
  Syringe,
  Pill,
  Bone,
  CheckCircle2,
  Plus
} from 'lucide-react';
import {
  useInventoryDashboard,
  useNearExpiryBatches,
  useExpiredBatches,
} from '@/features/inventory/hooks/use-inventory';
import Link from 'next/link';

export default function InventoryDashboardPage() {
  const { data: dashboard, isLoading: dashLoading } = useInventoryDashboard();
  const { data: nearExpiry, isLoading: nearLoading } = useNearExpiryBatches();
  const { data: expired, isLoading: expiredLoading } = useExpiredBatches();

  const totalItems = dashboard?.totalMedicines || 0; // Simplified for mockup
  const totalAlerts = (nearExpiry?.length || 0) + (expired?.length || 0) + (dashboard?.lowStockCount || 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-[48px] bg-m3-background h-full">
      <div className="mb-[40px]">
        <h1 className="font-headline-lg text-[24px] md:text-[32px] font-semibold text-m3-on-surface mb-2 tracking-tight">
          Tổng Quan Kho
        </h1>
        <p className="font-body-md text-[16px] text-m3-on-surface-variant">
          Theo dõi số lượng và cảnh báo vật tư theo thời gian thực.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">
        
        {/* KPI Cards (Spans 8 cols on desktop, split into 2) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
          
          {/* Total Items */}
          <div className="bg-m3-surface rounded-xl p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-label-md text-[14px] font-semibold text-m3-on-surface-variant mb-1">Tổng Số Lượng Vật Tư</p>
                <h3 className="font-display-lg text-[48px] font-bold text-m3-on-surface">
                  {dashLoading ? '...' : totalItems}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-m3-primary-container/20 flex items-center justify-center text-m3-primary">
                <Package className="w-6 h-6" />
              </div>
            </div>
            {totalItems > 0 ? (
              <div className="flex items-center gap-2 text-m3-primary font-label-sm text-[12px] font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>+12% so với tháng trước</span>
              </div>
            ) : (
              <Link href="/inventory/vouchers/new" className="inline-flex items-center gap-2 text-m3-primary font-label-sm text-[13px] font-semibold hover:underline w-fit bg-m3-primary/10 px-3 py-1.5 rounded-full mt-2">
                <Plus className="w-4 h-4" />
                <span>Nhập lô hàng đầu tiên</span>
              </Link>
            )}
          </div>

          {/* Low Stock Alert */}
          <div className={`bg-m3-surface rounded-xl p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between relative overflow-hidden ${
            totalAlerts > 0 ? 'border-m3-error/20' : 'border-m3-surface-container-high'
          }`}>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -z-0 ${
              totalAlerts > 0 ? 'bg-m3-error/5' : 'bg-m3-primary/5'
            }`}></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className={`font-label-md text-[14px] font-semibold mb-1 ${
                  totalAlerts > 0 ? 'text-m3-error' : 'text-m3-primary'
                }`}>Cảnh Báo & Hết Hàng</p>
                <h3 className={`font-display-lg text-[48px] font-bold ${
                  totalAlerts > 0 ? 'text-m3-error' : 'text-m3-primary'
                }`}>
                  {nearLoading || expiredLoading ? '...' : totalAlerts}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                totalAlerts > 0 ? 'bg-m3-error-container text-m3-error' : 'bg-m3-primary-container text-m3-primary'
              }`}>
                {totalAlerts > 0 ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
            </div>
            <div className="flex items-center gap-2 text-m3-on-surface-variant font-label-sm text-[12px] font-medium relative z-10">
              <span>{totalAlerts > 0 ? 'Cần kiểm tra lại các lô cận date và hết hàng' : 'Tuyệt vời! Kho đang ở trạng thái an toàn'}</span>
            </div>
          </div>
        </div>

        {/* Stock Distribution Chart (Spans 4 cols on desktop) */}
        <div className="md:col-span-4 bg-m3-surface rounded-xl p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high flex flex-col items-center justify-center">
          <h3 className="font-label-md text-[14px] font-semibold text-m3-on-surface w-full mb-6 text-left">Phân Bổ Kho</h3>
          
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="var(--color-m3-surface-variant)" strokeWidth="10"></circle>
              {totalItems > 0 && (
                <>
                  <circle 
                    className="transition-all duration-1000 ease-out" 
                    cx="50" cy="50" fill="none" r="45" 
                    stroke="var(--color-m3-primary)" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * 0.65)} 
                    strokeWidth="10"
                  ></circle>
                  <circle 
                    className="transition-all duration-1000 ease-out" 
                    cx="50" cy="50" fill="none" r="45" 
                    stroke="var(--color-m3-tertiary-container)" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * 0.35)} 
                    strokeWidth="10" 
                    transform="rotate(234)" 
                    style={{ transformOrigin: "center" }}
                  ></circle>
                </>
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-md text-[24px] font-semibold text-m3-on-surface">{totalItems > 0 ? '100%' : '0'}</span>
              <span className="font-label-sm text-[12px] text-m3-on-surface-variant">{totalItems > 0 ? 'Tổng Dung Lượng' : 'Chưa có dữ liệu'}</span>
            </div>
          </div>
          {totalItems > 0 && (
            <div className="w-full flex justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-m3-primary"></span>
                <span className="font-label-sm text-[12px] text-m3-on-surface-variant">Thuốc (65%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-m3-tertiary-container"></span>
                <span className="font-label-sm text-[12px] text-m3-on-surface-variant">Vật Tư (35%)</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions (Full width row) */}
        <div className="md:col-span-12 bg-m3-surface rounded-xl p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-label-md text-[14px] font-semibold text-m3-on-surface">Lối Tắt Nhanh</h3>
            <Link href="/inventory/vouchers" className="text-m3-primary font-label-md text-[14px] font-semibold hover:underline">
              Lịch Sử Chi Tiết
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <Link href="/inventory/vouchers/new" className="flex items-center gap-3 p-4 rounded-xl hover:bg-m3-surface-container-low transition-colors border border-m3-outline-variant/50">
               <div className="p-3 rounded-full bg-m3-primary/10 text-m3-primary">
                 <ArrowDownRight className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-label-md text-[14px] font-semibold text-m3-on-surface">Nhập Kho Mới</p>
                 <p className="text-[12px] text-m3-on-surface-variant mt-0.5">Tạo phiếu nhập hàng</p>
               </div>
             </Link>
             <Link href="/inventory/vouchers/new" className="flex items-center gap-3 p-4 rounded-xl hover:bg-m3-surface-container-low transition-colors border border-m3-outline-variant/50">
               <div className="p-3 rounded-full bg-m3-secondary/10 text-m3-secondary">
                 <ArrowUpRight className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-label-md text-[14px] font-semibold text-m3-on-surface">Xuất Kho</p>
                 <p className="text-[12px] text-m3-on-surface-variant mt-0.5">Tạo phiếu xuất hàng</p>
               </div>
             </Link>
             <Link href="/inventory/medicines" className="flex items-center gap-3 p-4 rounded-xl hover:bg-m3-surface-container-low transition-colors border border-m3-outline-variant/50">
               <div className="p-3 rounded-full bg-m3-tertiary-container/20 text-m3-tertiary">
                 <Pill className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-label-md text-[14px] font-semibold text-m3-on-surface">Danh Mục Vật Tư</p>
                 <p className="text-[12px] text-m3-on-surface-variant mt-0.5">Xem tất cả sản phẩm</p>
               </div>
             </Link>
          </div>
        </div>

        {/* Recent Movements / Low Stock List (Full width) */}
        <div className="md:col-span-12 bg-m3-surface rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high overflow-hidden">
          <div className="p-4 border-b border-m3-surface-container-high flex justify-between items-center bg-m3-surface-bright">
            <h3 className="font-label-md text-[14px] font-semibold text-m3-on-surface">Danh Sách Cần Chú Ý (Lô Cận Date/Hết Hạn)</h3>
            <Link href="/inventory/medicines" className="text-m3-primary font-label-md text-[14px] font-semibold hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="flex flex-col">
            {nearLoading || expiredLoading ? (
               <div className="p-8 text-center text-m3-on-surface-variant text-sm">Đang tải...</div>
            ) : [...(expired || []), ...(nearExpiry || [])].length === 0 ? (
               <div className="flex flex-col items-center justify-center p-8 text-center">
                 <div className="w-16 h-16 bg-m3-primary/10 rounded-full flex items-center justify-center mb-4 text-m3-primary">
                   <Package className="w-8 h-8" />
                 </div>
                 <p className="font-label-lg text-m3-on-surface mb-2 font-medium">Kho hàng đang an toàn</p>
                 <p className="font-label-sm text-m3-on-surface-variant mb-6 max-w-sm">
                   Hệ thống sẽ tự động nhắc nhở khi có vật tư sắp hết hạn hoặc tồn kho thấp. Hãy bắt đầu quản lý kho ngay!
                 </p>
                 <Link href="/inventory/vouchers/new" className="bg-m3-primary text-m3-on-primary px-5 py-2 rounded-full font-label-md font-semibold hover:bg-m3-primary/90 transition-colors">
                   Tạo phiếu nhập kho
                 </Link>
               </div>
            ) : (
              [...(expired || []), ...(nearExpiry || [])].slice(0, 4).map((batch, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border-b border-m3-surface-container-high hover:bg-m3-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center border border-m3-outline-variant">
                      <Syringe className="w-5 h-5 text-m3-on-surface-variant" />
                    </div>
                    <div>
                      <h4 className="font-label-md text-[14px] font-semibold text-m3-on-surface">{batch.medicineName || batch.productName}</h4>
                      <p className="font-label-sm text-[12px] text-m3-on-surface-variant">Lô: {batch.batchCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-32 hidden sm:block">
                      <div className="w-full bg-m3-surface-container h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${batch.isExpired ? 'bg-m3-error' : 'bg-m3-tertiary-container'}`} style={{ width: '25%' }}></div>
                      </div>
                      <p className="font-label-sm text-[12px] text-m3-on-surface-variant mt-1 text-right">Tồn: {batch.remainingQty}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-label-sm text-[12px] font-medium ${
                      batch.isExpired ? 'bg-m3-error-container text-m3-error' : 'bg-m3-tertiary-fixed text-m3-on-tertiary-fixed'
                    }`}>
                      {batch.isExpired ? 'Đã hết hạn' : 'Sắp hết hạn'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
