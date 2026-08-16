import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailSkeleton() {
  return (
    <>
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main Card Skeleton */}
      <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,480px)_1fr]">
          {/* Gallery Skeleton */}
          <div className="border-b border-zinc-200/70 p-5 md:border-r md:border-b-0 dark:border-zinc-800/60">
            <div className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="p-5 md:p-6 space-y-5">
            {/* Title & Badges */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-3/4" />
            </div>

            {/* Rating / Reviews */}
            <Skeleton className="h-5 w-1/2" />

            {/* Price Banner */}
            <Skeleton className="h-20 w-full rounded-xl" />

            {/* Rows */}
            <div className="space-y-4 pt-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-8 w-1/3" />
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 flex-1 rounded-md" />
              <Skeleton className="h-12 flex-1 rounded-md" />
              <Skeleton className="h-12 w-12 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Sections Skeleton */}
      <div className="mt-4 space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </>
  );
}
