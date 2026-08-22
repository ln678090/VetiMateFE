'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import {
  Bone,
  CalendarClock,
  Cat,
  Dog,
  FileHeart,
  PackageSearch,
  ShoppingBasket,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

export interface ProblemPortalSceneProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

interface ChoiceItem {
  label: string;
  detail: string;
  branch: 'clinic' | 'shop';
  icon: LucideIcon;
}

interface ChoiceNodeProps {
  item: ChoiceItem;
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

const CHOICES: readonly ChoiceItem[] = [
  {
    label: 'Chọn khung giờ',
    detail: 'Lịch nào còn trống?',
    branch: 'clinic',
    icon: CalendarClock,
  },
  {
    label: 'Tìm bác sĩ',
    detail: 'Ai phù hợp với ca khám?',
    branch: 'clinic',
    icon: Stethoscope,
  },
  {
    label: 'Giữ lịch sử',
    detail: 'Kết quả cũ đang ở đâu?',
    branch: 'clinic',
    icon: FileHeart,
  },
  {
    label: 'Chọn thức ăn',
    detail: 'Sản phẩm nào phù hợp?',
    branch: 'shop',
    icon: Bone,
  },
  {
    label: 'Kiểm tra nguồn gốc',
    detail: 'Thông tin có minh bạch?',
    branch: 'shop',
    icon: PackageSearch,
  },
  {
    label: 'Theo dõi mua sắm',
    detail: 'Đơn hàng đã tới đâu?',
    branch: 'shop',
    icon: ShoppingBasket,
  },
];

const SCATTER_OFFSETS = [
  { x: -190, y: -145, rotate: -15 },
  { x: 95, y: -190, rotate: 12 },
  { x: -110, y: 155, rotate: 9 },
  { x: 175, y: -125, rotate: 14 },
  { x: -145, y: 185, rotate: -11 },
  { x: 145, y: 150, rotate: 16 },
] as const;

function ChoiceNode({ item, index, progress, reducedMotion }: ChoiceNodeProps) {
  const offset = SCATTER_OFFSETS[index];
  const Icon = item.icon;

  const x = useTransform(progress, [0, 0.18, 0.68, 1], [offset.x, offset.x, 0, 0]);

  const y = useTransform(progress, [0, 0.18, 0.68, 1], [offset.y, offset.y, 0, 0]);

  const rotate = useTransform(progress, [0, 0.25, 0.68, 1], [offset.rotate, offset.rotate, 0, 0]);

  const scale = useTransform(progress, [0, 0.12, 0.68, 1], [0.72, 0.84, 1, 1]);

  const opacity = useTransform(progress, [0, 0.1, 0.25, 1], [0, 1, 1, 1]);

  return (
    <motion.article
      style={{
        x: reducedMotion ? 0 : x,
        y: reducedMotion ? 0 : y,
        rotate: reducedMotion ? 0 : rotate,
        scale: reducedMotion ? 1 : scale,
        opacity,
      }}
      className={[
        'relative flex items-center gap-3 rounded-2xl border',
        'bg-white/90 p-3 shadow-xl backdrop-blur-xl sm:p-4',
        item.branch === 'clinic'
          ? 'border-rose-200 shadow-rose-200/30'
          : 'border-amber-200 shadow-amber-200/30',
      ].join(' ')}
    >
      <div
        className={[
          'flex size-10 shrink-0 items-center justify-center rounded-xl',
          item.branch === 'clinic' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-600',
        ].join(' ')}
      >
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-bold text-zinc-900">{item.label}</h3>
        <p className="mt-0.5 truncate text-xs text-zinc-500">{item.detail}</p>
      </div>
    </motion.article>
  );
}

export function ProblemPortalScene({ progress, reducedMotion }: ProblemPortalSceneProps) {
  const clinicChoices = CHOICES.filter((item) => item.branch === 'clinic');
  const shopChoices = CHOICES.filter((item) => item.branch === 'shop');

  const copyOpacity = useTransform(progress, [0, 0.08, 0.46, 0.66], [0, 1, 1, 0]);

  const copyX = useTransform(progress, [0, 0.18, 0.58, 0.72], [-48, 0, 0, -80]);

  const portalScale = useTransform(progress, [0, 0.22, 0.58, 1], [0.55, 0.75, 1, 1.18]);

  const portalRotate = useTransform(
    progress,
    [0, 0.5, 1],
    reducedMotion ? [0, 0, 0] : [-24, 0, 26]
  );

  const clinicPathLength = useTransform(progress, [0.5, 0.82], [0, 1], { clamp: true });

  const shopPathLength = useTransform(progress, [0.56, 0.88], [0, 1], { clamp: true });

  const branchLabelsOpacity = useTransform(progress, [0.55, 0.7], [0, 1], { clamp: true });

  const branchLabelsY = useTransform(progress, [0.55, 0.7], [20, 0], { clamp: true });

  const dogX = useTransform(progress, [0, 0.55, 1], reducedMotion ? [0, 0, 0] : [60, 0, -60]);

  const catX = useTransform(progress, [0, 0.55, 1], reducedMotion ? [0, 0, 0] : [-60, 0, 60]);

  const petScale = useTransform(progress, [0, 0.58, 1], [0.75, 1, 0.88]);

  return (
    <section
      id="problem-portal"
      aria-labelledby="problem-portal-title"
      className="relative flex min-h-svh items-center overflow-hidden px-5 py-16 sm:px-8 lg:px-14"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <motion.div
          style={{
            opacity: copyOpacity,
            x: reducedMotion ? 0 : copyX,
          }}
          className="relative z-30 max-w-lg"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
            Mọi thứ từng rời rạc
          </p>

          <h2
            id="problem-portal-title"
            className="mt-4 text-[clamp(2.2rem,4.4vw,4.8rem)] font-black leading-[0.96] tracking-[-0.055em] text-zinc-900"
          >
            Quá nhiều lựa chọn.
            <span className="mt-1 block text-rose-500">Quá ít kết nối.</span>
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-zinc-600">
            Lịch khám, hồ sơ sức khỏe và sản phẩm phù hợp không nên nằm trong những hành trình tách
            biệt.
          </p>
        </motion.div>

        <div className="relative min-h-[580px] lg:min-h-[680px]">
          <motion.div
            aria-hidden="true"
            style={{
              rotate: portalRotate,
              scale: reducedMotion ? 1 : portalScale,
            }}
            className="absolute left-1/2 top-1/2 size-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-300/70 sm:size-[410px]"
          >
            <div className="absolute inset-[9%] rounded-full border border-dashed border-pink-300/75" />
            <div className="absolute inset-[20%] rounded-full border border-amber-200/80 bg-white/35 shadow-[inset_0_0_90px_rgba(244,63,94,0.15)] backdrop-blur-sm" />
          </motion.div>

          <svg
            aria-hidden="true"
            viewBox="0 0 800 680"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            <path
              d="M405 345 C310 370 235 435 75 555"
              fill="none"
              stroke="#FFE4E6"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <motion.path
              d="M405 345 C310 370 235 435 75 555"
              fill="none"
              stroke="#F43F5E"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ pathLength: clinicPathLength }}
            />

