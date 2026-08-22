'use client';

import Link from 'next/link';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Bone,
  CalendarHeart,
  Cat,
  Dog,
  HeartPulse,
  PawPrint,
  ShoppingBag,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

export interface HeroGatewaySceneProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

interface PetActorProps {
  type: 'dog' | 'cat';
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

function PetActor({ type, progress, reducedMotion }: PetActorProps) {
  const isDog = type === 'dog';

  const x = useTransform(progress, [0, 0.7, 1], isDog ? [0, 16, 48] : [0, -16, -48]);

  const y = useTransform(progress, [0, 0.7, 1], [0, -12, 8]);

  const rotate = useTransform(progress, [0, 1], isDog ? [0, 5] : [0, -5]);

  const opacity = useTransform(progress, [0, 0.82, 1], [1, 1, 0]);

  const scale = useTransform(progress, [0, 0.7, 1], [1, 1.04, 0.92]);

  const Icon = isDog ? Dog : Cat;

  return (
    <motion.div
      style={{
        x: reducedMotion ? 0 : x,
        y: reducedMotion ? 0 : y,
        rotate: reducedMotion ? 0 : rotate,
        scale: reducedMotion ? 1 : scale,
        opacity,
      }}
      className={[
        'relative flex size-32 items-center justify-center',
        'rounded-[2.5rem] border bg-white/90 shadow-2xl',
        'backdrop-blur-xl sm:size-40 lg:size-48',
        isDog ? 'border-rose-200 shadow-rose-300/35' : 'border-amber-200 shadow-amber-300/35',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-3 rounded-[2rem]',
          isDog
            ? 'bg-gradient-to-br from-rose-100 to-pink-50'
            : 'bg-gradient-to-br from-amber-100 to-rose-50',
        ].join(' ')}
      />

      <Icon
        className={[
          'relative size-16 stroke-[1.5] sm:size-20 lg:size-24',
          isDog ? 'text-rose-500' : 'text-amber-500',
        ].join(' ')}
      />

      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                y: [0, -7, 0],
                rotate: [0, isDog ? 8 : -8, 0],
              }
        }
        transition={{
          duration: isDog ? 2.8 : 3.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        className={[
          'absolute -top-4 flex size-10 items-center justify-center',
          'rounded-2xl border border-white bg-white shadow-lg',
          isDog ? '-right-3 text-rose-500' : '-left-3 text-amber-500',
        ].join(' ')}
      >
        {isDog ? <HeartPulse className="size-5" /> : <Sparkles className="size-5" />}
      </motion.span>
    </motion.div>
  );
}

export function HeroGatewayScene({ progress, reducedMotion }: HeroGatewaySceneProps) {
  const copyOpacity = useTransform(progress, [0, 0.82, 1], [1, 1, 0]);
  const copyY = useTransform(progress, [0, 0.82, 1], [0, 0, -40]);
  const visualScale = useTransform(
    progress,
    [0, 0.5, 1],
    reducedMotion ? [1, 1, 1] : [0.82, 1, 1.1]
  );

  const visualRotate = useTransform(progress, [0, 0.5, 1], reducedMotion ? [0, 0, 0] : [-5, 0, 5]);

  const portalRotation = useTransform(progress, [0, 1], reducedMotion ? [0, 0] : [-18, 28]);

  const portalScale = useTransform(
    progress,
    [0, 0.45, 1],
    reducedMotion ? [1, 1, 1] : [0.65, 1, 1.18]
  );

  const routeLength = useTransform(progress, [0.25, 0.88], [0, 1], { clamp: true });

  const exitOpacity = useTransform(progress, [0.82, 1], [1, 0]);

  return (
    <section
      id="hero-gateway"
      aria-labelledby="hero-gateway-title"
      className="relative flex min-h-svh items-center overflow-hidden px-5 py-20 sm:px-8 lg:px-14"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.div
          style={{
            opacity: copyOpacity,
            y: reducedMotion ? 0 : copyY,
          }}
          className="relative z-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-600 shadow-sm backdrop-blur">
            <PawPrint className="size-4" />
            PetCare Journey
          </div>

          <h1
            id="hero-gateway-title"
            className="mt-6 max-w-[11ch] text-[clamp(2.5rem,5.7vw,5.8rem)] font-black leading-[0.94] tracking-[-0.065em] text-zinc-900"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block">Trọn hành trình</span>
            </span>

            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                khỏe mạnh
              </span>
            </span>

            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block">của thú cưng.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-zinc-600 sm:text-lg">
            Phòng khám, cửa hàng và hồ sơ sức khỏe cùng chuyển động trong một trải nghiệm PetCare
            thống nhất.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#problem-portal"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              Bắt đầu hành trình
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" />
            </a>

            <Link
              href="/booking"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-rose-200 bg-white/85 px-6 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              Đặt lịch ngay
              <ArrowRight className="size-4 text-rose-500 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          style={{
            opacity: exitOpacity,
            scale: visualScale,
            rotate: visualRotate,
          }}
          className="relative z-10 mx-auto aspect-square w-full max-w-[680px]"
        >
          <motion.div
            aria-hidden="true"
            style={{
              rotate: portalRotation,
              scale: portalScale,
            }}
            className="absolute inset-[8%] rounded-full border border-rose-300/60"
          >
            <div className="absolute inset-[9%] rounded-full border border-dashed border-pink-300/70" />
            <div className="absolute inset-[20%] rounded-full bg-white/45 shadow-[inset_0_0_80px_rgba(244,63,94,0.14)] backdrop-blur-sm" />

            <Stethoscope className="absolute left-[2%] top-[42%] size-8 -rotate-12 text-rose-400" />
            <ShoppingBag className="absolute right-[5%] top-[25%] size-8 rotate-12 text-amber-500" />
            <Bone className="absolute bottom-[9%] left-[30%] size-7 rotate-12 text-pink-400" />
            <CalendarHeart className="absolute right-[22%] top-[2%] size-7 text-rose-500" />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center gap-5 sm:gap-8">
            <PetActor type="dog" progress={progress} reducedMotion={reducedMotion} />
            <PetActor type="cat" progress={progress} reducedMotion={reducedMotion} />
          </div>

          <svg aria-hidden="true" viewBox="0 0 680 680" className="absolute inset-0 size-full">
            <path
              d="M65 580 C185 520 185 395 325 420 C470 445 480 310 620 255"
              fill="none"
              stroke="#FFE4E6"
              strokeWidth="10"
              strokeLinecap="round"
            />

            <motion.path
              d="M65 580 C185 520 185 395 325 420 C470 445 480 310 620 255"
              fill="none"
              stroke="#F43F5E"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ pathLength: routeLength }}
            />
          </svg>

          <motion.div
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [0, -10, 0],
                    rotate: [-3, 3, -3],
                  }
            }
            transition={{
              duration: 3.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="absolute bottom-[7%] right-[5%] rounded-2xl border border-rose-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-500">
              Một hồ sơ
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">Toàn bộ hành trình</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
