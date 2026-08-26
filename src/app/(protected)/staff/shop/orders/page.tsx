'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OrderTable } from './components/OrderTable';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Đơn hàng Shop
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Quản lý và theo dõi các đơn hàng bán ra của cửa hàng
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo đơn hàng mới
        </Button>
      </header>
      
      <Card>
        <CardContent className="p-0">
          <OrderTable 
            items={[]} // Backend for orders is planned for Phase 3
            isLoading={false} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
