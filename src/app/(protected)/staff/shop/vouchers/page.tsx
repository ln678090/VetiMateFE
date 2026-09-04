'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllVouchers } from '@/features/loyalty/api/loyalty.api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { VoucherTable } from './components/VoucherTable';
import { VoucherFormModal } from './components/VoucherFormModal';
import { Voucher } from '@/features/loyalty/types/loyalty.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VouchersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | undefined>();

  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['management', 'vouchers'],
    queryFn: getAllVouchers,
  });

  const [tierFilter, setTierFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredVouchers = (vouchers || []).filter((v) => {
    if (tierFilter !== 'ALL') {
      if (tierFilter === 'NONE') {
        if (v.requiredTier) return false;
      } else {
        if (v.requiredTier !== tierFilter) return false;
      }
    }
    if (typeFilter !== 'ALL' && v.discountType !== typeFilter) {
      return false;
    }
    return true;
  });

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedVoucher(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý Voucher</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Voucher
        </Button>
      </div>

      <div className="flex items-center gap-4 pb-2">
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo hạng yêu cầu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả các hạng (bỏ lọc)</SelectItem>
            <SelectItem value="NONE">Dành cho mọi hạng</SelectItem>
            <SelectItem value="MEMBER">Tiêu chuẩn (MEMBER)</SelectItem>
            <SelectItem value="BRONZE">Hạng Đồng (BRONZE)</SelectItem>
            <SelectItem value="SILVER">Hạng Bạc (SILVER)</SelectItem>
            <SelectItem value="GOLD">Hạng Vàng (GOLD)</SelectItem>
            <SelectItem value="DIAMOND">Hạng Kim Cương (DIAMOND)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo loại giảm giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả loại giảm giá</SelectItem>
            <SelectItem value="FIXED">Theo số tiền (VND)</SelectItem>
            <SelectItem value="PERCENTAGE">Theo phần trăm (%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <VoucherTable data={filteredVouchers} isLoading={isLoading} onEdit={handleEdit} />

      <VoucherFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedVoucher}
      />
    </div>
  );
}
