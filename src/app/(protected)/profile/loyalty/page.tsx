'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyPoints,
  getAvailableVouchers,
  getMyVouchers,
  getMyTransactions,
  redeemVoucher,
} from '@/features/loyalty/api/loyalty.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatVND } from '@/lib/utils';
import { Star, Ticket, Gift, History, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState, useEffect } from 'react';

const getNextTierInfo = (currentTier: string | undefined, totalSpending: number | undefined) => {
  const spending = totalSpending || 0;
  if (!currentTier || currentTier === 'DIAMOND') return null;

  let nextTierName = 'Hạng Đồng';
  let nextReq = 3000000;
  let currentReq = 0;

  if (currentTier === 'MEMBER') {
    nextTierName = 'Hạng Đồng';
    nextReq = 3000000;
    currentReq = 0;
  } else if (currentTier === 'BRONZE') {
    nextTierName = 'Hạng Bạc';
    nextReq = 7000000;
    currentReq = 3000000;
  } else if (currentTier === 'SILVER') {
    nextTierName = 'Hạng Vàng';
    nextReq = 10000000;
    currentReq = 7000000;
  } else if (currentTier === 'GOLD') {
    nextTierName = 'Hạng Kim Cương';
    nextReq = 15000000;
    currentReq = 10000000;
  }

  const amountNeeded = Math.max(0, nextReq - spending);
  const progress = Math.max(
    0,
    Math.min(100, ((spending - currentReq) / (nextReq - currentReq)) * 100)
  );

  return { nextTierName, amountNeeded, progress };
};

