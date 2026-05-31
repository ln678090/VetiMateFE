'use client';

import { animate, stagger } from 'animejs';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarHeart, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';

export function LandingHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Anime.js text reveal - chỉ chạy 1 lần khi mount
  useEffect(() => {
    if (!titleRef.current) return;

    const chars = titleRef.current.querySelectorAll('[data-char]');
    if (chars.length === 0) return;

    animate(chars, {
      opacity: [0, 1],
      translateY: [24, 0],
      rotateZ: [-2, 0],
      duration: 700,
      delay: stagger(28, { start: 200 }),
      easing: 'cubicBezier(.22, 1, .36, 1)',
    });
  }, []);

  const titleParts = [
    { text: 'Yêu thương ', color: 'default' },
    { text: 'thú cưng', color: 'gradient' },
    { text: ' theo cách ', color: 'default' },
    { text: 'thông minh', color: 'gradient' },
  ];

  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Grid pattern background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
      />

      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 -z-10 h-[500px] w-[500px] rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-32 -z-10 h-[480px] w-[480px] rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-500/10"
      />

      <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-white/60 px-4 py-1.5 text-xs font-medium text-rose-700 backdrop-blur-sm dark:border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-300"
        >
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
          Phòng khám & cửa hàng thú cưng cao cấp
        </motion.div>

        {/* Animated title */}
        <h1
          ref={titleRef}
          className="mx-auto max-w-4xl text-4xl leading-[1.1] font-bold tracking-tight text-zinc-900 md:text-6xl lg:text-7xl dark:text-white"
        >
          {titleParts.map((part, partIdx) => (
            <span key={partIdx}>
              {part.text.split('').map((char, charIdx) => (
                <span
                  key={`${partIdx}-${charIdx}`}
                  data-char
                  className={
                    part.color === 'gradient'
                      ? 'inline-block bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent'
                      : 'inline-block opacity-0'
                  }
                  style={part.color === 'gradient' ? { opacity: 0 } : undefined}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-base text-zinc-600 md:text-lg dark:text-zinc-400"
        >
          Đặt lịch khám thú y, chăm sóc spa, mua thức ăn - đồ chơi - cát vệ sinh chất lượng cao cho
          chó mèo. Tất cả trong một ứng dụng tiện lợi.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="group h-12 w-full bg-gradient-to-br from-rose-500 to-amber-500 px-6 text-white shadow-lg shadow-rose-500/30 transition hover:shadow-xl hover:shadow-rose-500/40 sm:w-auto"
          >
            <Link href="/shop">
              Khám phá cửa hàng
              <ArrowRight
                className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5"
                strokeWidth={2.4}
              />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-full border-zinc-300/80 px-6 backdrop-blur-sm sm:w-auto dark:border-zinc-700/80"
          >
            <Link href="/register">
              <CalendarHeart className="h-4 w-4" strokeWidth={2.2} />
              Đặt lịch khám ngay
            </Link>
          </Button>
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-500"
        >
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.4} />
            Bác sĩ chứng chỉ hành nghề
          </span>
          <span className="hidden sm:inline">·</span>
          <span>Hơn 1.000 sản phẩm chính hãng</span>
          <span className="hidden sm:inline">·</span>
          <span>Hỗ trợ 24/7</span>
        </motion.div>
      </div>
    </section>
  );
}