            <path
              d="M405 345 C500 300 580 205 760 105"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <motion.path
              d="M405 345 C500 300 580 205 760 105"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ pathLength: shopPathLength }}
            />
          </svg>

          <motion.div
            style={{
              scale: reducedMotion ? 1 : petScale,
            }}
            className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 gap-3"
          >
            <motion.div
              style={{ x: dogX }}
              className="flex size-20 items-center justify-center rounded-[1.6rem] border border-rose-200 bg-white/95 text-rose-500 shadow-xl shadow-rose-200/40 sm:size-24"
            >
              <Dog className="size-11" />
            </motion.div>

            <motion.div
              style={{ x: catX }}
              className="flex size-20 items-center justify-center rounded-[1.6rem] border border-amber-200 bg-white/95 text-amber-500 shadow-xl shadow-amber-200/40 sm:size-24"
            >
              <Cat className="size-11" />
            </motion.div>
          </motion.div>

          <div className="absolute inset-y-[5%] left-0 z-10 grid w-[46%] content-center gap-3">
            {clinicChoices.map((item, index) => (
              <ChoiceNode
                key={item.label}
                item={item}
                index={index}
                progress={progress}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

          <div className="absolute inset-y-[5%] right-0 z-10 grid w-[46%] content-center gap-3">
            {shopChoices.map((item, index) => (
              <ChoiceNode
                key={item.label}
                item={item}
                index={index + clinicChoices.length}
                progress={progress}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

          <motion.div
            style={{
              opacity: branchLabelsOpacity,
              y: reducedMotion ? 0 : branchLabelsY,
            }}
            className="absolute inset-x-0 bottom-2 z-30 flex justify-between px-2 sm:px-8"
          >
            <div className="rounded-full border border-rose-200 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-600 shadow-sm backdrop-blur">
              Clinic Journey
            </div>

            <div className="rounded-full border border-amber-200 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 shadow-sm backdrop-blur">
              Shop Journey
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
