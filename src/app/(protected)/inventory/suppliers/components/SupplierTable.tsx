'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SupplierResp } from '@/types/inventory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Ban, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { SupplierFormModal } from './SupplierFormModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/features/inventory/api/inventory.api';
import { toast } from 'sonner';

interface SupplierTableProps {
  suppliers: SupplierResp[];
  isLoading: boolean;
}

export function SupplierTable({ suppliers, isLoading }: SupplierTableProps) {
  const [editingSupplier, setEditingSupplier] = useState<SupplierResp | null>(null);
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (id: string) => supplierApi.toggleActive(id),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật trạng thái');
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Đang tải dữ liệu...</div>;
  }

  if (suppliers.length === 0) {
    return <div className="p-8 text-center text-zinc-500">Không tìm thấy nhà cung cấp nào.</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên nhà cung cấp</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.phone || '-'}</TableCell>
                <TableCell>{supplier.email || '-'}</TableCell>
                <TableCell>
                  {supplier.isActive ? (
                    <Badge
                      variant="default"
                      className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
                    >
                      Hoạt động
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                    >
                      Ngừng HĐ
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingSupplier(supplier)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8 ${supplier.isActive ? 'text-red-500 hover:text-red-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                    onClick={() => toggleMutation.mutate(supplier.id)}
                  >
                    {supplier.isActive ? (
                      <Ban className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingSupplier && (
        <SupplierFormModal
          isOpen={true}
          onClose={() => setEditingSupplier(null)}
          supplier={editingSupplier}
        />
      )}
    </>
  );
}
