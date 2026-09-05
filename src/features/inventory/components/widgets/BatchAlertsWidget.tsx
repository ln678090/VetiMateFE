import { AlertTriangle, ClockAlert, PackageX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpiredBatches, useNearExpiryBatches } from '@/features/inventory/hooks/use-inventory';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function BatchAlertsWidget({ role }: { role: string }) {
  const { data: expiredBatchesRaw, isLoading: isLoadingExpired } = useExpiredBatches();
  const { data: nearExpiryBatchesRaw, isLoading: isLoadingNearExpiry } = useNearExpiryBatches();

  // Filter out medicines if the user is a Shop Staff
  const filterFn = (batch: any) => {
    if (role === 'SHOP_STAFF') return !!batch.productId;
    return true;
  };

  const expiredBatches = expiredBatchesRaw?.filter(filterFn);
  const nearExpiryBatches = nearExpiryBatchesRaw?.filter(filterFn);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Cảnh báo hết hạn */}
      <Card className="border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-rose-700 dark:text-rose-400">
            <PackageX className="w-5 h-5 mr-2" />
            Sản phẩm đã hết hạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingExpired ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : expiredBatches && expiredBatches.length > 0 ? (
            <ul className="space-y-3">
              {expiredBatches.slice(0, 5).map((batch) => (
                <li
                  key={batch.id}
                  className="bg-white/80 dark:bg-zinc-900/60 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30 shadow-sm"
                >
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {batch.medicineName || batch.productName}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1 flex justify-between">
                    <span>Lô: {batch.batchCode}</span>
                    <span className="text-rose-600 font-medium">
                      HSD: {formatDate(batch.expiryDate)}
                    </span>
                  </div>
                </li>
              ))}
              {expiredBatches.length > 5 && (
                <div className="text-center text-sm text-rose-600 font-medium mt-2">
                  + {expiredBatches.length - 5} lô khác đã hết hạn
                </div>
              )}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Tuyệt vời, không có sản phẩm nào đã hết hạn.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cảnh báo sắp hết hạn */}
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-amber-700 dark:text-amber-400">
            <ClockAlert className="w-5 h-5 mr-2" />
            Sản phẩm sắp hết hạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingNearExpiry ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : nearExpiryBatches && nearExpiryBatches.length > 0 ? (
            <ul className="space-y-3">
              {nearExpiryBatches.slice(0, 5).map((batch) => (
                <li
                  key={batch.id}
                  className="bg-white/80 dark:bg-zinc-900/60 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 shadow-sm"
                >
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {batch.medicineName || batch.productName}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1 flex justify-between">
                    <span>Lô: {batch.batchCode}</span>
                    <span className="text-amber-600 font-medium">
                      HSD: {formatDate(batch.expiryDate)}
                    </span>
                  </div>
                </li>
              ))}
              {nearExpiryBatches.length > 5 && (
                <div className="text-center text-sm text-amber-600 font-medium mt-2">
                  + {nearExpiryBatches.length - 5} lô khác sắp hết hạn
                </div>
              )}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Không có sản phẩm nào sắp hết hạn trong 30 ngày tới.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
