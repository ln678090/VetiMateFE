'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const safeImages = images.length > 0 ? images : ['/placeholder.png'];
  const active = safeImages[activeIdx];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={active}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {safeImages.map((img, idx) => (
            <button
              key={img + idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg border-2 transition-all',
                idx === activeIdx
                  ? 'border-rose-500 shadow-md shadow-rose-200/50 dark:shadow-rose-500/20'
                  : 'border-zinc-200/70 hover:border-zinc-300 dark:border-zinc-800/60 dark:hover:border-zinc-700'
              )}
            >
              <Image
                src={img}
                alt={`${alt} - ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
