'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { supplierApi } from '@/features/inventory/api/inventory.api';
import { SupplierTable } from './components/SupplierTable';
import { SupplierFormModal } from './components/SupplierFormModal';

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: suppliersData, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierApi.getAll(true),
  });

  const suppliers = suppliersData?.data?.data || [];

  const filteredSuppliers = suppliers.filter((s: any) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Nhà cung cấp
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Quản lý thông tin nhà cung cấp hàng hóa cho cửa hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Thêm nhà cung cấp
          </Button>
        </div>
      </header>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm nhà cung cấp..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <SupplierTable suppliers={filteredSuppliers} isLoading={isLoading} />
        </CardContent>
      </Card>

      <SupplierFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
