'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import {
  CalendarCheck,
  Check,
  Clock3,
  FileHeart,
  HeartPulse,
  PawPrint,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export interface ClinicJourneySceneProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

interface ClinicStepData {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  start: number;
  end: number;
}

interface ClinicStepProps {
  step: ClinicStepData;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  children: React.ReactNode;
}

const CLINIC_STEPS: readonly ClinicStepData[] = [
  {
    number: '01',
    eyebrow: 'Khung giờ phù hợp',
    title: 'Chọn lịch còn trống.',
    description: 'Các khung giờ được tính theo thời lượng dịch vụ và lịch đã xác nhận.',
    icon: Clock3,
    start: 0,
    end: 0.31,
  },
  {
    number: '02',
    eyebrow: 'Appointment confirmed',
    title: 'Lịch khám được xác nhận.',
    description: 'Thông tin thú cưng, dịch vụ và thời gian cùng nằm trong một lịch hẹn.',
    icon: CalendarCheck,
    start: 0.2,
    end: 0.56,
  },
  {
    number: '03',
    eyebrow: 'Doctor examination',
    title: 'Bác sĩ tiếp nhận ca khám.',
    description: 'Triệu chứng, cân nặng và chẩn đoán được ghi nhận trong đúng hồ sơ.',
    icon: Stethoscope,
    start: 0.46,
    end: 0.8,
  },
  {
    number: '04',
    eyebrow: 'Medical result',
    title: 'Kết quả trở thành lịch sử.',
    description: 'Phiếu khám hoàn tất được chuyển tiếp vào hồ sơ sức khỏe lâu dài.',
    icon: FileHeart,
    start: 0.7,
    end: 1,
  },
];

