'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import {
  ArrowRight,
  CalendarHeart,
  Cat,
  Dog,
  HeartPulse,
  History,
  PawPrint,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

export interface TrustProofFinaleSceneProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

interface ProofMetricProps {
  progress: MotionValue<number>;
  start: number;
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface OwnerNeedProps {
  progress: MotionValue<number>;
  start: number;
  children: ReactNode;
}

function ProofMetric({ progress, start, value, label, icon: Icon }: ProofMetricProps) {
  const opacity = useTransform(progress, [start, start + 0.07, 0.54, 0.64], [0, 1, 1, 0]);

  const y = useTransform(progress, [start, start + 0.07, 0.54, 0.64], [32, 0, 0, -24]);

  const scale = useTransform(progress, [start, start + 0.07, 0.54, 0.64], [0.8, 1, 1, 0.9]);

  return (
    <motion.article
      style={{ opacity, y, scale }}
      className="rounded-[1.75rem] border border-rose-100 bg-white/90 p-5 shadow-xl shadow-rose-200/25 backdrop-blur-xl"
    >
      <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
        <Icon className="size-5" />
      </div>

      <p className="mt-5 text-4xl font-black tracking-[-0.06em] text-zinc-900">{value}</p>

      <p className="mt-2 text-sm leading-6 text-zinc-600">{label}</p>
    </motion.article>
  );
}

function OwnerNeed({ progress, start, children }: OwnerNeedProps) {
  const opacity = useTransform(progress, [start, start + 0.06, 0.54, 0.63], [0, 1, 1, 0]);

  const x = useTransform(progress, [start, start + 0.06, 0.54, 0.63], [30, 0, 0, -20]);

  return (
    <motion.li
      style={{ opacity, x }}
      className="flex items-start gap-3 rounded-2xl border border-pink-100 bg-white/75 p-4 backdrop-blur"
    >
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-pink-500" />

      <p className="text-sm font-medium leading-6 text-zinc-700">{children}</p>
    </motion.li>
  );
}

export function TrustProofFinaleScene({ progress, reducedMotion }: TrustProofFinaleSceneProps) {
  const proofOpacity = useTransform(progress, [0, 0.06, 0.54, 0.66], [0, 1, 1, 0]);

  const proofScale = useTransform(
    progress,
    [0, 0.18, 0.58, 0.68],
    reducedMotion ? [1, 1, 1, 1] : [0.92, 1, 1, 0.82]
  );

  const finaleOpacity = useTransform(progress, [0.58, 0.7, 1], [0, 1, 1]);

  const finaleScale = useTransform(
    progress,
    [0.58, 0.76, 1],
    reducedMotion ? [1, 1, 1] : [0.68, 1, 1.04]
  );

  const finaleY = useTransform(progress, [0.58, 0.76, 1], reducedMotion ? [0, 0, 0] : [80, 0, -12]);

  const portalRotation = useTransform(progress, [0.58, 1], reducedMotion ? [0, 0] : [-25, 24]);

  const portalScale = useTransform(
    progress,
    [0.58, 0.76, 1],
    reducedMotion ? [1, 1, 1] : [0.45, 1, 1.15]
  );

  const routeLength = useTransform(progress, [0.52, 0.9], [0, 1], { clamp: true });

  const dogX = useTransform(progress, [0.62, 0.78, 1], reducedMotion ? [0, 0, 0] : [-220, 0, 28]);

  const catX = useTransform(progress, [0.62, 0.78, 1], reducedMotion ? [0, 0, 0] : [220, 0, -28]);

  const petOpacity = useTransform(progress, [0.62, 0.72], [0, 1]);

  const ctaOpacity = useTransform(progress, [0.76, 0.87], [0, 1]);

  const ctaY = useTransform(progress, [0.76, 0.87], [28, 0]);

  return (
    <section
      id="trust-proof-finale"
      aria-labelledby="trust-proof-title"
      className="relative min-h-svh overflow-hidden px-5 py-16 sm:px-8 lg:px-14"
    >
      <motion.div
        style={{
          opacity: proofOpacity,
          scale: proofScale,
        }}
        className="relative z-20 mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[0.78fr_1.22fr]"
      >
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
            Một nền tảng thống nhất
          </p>

          <h2
            id="trust-proof-title"
            className="mt-3 text-[clamp(2.1rem,4vw,4.4rem)] font-black leading-[0.96] tracking-[-0.055em] text-zinc-900"
          >
            Ít thao tác hơn.
            <span className="block text-rose-500">Nhiều kết nối hơn.</span>
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-zinc-600">
            PetCare kết nối những năng lực đang có trong hệ thống, không dựa trên số liệu khách hàng
            hoặc đánh giá giả.
          </p>

          <ul className="mt-6 space-y-3">
            <OwnerNeed progress={progress} start={0.12}>
              Chủ nuôi cần tìm lịch khám và thông tin sức khỏe trong cùng một hành trình.
            </OwnerNeed>

            <OwnerNeed progress={progress} start={0.18}>
              Mỗi lần khám cần được lưu như một sự kiện riêng, không ghi đè lịch sử cũ.
            </OwnerNeed>

            <OwnerNeed progress={progress} start={0.24}>
              Sản phẩm cần được phân loại rõ ràng cho chó và mèo.
            </OwnerNeed>
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ProofMetric
            progress={progress}
            start={0.08}
            value="1"
            label="Nền tảng kết nối toàn bộ hành trình PetCare."
            icon={PawPrint}
          />

          <ProofMetric
            progress={progress}
            start={0.14}
            value="3"
            label="Trụ cột: phòng khám, cửa hàng và hồ sơ sức khỏe."
            icon={HeartPulse}
          />

          <ProofMetric
            progress={progress}
            start={0.2}
            value="2"
            label="Loài được hỗ trợ trong phạm vi hiện tại: chó và mèo."
            icon={Cat}
          />

          <ProofMetric
            progress={progress}
            start={0.26}
            value="∞"
            label="Các sự kiện lịch sử được giữ tách biệt theo thời gian."
            icon={History}
          />
        </div>
      </motion.div>

      <motion.div
        style={{
          opacity: finaleOpacity,
          scale: finaleScale,
          y: finaleY,
        }}
        className="absolute inset-0 z-30 flex items-center justify-center px-5 py-12"
      >
        <motion.div
          aria-hidden="true"
          style={{
            rotate: portalRotation,
            scale: portalScale,
          }}
          className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-300/70 sm:size-[620px]"
        >
          <div className="absolute inset-[8%] rounded-full border border-dashed border-pink-300/70" />
          <div className="absolute inset-[18%] rounded-full border border-amber-200/70 bg-white/30 shadow-[inset_0_0_120px_rgba(244,63,94,0.18)] backdrop-blur" />
        </motion.div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1200 720"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <path
            d="M-80 570 C210 590 310 350 590 365 C865 380 920 130 1280 170"
            fill="none"
            stroke="#FFE4E6"
            strokeWidth="14"
            strokeLinecap="round"
          />

          <motion.path
            d="M-80 570 C210 590 310 350 590 365 C865 380 920 130 1280 170"
            fill="none"
            stroke="url(#finale-route)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ pathLength: routeLength }}
          />

          <defs>
            <linearGradient id="finale-route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="55%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>

        <motion.div
          style={{ opacity: petOpacity }}
          className="absolute left-1/2 top-[22%] flex -translate-x-1/2 gap-4"
        >
          <motion.div
            style={{ x: dogX }}
            className="flex size-20 items-center justify-center rounded-[1.6rem] border border-rose-200 bg-white/95 text-rose-500 shadow-xl shadow-rose-300/30 sm:size-24"
          >
            <Dog className="size-12" />
          </motion.div>

          <motion.div
            style={{ x: catX }}
            className="flex size-20 items-center justify-center rounded-[1.6rem] border border-amber-200 bg-white/95 text-amber-500 shadow-xl shadow-amber-300/30 sm:size-24"
          >
            <Cat className="size-12" />
          </motion.div>
        </motion.div>

        <div className="relative z-20 mx-auto max-w-3xl pt-32 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30">
            <Sparkles className="size-7" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
            Bắt đầu hành trình
          </p>

          <h2 className="mx-auto mt-3 max-w-[14ch] text-[clamp(2.3rem,5vw,5.4rem)] font-black leading-[0.94] tracking-[-0.06em] text-zinc-900">
            Chăm sóc tốt hơn bắt đầu từ hôm nay.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-600">
            Đặt lịch chăm sóc hoặc khám phá sản phẩm phù hợp cho thú cưng của bạn.
          </p>

          <motion.div
            style={{
              opacity: ctaOpacity,
              y: reducedMotion ? 0 : ctaY,
            }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/booking"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose-500 px-7 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              <CalendarHeart className="size-5" />
              Đặt lịch chăm sóc
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/shop"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-rose-200 bg-white/90 px-7 text-sm font-bold text-zinc-900 shadow-lg shadow-rose-200/30 backdrop-blur transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              <ShoppingBag className="size-5 text-rose-500" />
              Khám phá cửa hàng
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="mt-7 flex flex-wrap justify-center gap-4 text-xs font-semibold text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope className="size-4 text-rose-500" />
              Phòng khám
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShoppingBag className="size-4 text-amber-500" />
              Cửa hàng
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HeartPulse className="size-4 text-pink-500" />
              Hồ sơ sức khỏe
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
