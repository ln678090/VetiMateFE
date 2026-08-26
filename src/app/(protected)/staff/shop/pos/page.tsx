'use client';

import { ShoppingCart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function POSPage() {
  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Left side: Products List */}
      <div className="flex-1 flex flex-col space-y-4">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Bán hàng tại quầy (POS)
          </h1>
        </header>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input className="pl-9 bg-white" placeholder="Tìm kiếm sản phẩm theo tên, SKU..." />
          </div>
          <Button variant="outline">Quét mã vạch</Button>
        </div>
        
        <div className="flex-1 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-center p-6">
          <div className="rounded-full bg-white p-3 mb-4 shadow-sm border border-zinc-100">
            <ShoppingCart className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">Tính năng POS đang được phát triển</h3>
          <p className="mt-1 text-sm text-zinc-500 max-w-sm">
            Giao diện bán hàng trực tiếp tại quầy sẽ được hoàn thiện trong Giai đoạn 3.
          </p>
        </div>
      </div>

      {/* Right side: Cart */}
      <div className="w-96 flex flex-col">
        <Card className="flex-1 flex flex-col shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg">Giỏ hàng hiện tại</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center flex-col p-6 text-center">
            <p className="text-sm text-zinc-500 mb-6">Chưa có sản phẩm nào trong giỏ</p>
            <div className="w-full space-y-4 mt-auto">
              <div className="flex justify-between font-medium">
                <span>Tổng tiền:</span>
                <span>0 ₫</span>
              </div>
              <Button className="w-full" disabled>Thanh toán</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
