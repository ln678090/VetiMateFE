'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import {
  Cat,
  FileHeart,
  HeartPulse,
  PackageCheck,
  PawPrint,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

export interface HealthPassportSceneV4Props {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

type SharedSceneProps = HealthPassportSceneV4Props;

interface DataArtifactProps extends SharedSceneProps {
  kind: 'clinic' | 'shop';
}

interface TimelineEventProps {
  progress: MotionValue<number>;
  start: number;
  title: string;
  description: string;
}

function DataArtifact({ kind, progress, reducedMotion }: DataArtifactProps) {
  const isClinic = kind === 'clinic';

  const x = useTransform(
    progress,
    [0, 0.36, 0.5],
    reducedMotion ? [isClinic ? -110 : 110, 0, 0] : [isClinic ? -360 : 360, 0, 0]
  );

  const y = useTransform(progress, [0, 0.36, 0.5], [isClinic ? -100 : 110, 0, 0]);

  const rotate = useTransform(
    progress,
    [0, 0.4],
    reducedMotion ? [0, 0] : [isClinic ? -16 : 16, 0]
  );

  const scale = useTransform(progress, [0, 0.4, 0.56], [0.72, 1, 0.35]);

  const opacity = useTransform(progress, [0, 0.08, 0.42, 0.56], [0, 1, 1, 0]);

  const Icon = isClinic ? FileHeart : PackageCheck;

  return (
    <motion.article
      style={{
        x,
        y: reducedMotion ? 0 : y,
        rotate,
        scale,
        opacity,
      }}
      className={[
        'absolute left-1/2 top-1/2 z-20 w-56',
        '-translate-x-1/2 -translate-y-1/2 rounded-[2rem]',
        'border bg-white/95 p-5 shadow-2xl backdrop-blur-xl',
        isClinic ? 'border-rose-200 shadow-rose-300/35' : 'border-amber-200 shadow-amber-300/35',
      ].join(' ')}
    >
      <div
        className={[
          'flex size-12 items-center justify-center rounded-2xl text-white',
          isClinic ? 'bg-rose-500' : 'bg-amber-500',
        ].join(' ')}
      >
        <Icon className="size-6" />
      </div>

      <p
        className={[
          'mt-4 text-xs font-bold uppercase tracking-[0.16em]',
          isClinic ? 'text-rose-500' : 'text-amber-600',
        ].join(' ')}
      >
        {isClinic ? 'Medical record' : 'Order artifact'}
      </p>

      <h3 className="mt-2 font-bold text-zinc-900">
        {isClinic ? 'Kết quả khám' : 'Đơn hàng xác nhận'}
      </h3>

      <p className="mt-2 text-xs leading-5 text-zinc-500">
        {isClinic ? 'Chẩn đoán và trạng thái sức khỏe.' : 'Sản phẩm đã chọn cho thú cưng.'}
      </p>
    </motion.article>
  );
}

function TimelineEvent({ progress, start, title, description }: TimelineEventProps) {
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1], { clamp: true });

  const x = useTransform(progress, [start, start + 0.06], [24, 0], { clamp: true });

  const scale = useTransform(progress, [start, start + 0.05], [0.5, 1], { clamp: true });

  return (
    <motion.li style={{ opacity, x }} className="relative pl-8">
      <motion.span
        style={{ scale }}
        className="absolute left-0 top-1 flex size-4 items-center justify-center rounded-full bg-rose-500 ring-4 ring-rose-100"
      />

      <p className="text-sm font-bold text-zinc-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
    </motion.li>
  );
}

function HealthTimeline({ progress, reducedMotion }: SharedSceneProps) {
  const opacity = useTransform(progress, [0.7, 0.78], [0, 1], { clamp: true });

  const y = useTransform(progress, [0.7, 0.82], [35, 0], { clamp: true });

  const lineScale = useTransform(progress, [0.75, 0.98], [0, 1], { clamp: true });

  return (
    <motion.div
      style={{
        opacity,
        y: reducedMotion ? 0 : y,
      }}
      className="relative rounded-[2rem] border border-rose-100 bg-white/85 p-5 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
          <Stethoscope className="size-5" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-500">
            Health timeline
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            Mỗi lần khám là một sự kiện riêng
          </p>
        </div>
      </div>

      <div className="relative mt-6">
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute bottom-2 left-[7px] top-2 w-0.5 origin-top bg-gradient-to-b from-rose-500 via-pink-400 to-amber-400"
        />

        <ol className="space-y-6">
          <TimelineEvent
            progress={progress}
            start={0.78}
            title="Khám tổng quát"
            description="Thông tin dịch vụ và trạng thái hoàn thành được lưu lại."
          />

          <TimelineEvent
            progress={progress}
            start={0.85}
            title="Theo dõi tiêu hóa"
            description="Chẩn đoán và hướng chăm sóc trở thành một phần lịch sử."
          />

          <TimelineEvent
            progress={progress}
            start={0.92}
            title="Snapshot hiện tại"
            description="Trạng thái mới được cập nhật mà không ghi đè sự kiện cũ."
          />
        </ol>
      </div>
    </motion.div>
  );
}

