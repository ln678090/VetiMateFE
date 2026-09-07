'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllVouchers, deleteVoucher } from '@/features/loyalty/api/loyalty.api';
import { toast } from 'sonner';
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
  /**
   * Component chính hiển thị trang Quản lý Voucher (dành cho Admin/Shop Staff).
   * Cung cấp các tính năng:
   * - Hiển thị danh sách Voucher kèm theo bộ lọc (Loại giảm giá, Trạng thái).
   * - Tạo mới / Chỉnh sửa / Xóa Voucher.
   */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | undefined>();

  // Fetch danh sách vouchers từ API
  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['management', 'vouchers'],
    queryFn: getAllVouchers,
  });

  // State lưu trữ giá trị của bộ lọc
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Lọc danh sách vouchers dựa trên typeFilter và statusFilter
  const filteredVouchers = (vouchers || []).filter((v) => {
    if (typeFilter !== 'ALL' && v.discountType !== typeFilter) {
      return false;
    }

    if (statusFilter !== 'ALL') {
      const isExpired = v.endDate && new Date() > new Date(v.endDate);

      if (statusFilter === 'EXPIRED' && !isExpired) return false;
      if (statusFilter === 'ACTIVE' && (!v.isActive || isExpired)) return false;
      if (statusFilter === 'INACTIVE' && v.isActive) return false;
    }

    return true;
  });

  // Mở modal để chỉnh sửa voucher đã chọn
  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  // Mở modal với trạng thái trống để tạo voucher mới
  const handleCreate = () => {
    setSelectedVoucher(undefined);
    setIsModalOpen(true);
  };

  const queryClient = useQueryClient();

  // Mutation xử lý xóa voucher và cập nhật lại danh sách sau khi thành công
  const deleteMutation = useMutation({
    mutationFn: deleteVoucher,
    onSuccess: () => {
      toast.success('Xóa voucher thành công');
      queryClient.invalidateQueries({ queryKey: ['management', 'vouchers'] });
    },
    onError: (err: any) => {
      toast.error('Lỗi khi xóa voucher', {
        description: err?.response?.data?.message || err.message,
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
            <SelectItem value="INACTIVE">Đã tắt</SelectItem>
            <SelectItem value="EXPIRED">Hết hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <VoucherTable
        data={filteredVouchers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <VoucherFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedVoucher}
      />
    </div>
  );
}