function ClinicStep({ step, progress, reducedMotion, children }: ClinicStepProps) {
  const duration = step.end - step.start;
  const enterEnd = step.start + duration * 0.22;
  const exitStart = step.end - duration * 0.18;
  const persists = step.end === 1;

  const opacity = useTransform(
    progress,
    [step.start, enterEnd, exitStart, step.end],
    [0, 1, 1, persists ? 1 : 0]
  );

  const y = useTransform(
    progress,
    [step.start, enterEnd, exitStart, step.end],
    [50, 0, 0, persists ? 0 : -35]
  );

  const scale = useTransform(progress, [step.start, enterEnd], [0.92, 1]);

  const Icon = step.icon;

  return (
    <motion.article
      style={{
        opacity,
        y: reducedMotion ? 0 : y,
        scale: reducedMotion ? 1 : scale,
      }}
      className="relative w-[82vw] max-w-[920px] shrink-0 snap-center"
    >
      <div className="overflow-hidden rounded-[2.5rem] border border-rose-200/80 bg-white/90 shadow-[0_32px_100px_-48px_rgba(244,63,94,0.65)] backdrop-blur-2xl">
        <div className="grid min-h-[470px] lg:grid-cols-[0.72fr_1.28fr]">
          <div className="relative flex flex-col justify-between border-b border-rose-100 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <span className="text-7xl font-black tracking-[-0.08em] text-rose-100">
              {step.number}
            </span>

            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/25">
                <Icon className="size-6" />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
                {step.eyebrow}
              </p>

              <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.04em] text-zinc-900 sm:text-3xl">
                {step.title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600">{step.description}</p>
            </div>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden p-5 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.09),transparent_65%)]" />
            <div className="relative w-full">{children}</div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function SlotPicker() {
  const slots = ['08:00', '09:30', '10:45', '13:30', '15:00', '16:15'];

  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-rose-100 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Thứ sáu</p>
          <p className="mt-1 text-lg font-bold text-zinc-900">21 tháng 8</p>
        </div>

        <CalendarCheck className="size-7 text-rose-500" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {slots.map((slot, index) => (
          <div
            key={slot}
            className={[
              'rounded-xl border px-3 py-3 text-center text-sm font-semibold',
              index === 3
                ? 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'border-rose-100 bg-rose-50/60 text-zinc-700',
            ].join(' ')}
          >
            {slot}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-zinc-50 p-4">
        <Clock3 className="size-5 text-rose-500" />
        <div>
          <p className="text-sm font-semibold text-zinc-900">Khám tổng quát</p>
          <p className="text-xs text-zinc-500">30 phút</p>
        </div>
      </div>
    </div>
  );
}

function AppointmentConfirmation() {
  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-[2rem] border border-rose-100 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <PawPrint className="size-7" />
          </div>

          <div className="flex-1">
            <p className="font-bold text-zinc-900">Miso</p>
            <p className="text-sm text-zinc-500">Mèo • 3 tuổi</p>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            CONFIRMED
          </span>
        </div>

        <div className="my-5 h-px bg-rose-100" />

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-400">Thời gian</dt>
            <dd className="mt-1 font-semibold text-zinc-900">13:30 – 14:00</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-400">Dịch vụ</dt>
            <dd className="mt-1 font-semibold text-zinc-900">Khám tổng quát</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          <Check className="size-5" />
          Lịch khám đã được xác nhận
        </div>
      </div>
    </div>
  );
}

function DoctorExamination() {
  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-rose-100 bg-white p-5 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-900 text-white">
          <UserRound className="size-7" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Bác sĩ phụ trách
          </p>
          <p className="mt-1 font-bold text-zinc-900">Hồ sơ khám hiện tại</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Triệu chứng</p>
          <p className="mt-2 text-sm font-medium text-zinc-800">Giảm ăn, mệt nhẹ trong hai ngày</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <p className="text-xs text-zinc-500">Cân nặng</p>
            <p className="mt-1 text-xl font-black text-zinc-900">4,2 kg</p>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
            <p className="text-xs text-zinc-500">Trạng thái</p>
            <p className="mt-1 font-bold text-pink-700">Đang khám</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicalResult() {
  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-rose-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-white">
            <FileHeart className="size-6" />
          </div>

          <div>
            <p className="font-bold text-zinc-900">Phiếu khám</p>
            <p className="text-xs text-zinc-500">Đã lưu vào hồ sơ</p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          COMPLETED
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-5">
        <div className="flex items-center gap-2 text-rose-600">
          <HeartPulse className="size-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Kết quả</span>
        </div>

        <p className="mt-3 text-lg font-bold text-zinc-900">Theo dõi tiêu hóa</p>

        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Chẩn đoán và hướng điều trị được giữ trong lịch sử sức khỏe của Miso.
        </p>
      </div>
    </div>
  );
}

export function ClinicJourneyScene({ progress, reducedMotion }: ClinicJourneySceneProps) {
  const trackX = useTransform(
    progress,
    [0, 0.27, 0.52, 0.76, 1],
    reducedMotion ? ['0%', '0%', '0%', '0%', '0%'] : ['4%', '-25%', '-54%', '-83%', '-108%']
  );

  const headingOpacity = useTransform(progress, [0, 0.08, 0.78, 0.94], [0, 1, 1, 0]);

  const headingY = useTransform(progress, [0, 0.12, 0.82, 1], [30, 0, 0, -30]);

  const routeLength = useTransform(progress, [0.04, 0.94], [0, 1]);

  const handoffOpacity = useTransform(progress, [0.86, 1], [0, 1]);

  return (
    <section
      id="clinic-journey"
      aria-labelledby="clinic-journey-title"
      className="relative flex min-h-svh items-center overflow-hidden py-12"
    >
      <motion.header
        style={{
          opacity: headingOpacity,
          y: reducedMotion ? 0 : headingY,
        }}
        className="absolute left-5 top-8 z-30 max-w-xl sm:left-8 lg:left-14"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Clinic Journey</p>

        <h2
          id="clinic-journey-title"
          className="mt-2 text-[clamp(2rem,3.8vw,4.1rem)] font-black leading-[0.96] tracking-[-0.055em] text-zinc-900"
        >
          Từ một khung giờ
          <span className="block text-rose-500">đến kết quả điều trị.</span>
        </h2>
      </motion.header>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[12%] h-44 w-full"
      >
        <path
          d="M0 115 C300 45 520 150 760 90 C1010 28 1160 125 1440 55"
          fill="none"
          stroke="#FFE4E6"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.path
          d="M0 115 C300 45 520 150 760 90 C1010 28 1160 125 1440 55"
          fill="none"
          stroke="#F43F5E"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ pathLength: routeLength }}
        />
      </svg>

      <motion.div
        style={{ x: trackX }}
        className="relative z-20 flex w-max items-center gap-[8vw] pl-[8vw] pt-28"
      >
        <ClinicStep step={CLINIC_STEPS[0]} progress={progress} reducedMotion={reducedMotion}>
          <SlotPicker />
        </ClinicStep>

        <ClinicStep step={CLINIC_STEPS[1]} progress={progress} reducedMotion={reducedMotion}>
          <AppointmentConfirmation />
        </ClinicStep>

        <ClinicStep step={CLINIC_STEPS[2]} progress={progress} reducedMotion={reducedMotion}>
          <DoctorExamination />
        </ClinicStep>

        <ClinicStep step={CLINIC_STEPS[3]} progress={progress} reducedMotion={reducedMotion}>
          <MedicalResult />
        </ClinicStep>
      </motion.div>

      <motion.div
        style={{ opacity: handoffOpacity }}
        className="absolute bottom-6 right-6 z-30 rounded-full border border-amber-200 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 shadow-lg backdrop-blur"
      >
        Tiếp theo: Shop Journey
      </motion.div>
    </section>
  );
}
