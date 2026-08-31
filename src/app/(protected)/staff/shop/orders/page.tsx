'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OrderTable } from './components/OrderTable';

import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['shop-orders'],
    queryFn: orderService.getAllShopOrders,
  });

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
      </header>
      
      <Card>
        <CardContent className="p-0">
          <OrderTable 
            items={orders as any}
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
