'use client';

import { motion } from 'framer-motion';
import { PackageSearch, Search } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderCard } from '@/features/shop/components/OrderCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { orderService } from '@/services/order.service';
import { OrderStatus, Order } from '@/types/order';
import { ReviewOrderModal } from '@/features/shop/components/ReviewOrderModal';

const TABS: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderService.getMyOrders,
  });

  // Filter orders by status and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = activeTab === 'ALL' || order.status === activeTab;
    const matchesSearch =
      order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    let matchesDate = true;
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (timeRange === 'TODAY') {
      if (orderDate.getTime() !== today.getTime()) matchesDate = false;
    } else if (timeRange === 'THIS_WEEK') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(today.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);
      if (orderDate < startOfWeek) matchesDate = false;
    } else if (timeRange === 'THIS_MONTH') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      if (orderDate < startOfMonth) matchesDate = false;
    } else if (timeRange === 'CUSTOM') {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (orderDate > end) matchesDate = false;
      }
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderService.cancelRequest({ id, reason }),
    onSuccess: () => {
      toast.success('Đã gửi yêu cầu hủy đơn hàng', {
        description: 'Vui lòng chờ cửa hàng xác nhận.',
      });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra', {
        description: 'Vui lòng thử lại sau.',
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, reviews }: { id: string; reviews: { productId: string; rating: number; comment: string }[] }) => 
      orderService.reviewOrder({ id, reviews }),
    onSuccess: () => {
      toast.success('Đánh giá thành công!', {
        description: 'Bạn đã nhận được 50 điểm thưởng.',
      });
      setIsReviewModalOpen(false);
      setReviewOrderId(null);
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      // Also invalidate points if they are fetched somewhere else
      queryClient.invalidateQueries({ queryKey: ['my-points'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-transactions'] });
    },
    onError: (error: any) => {
      toast.error('Có lỗi xảy ra', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau.',
      });
    },
  });

  const handleCancelOrder = (orderId: string, reason: string) => {
    cancelMutation.mutate({ id: orderId, reason });
  };

  const handleReviewOrder = (orderId: string) => {
    setReviewOrderId(orderId);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (reviews: { productId: string; rating: number; comment: string }[]) => {
    if (reviewOrderId) {
      reviewMutation.mutate({ id: reviewOrderId, reviews });
    }
  };

  const reviewOrder = orders.find(o => o.id === reviewOrderId);

  return (
    <div className="space-y-8">
      <Tabs
        defaultValue="ALL"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as OrderStatus | 'ALL')}
        className="w-full"
      >
        {/* Scrollable TabsList for mobile support */}
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex h-auto w-max min-w-full justify-start rounded-xl border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-rose-500/10 dark:data-[state=active]:text-rose-400"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between py-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Đơn Hàng Của Tôi</h1>
            <p className="mt-2 text-zinc-500">Quản lý và theo dõi trạng thái đơn hàng của bạn</p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {timeRange === 'CUSTOM' && (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 w-[130px] rounded-xl border-zinc-200 bg-white text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                  title="Từ ngày"
                />
                <span className="text-zinc-400">-</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 w-[130px] rounded-xl border-zinc-200 bg-white text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                  title="Đến ngày"
                />
              </div>
            )}

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="!h-12 w-full lg:w-[160px] rounded-xl border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả thời gian</SelectItem>
                <SelectItem value="TODAY">Hôm nay</SelectItem>
                <SelectItem value="THIS_WEEK">Tuần này</SelectItem>
                <SelectItem value="THIS_MONTH">Tháng này</SelectItem>
                <SelectItem value="CUSTOM">Tùy chọn...</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                type="text"
                placeholder="Mã đơn hoặc tên SP..."
                className="h-12 w-full rounded-xl border-zinc-200 bg-white pl-10 pr-4 shadow-sm focus-visible:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-rose-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="m-0 space-y-4">
            {filteredOrders.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onCancelOrder={handleCancelOrder} onReviewOrder={handleReviewOrder} />
                ))}
              </motion.div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200/80 bg-white/50 text-center dark:border-zinc-800/80 dark:bg-zinc-950/50">
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-100 to-zinc-50 shadow-inner dark:from-zinc-900 dark:to-zinc-800">
                  <PackageSearch className="h-10 w-10 text-zinc-400" strokeWidth={1.5} />
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white shadow-md dark:bg-zinc-950" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Chưa có đơn hàng
                </h3>
                <p className="mt-2 max-w-sm text-zinc-500 dark:text-zinc-400">
                  Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại của bạn.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <ReviewOrderModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewOrderId(null);
        }}
        onSubmit={handleSubmitReview}
        isSubmitting={reviewMutation.isPending}
        items={reviewOrder?.items || []}
      />
    </div>
  );
}
