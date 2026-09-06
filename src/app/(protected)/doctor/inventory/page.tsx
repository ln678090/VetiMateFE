'use client';

import { useMemo, useState } from 'react';
import {
  Stethoscope,
  Search,
  Pill,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  Syringe,
  Filter,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import { useBatchesByWarehouse } from '@/features/inventory/hooks/use-inventory';
import type { StockBatchResp } from '@/types/inventory';

export default function DoctorInventoryPage() {
  const { data: batches = [], isLoading, refetch, isFetching } = useBatchesByWarehouse('DOCTOR');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'EXPIRED' | 'NEAR_EXPIRY' | 'GOOD'>(
    'ALL'
  );

  // Calculate statistics
  const stats = useMemo(() => {
    let expiredCount = 0;
    let nearExpiryCount = 0;
    let goodCount = 0;
    let totalQty = 0;
    const uniqueMedicines = new Set<string>();

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    batches.forEach((batch) => {
      totalQty += batch.remainingQty || 0;
      if (batch.medicineId) uniqueMedicines.add(batch.medicineId);
      else if (batch.productId) uniqueMedicines.add(batch.productId);

      if (batch.isExpired) {
        expiredCount++;
      } else if (batch.expiryDate) {
        const exp = new Date(batch.expiryDate);
        if (exp <= thirtyDaysFromNow) {
          nearExpiryCount++;
        } else {
          goodCount++;
        }
      } else {
        goodCount++;
      }
    });

    return {
      totalBatches: batches.length,
      totalMedicines: uniqueMedicines.size,
      totalQty,
      expiredCount,
      nearExpiryCount,
      goodCount,
    };
  }, [batches]);

  // Filter batches
  const filteredBatches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    return batches.filter((batch) => {
      // Search matching
      const name = (batch.medicineName || batch.productName || '').toLowerCase();
      const code = (batch.batchCode || '').toLowerCase();
      const matchesSearch = !term || name.includes(term) || code.includes(term);

      if (!matchesSearch) return false;

      // Status matching
      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'EXPIRED') return !!batch.isExpired;
      if (statusFilter === 'NEAR_EXPIRY') {
        if (batch.isExpired) return false;
        if (!batch.expiryDate) return false;
        const exp = new Date(batch.expiryDate);
        return exp <= thirtyDaysFromNow;
      }
      if (statusFilter === 'GOOD') {
        if (batch.isExpired) return false;
        if (!batch.expiryDate) return true;
        const exp = new Date(batch.expiryDate);
        return exp > thirtyDaysFromNow;
      }

      return true;
    });
  }, [batches, searchTerm, statusFilter]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-[48px] bg-m3-background h-full">
      {/* Header */}
      <div className="mb-[32px] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300/40">
              <Stethoscope className="w-3.5 h-3.5" />
              Tủ thuốc phòng khám (Kho Bác sĩ)
            </span>
          </div>
          <h1 className="font-headline-lg text-[24px] md:text-[32px] font-semibold text-m3-on-surface tracking-tight">
            Kho Dược & Vật Tư Của Bác Sĩ
          </h1>
          <p className="font-body-md text-[15px] text-m3-on-surface-variant mt-1">
            Quản lý các lô thuốc, vật tư tại phòng khám được điều chuyển từ kho bảo quản để phục vụ
            chẩn đoán & điều trị.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-m3-surface border border-m3-outline-variant hover:bg-m3-surface-container text-sm font-medium text-m3-on-surface transition-colors shadow-sm self-start md:self-auto cursor-pointer"
        >
          <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin text-m3-primary' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total batches */}
        <div className="bg-m3-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-m3-on-surface-variant">Tổng số lô thuốc</p>
              <h3 className="text-3xl font-bold text-m3-on-surface mt-1">
                {isLoading ? '...' : stats.totalBatches}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-m3-on-surface-variant mt-3">
            Gồm <strong className="text-m3-on-surface">{stats.totalMedicines}</strong> mặt hàng /
            thuốc
          </p>
        </div>

        {/* Total remaining qty */}
        <div className="bg-m3-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-m3-on-surface-variant">Tổng số lượng tồn</p>
              <h3 className="text-3xl font-bold text-m3-on-surface mt-1">
                {isLoading ? '...' : stats.totalQty.toLocaleString('vi-VN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-m3-on-surface-variant mt-3">Sẵn sàng cấp phát & kê đơn</p>
        </div>

        {/* Expired Batches (Transferred from Storage) */}
        <div className="bg-m3-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                Lô đã hết hạn (chuyển lên)
              </p>
              <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                {isLoading ? '...' : stats.expiredCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-m3-on-surface-variant mt-3">
            Từ kho bảo quản xuất lên để ưu tiên xử lý
          </p>
        </div>

        {/* Near Expiry */}
        <div className="bg-m3-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Lô cận date (&le; 30 ngày)
              </p>
              <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {isLoading ? '...' : stats.nearExpiryCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-m3-on-surface-variant mt-3">
            Ưu tiên kê đơn trước khi hết date
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-m3-surface rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-m3-on-surface-variant" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên thuốc, mã lô..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-m3-outline-variant bg-m3-surface-container-lowest focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/10 outline-none text-sm text-m3-on-surface transition"
          />
        </div>

        {/* Filter status tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-m3-surface-container rounded-xl self-stretch sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-m3-surface text-m3-primary shadow-sm font-semibold'
                : 'text-m3-on-surface-variant hover:text-m3-on-surface'
            }`}
          >
            Tất cả ({batches.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('EXPIRED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              statusFilter === 'EXPIRED'
                ? 'bg-red-600 text-white shadow-sm font-semibold'
                : 'text-m3-on-surface-variant hover:text-red-600'
            }`}
          >
            <span>Hết date</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {stats.expiredCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('NEAR_EXPIRY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              statusFilter === 'NEAR_EXPIRY'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-m3-on-surface-variant hover:text-amber-600'
            }`}
          >
            <span>Cận date</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {stats.nearExpiryCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('GOOD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              statusFilter === 'GOOD'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-m3-on-surface-variant hover:text-emerald-600'
            }`}
          >
            Còn hạn ({stats.goodCount})
          </button>
        </div>
      </div>

      {/* Batches Table Card */}
      <div className="bg-m3-surface rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-m3-surface-container-high overflow-hidden">
        <div className="p-4 border-b border-m3-surface-container-high flex justify-between items-center bg-m3-surface-bright">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <h3 className="font-label-md text-sm font-semibold text-m3-on-surface">
              Danh Sách Lô Thuốc Tại Phòng Khám ({filteredBatches.length})
            </h3>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-m3-on-surface-variant text-sm">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Đang tải dữ liệu kho bác sĩ...
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/40 rounded-full flex items-center justify-center mb-4 text-sky-600">
              <Stethoscope className="w-8 h-8" />
            </div>
            <p className="font-medium text-m3-on-surface mb-1">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Không tìm thấy lô thuốc nào phù hợp với bộ lọc'
                : 'Chưa có lô thuốc nào trong kho của bác sĩ'}
            </p>
            <p className="text-xs text-m3-on-surface-variant max-w-md">
              Khi thủ kho xuất điều chuyển hoặc xuất các lô hết hạn từ kho bảo quản lên, danh sách
              các lô sẽ hiển thị tại đây để bác sĩ sử dụng.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-m3-surface-container text-xs text-m3-on-surface-variant font-semibold uppercase tracking-wider border-b border-m3-outline-variant/40">
                <tr>
                  <th className="py-3 px-4">Tên thuốc / Sản phẩm</th>
                  <th className="py-3 px-4">Mã lô</th>
                  <th className="py-3 px-4">Hạn sử dụng</th>
                  <th className="py-3 px-4 text-right">Số lượng tồn</th>
                  <th className="py-3 px-4 text-right">Đơn giá nhập</th>
                  <th className="py-3 px-4 text-center">Trạng thái date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-m3-surface-container-high font-normal">
                {filteredBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-m3-surface-container-low/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 border border-sky-200/40">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-m3-on-surface">
                            {batch.medicineName || batch.productName || 'Thuốc'}
                          </p>
                          <p className="text-xs text-m3-on-surface-variant">
                            Kho:{' '}
                            <span className="font-medium text-sky-600 dark:text-sky-400">
                              Kho Bác Sĩ
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-medium text-m3-on-surface">
                      {batch.batchCode}
                    </td>
                    <td className="py-3 px-4 text-xs text-m3-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-m3-on-surface-variant" />
                        <span>{batch.expiryDate || 'Không xác định'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-m3-on-surface text-sm">
                        {batch.remainingQty.toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-m3-on-surface-variant">
                      {batch.importPrice
                        ? `${Number(batch.importPrice).toLocaleString('vi-VN')} đ`
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {batch.isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300/30">
                          <AlertTriangle className="w-3 h-3" />
                          Đã hết hạn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Còn hạn
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
