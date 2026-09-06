'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productApi } from '@/features/shop/api/product.api';
import { InventoryTable } from './components/InventoryTable';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy dữ liệu sản phẩm để xem tồn kho
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts(),
  });

  const products = productsData?.data?.items || [];

  // Client-side filter for simplicity
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Tồn kho Shop
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Xem số lượng hàng hóa còn lại trong kho của cửa hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex">
            Xuất file báo cáo
          </Button>
        </div>
      </header>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <InventoryTable products={filteredProducts} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