export default function LoyaltyPage() {
  const queryClient = useQueryClient();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000); // Cập nhật thời gian mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  const { data: points, isLoading: loadingPoints } = useQuery({
    queryKey: ['loyalty', 'points'],
    queryFn: getMyPoints,
  });

  const { data: availableVouchers, isLoading: loadingAvailable } = useQuery({
    queryKey: ['loyalty', 'availableVouchers'],
    queryFn: getAvailableVouchers,
  });

  const { data: myVouchers, isLoading: loadingMyVouchers } = useQuery({
    queryKey: ['loyalty', 'myVouchers'],
    queryFn: getMyVouchers,
  });

  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['loyalty', 'transactions'],
    queryFn: getMyTransactions,
  });

  const redeemMutation = useMutation({
    mutationFn: redeemVoucher,
    onSuccess: () => {
      toast.success('Đổi điểm lấy voucher thành công!');
      queryClient.invalidateQueries({ queryKey: ['loyalty'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đổi voucher thất bại');
    },
  });

  const handleRedeem = (voucherId: string) => {
    if (confirm('Bạn có chắc chắn muốn đổi điểm lấy voucher này?')) {
      redeemMutation.mutate(voucherId);
    }
  };

  const nextTierInfo = getNextTierInfo(points?.tier, points?.totalSpending);

  const filteredVouchers =
    availableVouchers?.filter((v) => {
      if (v.endDate && new Date(v.endDate) < now) return false; // Tự động ẩn nếu đã hết hạn theo thời gian thực (client-side)
      if (!v.requiredTier) return true; // Dành cho mọi hạng (null/undefined)
      if (v.requiredTier === 'STANDARD') return true; // Hạng tiêu chuẩn thì ai cũng dùng được
      return v.requiredTier === points?.tier; // Các hạng khác phải match chính xác
    }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight">Thành viên & Ưu đãi</h2>
        {!loadingPoints && points?.tier && (
          <Badge
            className={`ml-3 ${
              points.tier === 'DIAMOND'
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                : points.tier === 'GOLD'
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : points.tier === 'SILVER'
                    ? 'bg-slate-300 hover:bg-slate-400 text-slate-800'
                    : points.tier === 'BRONZE'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {points.tier === 'DIAMOND'
              ? 'Hạng Kim Cương'
              : points.tier === 'GOLD'
                ? 'Hạng Vàng'
                : points.tier === 'SILVER'
                  ? 'Hạng Bạc'
                  : points.tier === 'BRONZE'
                    ? 'Hạng Đồng'
                    : 'Thành viên'}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground">
        Quản lý điểm thưởng, hạng thành viên và voucher của bạn
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Hạng thành viên</CardTitle>
            <Star className="h-5 w-5 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-1">
              {loadingPoints
                ? '...'
                : points?.tier === 'DIAMOND'
                  ? 'Kim Cương'
                  : points?.tier === 'GOLD'
                    ? 'Vàng'
                    : points?.tier === 'SILVER'
                      ? 'Bạc'
                      : points?.tier === 'BRONZE'
                        ? 'Đồng'
                        : points?.tier === 'STANDARD'
                          ? 'Tiêu chuẩn'
                          : 'Tiêu chuẩn'}
            </div>
            <p className="text-indigo-100 text-sm mt-2">
              Chi tiêu: {loadingPoints ? '...' : formatVND(points?.totalSpending || 0)}
            </p>

            {!loadingPoints && nextTierInfo && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-indigo-50 font-medium">
                  <span>
                    Cần {formatVND(nextTierInfo.amountNeeded)} để lên {nextTierInfo.nextTierName}
                  </span>
                </div>
                <div className="h-2 w-full bg-indigo-950/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${nextTierInfo.progress}%` }}
                  />
                </div>
              </div>
            )}

            {!loadingPoints && points?.tier === 'DIAMOND' && (
              <div className="mt-4 text-xs text-indigo-100 bg-indigo-950/20 py-2 px-2 rounded-md font-medium text-center">
                🎉 Bạn đang ở hạng cao nhất!
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Điểm hiện có</CardTitle>
            <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-1">
              {loadingPoints ? '...' : points?.availablePoints?.toLocaleString()}
            </div>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Tổng điểm tích lũy: {loadingPoints ? '...' : points?.totalPoints?.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Voucher của tôi</CardTitle>
            <Ticket className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-1">
              {loadingMyVouchers ? '...' : myVouchers?.filter((v) => !v.isUsed).length}
            </div>
            <p className="text-slate-300 text-sm mt-1">Sẵn sàng để sử dụng</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="redeem" className="space-y-4">
        <TabsList>
          <TabsTrigger value="redeem" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Đổi thưởng
          </TabsTrigger>
          <TabsTrigger value="my-vouchers" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Voucher của tôi
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Lịch sử
          </TabsTrigger>
        </TabsList>

        <TabsContent value="redeem" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voucher có thể đổi</CardTitle>
              <CardDescription>
                Sử dụng điểm tích lũy của bạn để đổi các mã giảm giá hấp dẫn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAvailable ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredVouchers.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  Hiện không có voucher nào để đổi.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVouchers.map((voucher) => (
                    <Card
                      key={voucher.id}
                      className="flex flex-col overflow-hidden border-primary/20 bg-primary/5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="bg-primary p-3 text-primary-foreground flex justify-between items-center">
                        <span className="font-bold">{voucher.code}</span>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-300 text-yellow-900 border-none shadow-sm"
                        >
                          {voucher.pointCost} điểm
                        </Badge>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="text-lg font-bold text-primary">
                          Giảm{' '}
                          {voucher.discountType === 'FIXED'
                            ? formatVND(voucher.discountValue)
                            : `${voucher.discountValue}%`}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {voucher.description || 'Sử dụng cho đơn hàng mua online'}
                        </p>
                        <div className="text-xs space-y-1 text-slate-500 mt-2 mb-4">
                          {voucher.minOrderAmount != null && voucher.minOrderAmount > 0 && (
                            <div>Đơn tối thiểu: {formatVND(voucher.minOrderAmount)}</div>
                          )}
                          {voucher.maxDiscount != null && voucher.maxDiscount > 0 && (
                            <div>Giảm tối đa: {formatVND(voucher.maxDiscount)}</div>
                          )}
                          {voucher.endDate && (
                            <div className="text-red-500 font-medium">
                              Hết hạn:{' '}
                              {format(new Date(voucher.endDate), 'HH:mm dd/MM/yyyy', {
                                locale: vi,
                              })}
                            </div>
                          )}
                        </div>
                        <Button
                          className="w-full mt-auto font-medium"
                          disabled={
                            redeemMutation.isPending ||
                            (points?.availablePoints || 0) < voucher.pointCost
                          }
                          onClick={() => handleRedeem(voucher.id)}
                        >
                          {(points?.availablePoints || 0) < voucher.pointCost
                            ? 'Chưa đủ điểm'
                            : 'Đổi ngay'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-vouchers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voucher đã đổi</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMyVouchers ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : myVouchers?.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  Bạn chưa đổi voucher nào.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myVouchers?.map((uv) => (
                    <Card
                      key={uv.id}
                      className={`flex overflow-hidden border ${uv.isUsed ? 'opacity-60 bg-slate-50' : 'border-green-200 bg-green-50/30'}`}
                    >
                      <div
                        className={`w-24 ${uv.isUsed ? 'bg-slate-300' : 'bg-green-500'} flex items-center justify-center text-white border-r border-dashed border-white`}
                      >
                        <div className="-rotate-90 font-bold tracking-widest whitespace-nowrap">
                          {uv.isUsed ? 'ĐÃ DÙNG' : 'VOUCHER'}
                        </div>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-lg">{uv.voucher.code}</div>
                            <div className="text-sm text-green-700 font-medium">
                              Giảm{' '}
                              {uv.voucher.discountType === 'FIXED'
                                ? formatVND(uv.voucher.discountValue)
                                : `${uv.voucher.discountValue}%`}
                            </div>
                          </div>
                          {uv.isUsed && (
                            <Badge variant="outline" className="bg-slate-100">
                              Đã sử dụng
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {uv.voucher.description}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          <div>
                            Đã dùng:{' '}
                            {uv.usedAt &&
                              format(new Date(uv.usedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                          </div>
                          {uv.voucher.endDate && !uv.isUsed && (
                            <div className="text-red-500 font-medium mt-1">
                              Hết hạn:{' '}
                              {format(new Date(uv.voucher.endDate), 'HH:mm dd/MM/yyyy', {
                                locale: vi,
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử điểm</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTransactions ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : transactions?.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  Chưa có lịch sử giao dịch.
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions?.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${tx.type === 'EARN' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}
                        >
                          {tx.type === 'EARN' ? (
                            <Star className="h-4 w-4" />
                          ) : (
                            <Gift className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(tx.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`font-bold ${tx.type === 'EARN' ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {tx.type === 'EARN' ? '+' : '-'}
                        {tx.points}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