function PetPassportCard({ progress, reducedMotion }: SharedSceneProps) {
  const opacity = useTransform(progress, [0.38, 0.5], [0, 1], { clamp: true });

  const scale = useTransform(progress, [0.38, 0.58], [0.62, 1], { clamp: true });

  const rotateY = useTransform(progress, [0.38, 0.58], reducedMotion ? [0, 0] : [18, 0]);

  const pulseScale = useTransform(progress, [0.4, 0.5, 0.6], [0.8, 1.08, 1]);

  return (
    <motion.article
      style={{
        opacity,
        scale: reducedMotion ? 1 : scale,
        rotateY,
      }}
      className="relative overflow-hidden rounded-[2.5rem] border border-pink-200 bg-white/95 p-5 shadow-[0_40px_110px_-48px_rgba(236,72,153,0.7)] backdrop-blur-2xl sm:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400" />

      <div className="flex items-center gap-4">
        <motion.div
          style={{
            scale: reducedMotion ? 1 : pulseScale,
          }}
          className="relative flex size-20 shrink-0 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-rose-100 via-pink-50 to-amber-100 text-rose-500"
        >
          <Cat className="size-11" />

          <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white">
            <ShieldCheck className="size-4" />
          </span>
        </motion.div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">
            Pet Health Passport
          </p>
          <h3 className="mt-1 text-3xl font-black tracking-[-0.04em] text-zinc-900">Miso</h3>
          <p className="mt-1 text-sm text-zinc-500">Mèo • Hồ sơ đang hoạt động</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/75 p-4">
          <div className="flex items-center gap-2 text-rose-600">
            <HeartPulse className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Snapshot</span>
          </div>

          <p className="mt-3 font-bold text-zinc-900">Đang theo dõi</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Trạng thái sức khỏe gần nhất.</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/75 p-4">
          <div className="flex items-center gap-2 text-amber-600">
            <PackageCheck className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">PetCare order</span>
          </div>

          <p className="mt-3 font-bold text-zinc-900">Đã xác nhận</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Hành trình mua sắm liên quan.</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
        <ShieldCheck className="size-4 shrink-0" />
        Lịch sử cũ được giữ nguyên khi snapshot mới cập nhật.
      </div>
    </motion.article>
  );
}

export function HealthPassportSceneV4({ progress, reducedMotion }: HealthPassportSceneV4Props) {
  const headingOpacity = useTransform(progress, [0, 0.08, 0.76, 0.92], [0, 1, 1, 0]);

  const headingY = useTransform(progress, [0, 0.12, 0.8, 1], [26, 0, 0, -25]);

  const portalScale = useTransform(
    progress,
    [0.1, 0.5, 1],
    reducedMotion ? [1, 1, 1] : [0.72, 1.08, 1]
  );

  const portalRotate = useTransform(progress, [0, 1], reducedMotion ? [0, 0] : [-12, 18]);

  const routeLength = useTransform(progress, [0.05, 0.58], [0, 1], { clamp: true });

  return (
    <section
      id="health-passport"
      aria-labelledby="health-passport-title"
      className="relative flex min-h-svh items-center overflow-hidden px-5 py-16 sm:px-8 lg:px-14"
    >
      <motion.header
        style={{
          opacity: headingOpacity,
          y: reducedMotion ? 0 : headingY,
        }}
        className="absolute left-5 top-8 z-30 max-w-xl sm:left-8 lg:left-14"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">
          Pet Health Passport
        </p>

        <h2
          id="health-passport-title"
          className="mt-2 text-[clamp(2rem,3.8vw,4.1rem)] font-black leading-[0.96] tracking-[-0.055em] text-zinc-900"
        >
          Mọi dữ liệu hội tụ
          <span className="block text-pink-500">về một hồ sơ.</span>
        </h2>
      </motion.header>

      <motion.div
        aria-hidden="true"
        style={{
          scale: portalScale,
          rotate: portalRotate,
        }}
        className="absolute left-1/2 top-1/2 size-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-200/70 sm:size-[600px]"
      >
        <div className="absolute inset-[10%] rounded-full border border-dashed border-rose-300/60" />
        <div className="absolute inset-[22%] rounded-full bg-white/30 shadow-[inset_0_0_100px_rgba(236,72,153,0.14)]" />
      </motion.div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1200 720"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <path
          d="M0 170 C320 160 360 350 600 360 C840 370 880 560 1200 550"
          fill="none"
          stroke="#FCE7F3"
          strokeWidth="13"
          strokeLinecap="round"
        />

        <motion.path
          d="M0 170 C320 160 360 350 600 360 C840 370 880 560 1200 550"
          fill="none"
          stroke="#EC4899"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ pathLength: routeLength }}
        />
      </svg>

      <DataArtifact kind="clinic" progress={progress} reducedMotion={reducedMotion} />

      <DataArtifact kind="shop" progress={progress} reducedMotion={reducedMotion} />

      <div className="relative z-20 mx-auto grid w-full max-w-5xl gap-5 pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <PetPassportCard progress={progress} reducedMotion={reducedMotion} />

        <HealthTimeline progress={progress} reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}
