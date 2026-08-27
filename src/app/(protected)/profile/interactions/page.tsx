'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Heart, History, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import { userService } from '@/services/user.service';
import { ProductCard } from '@/features/shop/components/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type TimeFilter = 'all' | '7days' | '30days' | '3months';

function getDateRange(filter: TimeFilter): { startDate?: string; endDate?: string } {
  const endDate = new Date().toISOString();
  let startDate: string | undefined;
  const now = new Date();

  switch (filter) {
    case '7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '3months':
      now.setMonth(now.getMonth() - 3);
      startDate = now.toISOString();
      break;
    default:
      startDate = undefined;
  }

  return startDate ? { startDate, endDate } : {};
}

export default function InteractionsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState('favorites');

  const dates = getDateRange(timeFilter);

  const { data: favoritesData, isLoading: loadingFavorites } = useQuery({
    queryKey: ['my-favorites', page, timeFilter],
    queryFn: () => userService.getFavorites(page, 15, dates.startDate, dates.endDate),
  });

  const { data: viewedData, isLoading: loadingViewed } = useQuery({
    queryKey: ['my-viewed', page, timeFilter],
    queryFn: () => userService.getRecentlyViewed(page, 15, dates.startDate, dates.endDate),
  });

  const renderPagination = (data: any) => {
    if (!data || data.totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={data.first}
          className="rounded-xl"
        >
          <ChevronLeft className="size-4 mr-1" />
          Trước
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          Trang {data.number + 1} / {data.totalPages}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setPage(p => p + 1)}
          disabled={data.last}
          className="rounded-xl"
        >
          Sau
          <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sản phẩm tương tác</h1>
          <p className="text-muted-foreground">Quản lý sản phẩm bạn đã thích và đã xem</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <Select value={timeFilter} onValueChange={(v: TimeFilter) => { setTimeFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[180px] rounded-xl bg-white/50 backdrop-blur">
              <SelectValue placeholder="Lọc theo thời gian" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả thời gian</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="3months">3 tháng qua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(val) => { setActiveTab(val); setPage(0); }} 
        className="w-full"
      >
        <TabsList className="mb-6 bg-muted/50 rounded-2xl p-1 inline-flex h-12 w-full sm:w-auto">
          <TabsTrigger value="favorites" className="rounded-xl px-8 h-10 gap-2">
            <Heart className="size-4" /> Đã thích
          </TabsTrigger>
          <TabsTrigger value="viewed" className="rounded-xl px-8 h-10 gap-2">
            <History className="size-4" /> Đã xem
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites" className="mt-0">
          {loadingFavorites ? (
             <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
               {Array.from({ length: 15 }).map((_, i) => (
                 <Skeleton key={i} className="h-72 rounded-2xl" />
               ))}
             </div>
          ) : favoritesData?.content?.length ? (
             <>
               <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                 {favoritesData.content.map((product: any) => (
                   <ProductCard key={product.id} product={product} />
                 ))}
               </div>
               {renderPagination(favoritesData)}
             </>
          ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 rounded-3xl border border-dashed backdrop-blur-sm">
               <Heart className="size-12 text-rose-300 mb-4" />
               <p className="text-muted-foreground font-medium">Không tìm thấy sản phẩm yêu thích nào trong khoảng thời gian này.</p>
             </div>
          )}
        </TabsContent>

        <TabsContent value="viewed" className="mt-0">
          {loadingViewed ? (
             <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
               {Array.from({ length: 15 }).map((_, i) => (
                 <Skeleton key={i} className="h-72 rounded-2xl" />
               ))}
             </div>
          ) : viewedData?.content?.length ? (
             <>
               <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                 {viewedData.content.map((product: any) => (
                   <ProductCard key={product.id} product={product} />
                 ))}
               </div>
               {renderPagination(viewedData)}
             </>
          ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 rounded-3xl border border-dashed backdrop-blur-sm">
               <History className="size-12 text-zinc-300 mb-4" />
               <p className="text-muted-foreground font-medium">Không tìm thấy sản phẩm đã xem nào trong khoảng thời gian này.</p>
             </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="pt-4">
        <Button variant="outline" className="rounded-xl" asChild>
          <Link href="/profile">← Quay lại Hồ sơ</Link>
        </Button>
      </div>
    </div>
  );
}
