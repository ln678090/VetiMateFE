'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';

interface FullScreenLoaderProps {
  message?: string;
  className?: string;
}

/**
 * Full-screen loader cinematic - dùng khi AuthHydrator đang gọi /refresh
 * hoặc các trang protected đang xác thực.
 */
export function FullScreenLoader({
  message = 'Đang khởi tạo phiên làm việc',
  className,
}: FullScreenLoaderProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 grid place-items-center bg-gradient-to-br from-rose-50 via-white to-sky-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950',
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Pulsing paw with orbit ring */}
        <div className="relative h-20 w-20">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-rose-400/30 blur-xl dark:bg-rose-500/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-rose-300/60 dark:border-rose-400/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }}
          />
          <motion.div
            className="absolute inset-0 grid place-items-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-lg shadow-rose-300/40">
              <PawPrint className="h-6 w-6" strokeWidth={2.4} />
            </span>
          </motion.div>
        </div>

        <motion.p
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
