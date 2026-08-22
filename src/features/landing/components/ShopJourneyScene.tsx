'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import {
  Bone,
  Box,
  Cat,
  Check,
  Dog,
  PackageCheck,
  PawPrint,
  ShoppingBasket,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export interface ShopJourneySceneProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

type SharedSceneProps = ShopJourneySceneProps;

interface CategoryItemProps extends SharedSceneProps {
  label: string;
  angle: number;
  icon: typeof Bone;
}

function CategoryItem({ label, angle, icon: Icon, progress, reducedMotion }: CategoryItemProps) {
  const radians = (angle * Math.PI) / 180;
  const destinationX = Math.cos(radians) * 190;
  const destinationY = Math.sin(radians) * 150;

  const x = useTransform(
    progress,
    [0, 0.3],
    reducedMotion ? [destinationX, destinationX] : [0, destinationX]
  );

  const y = useTransform(
    progress,
    [0, 0.3],
    reducedMotion ? [destinationY, destinationY] : [0, destinationY]
  );

  const opacity = useTransform(progress, [0, 0.08, 0.36, 0.46], [0, 1, 1, 0]);

  const scale = useTransform(progress, [0, 0.2, 0.4], [0.65, 1, 0.82]);

  return (
    <motion.div
      style={{ x, y, opacity, scale }}
      className="absolute left-1/2 top-1/2 -ml-16 -mt-10 flex w-32 flex-col items-center rounded-2xl border border-amber-200 bg-white/95 p-3 text-center shadow-xl shadow-amber-200/30"
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <Icon className="size-5" />
      </div>
      <span className="mt-2 text-xs font-bold text-zinc-800">{label}</span>
    </motion.div>
  );
}

function CategoryOrbit({ progress, reducedMotion }: SharedSceneProps) {
  const petScale = useTransform(progress, [0, 0.16, 0.42], [0.75, 1, 0.88]);

  const petOpacity = useTransform(progress, [0, 0.08, 0.4, 0.48], [0, 1, 1, 0]);

  const orbitRotation = useTransform(progress, [0, 0.44], reducedMotion ? [0, 0] : [-35, 28]);

  return (
    <motion.div style={{ opacity: petOpacity }} className="absolute inset-0">
      <motion.div
        style={{ rotate: orbitRotation }}
        className="absolute left-1/2 top-1/2 size-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-amber-300/80"
      />

      <CategoryItem
        label="Thức ăn"
        angle={-145}
        icon={Bone}
        progress={progress}
        reducedMotion={reducedMotion}
      />
      <CategoryItem
        label="Cát vệ sinh"
        angle={-35}
        icon={Sparkles}
        progress={progress}
        reducedMotion={reducedMotion}
      />
      <CategoryItem
        label="Đồ chơi"
        angle={45}
        icon={PawPrint}
        progress={progress}
        reducedMotion={reducedMotion}
      />
      <CategoryItem
        label="Phụ kiện"
        angle={145}
        icon={ShoppingBag}
        progress={progress}
        reducedMotion={reducedMotion}
      />

      <motion.div
        style={{
          opacity: petOpacity,
          scale: reducedMotion ? 1 : petScale,
        }}
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-3"
      >
        <div className="flex size-20 items-center justify-center rounded-[1.6rem] border border-rose-200 bg-white text-rose-500 shadow-xl">
          <Dog className="size-11" />
        </div>
        <div className="flex size-20 items-center justify-center rounded-[1.6rem] border border-amber-200 bg-white text-amber-500 shadow-xl">
          <Cat className="size-11" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductMatch({ progress, reducedMotion }: SharedSceneProps) {
  const opacity = useTransform(progress, [0.34, 0.43, 0.67, 0.75], [0, 1, 1, 0]);

  const scale = useTransform(progress, [0.34, 0.5, 0.72], [0.72, 1, 1.08]);

  const rotate = useTransform(progress, [0.34, 0.5], reducedMotion ? [0, 0] : [8, 0]);

  return (
    <motion.div
      style={{
        opacity,
        scale: reducedMotion ? 1 : scale,
        rotate,
      }}
      className="absolute left-1/2 top-1/2 w-[min(88vw,650px)] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="grid overflow-hidden rounded-[2.5rem] border border-amber-200 bg-white/95 shadow-[0_35px_100px_-45px_rgba(245,158,11,0.65)] backdrop-blur-xl sm:grid-cols-[0.86fr_1.14fr]">
        <div className="relative flex min-h-72 items-center justify-center bg-gradient-to-br from-amber-100 via-rose-50 to-white">
          <div className="flex size-40 items-center justify-center rounded-[3rem] border border-white bg-white/75 text-amber-500 shadow-xl">
            <Bone className="size-20" />
          </div>

          <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-700 shadow-sm">
            Dành cho mèo
          </span>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Product match
          </p>

          <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-zinc-900 sm:text-3xl">
            Chọn theo nhu cầu của thú cưng.
          </h3>

          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Loài, nhóm sản phẩm và thông tin sử dụng được trình bày rõ trước khi thêm vào giỏ hàng.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {['CAT', 'DINH DƯỠNG', 'THÔNG TIN RÕ RÀNG'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold tracking-wider text-amber-700"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Check className="size-5" />
            Phù hợp với hồ sơ đã chọn
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CartOrder({ progress, reducedMotion }: SharedSceneProps) {
  const cartOpacity = useTransform(progress, [0.65, 0.73, 0.87], [0, 1, 0]);

  const cartX = useTransform(
    progress,
    [0.65, 0.76, 0.87],
    reducedMotion ? [0, 0, 0] : [-80, 0, 90]
  );

  const orderOpacity = useTransform(progress, [0.82, 0.91, 1], [0, 1, 1]);

  const orderScale = useTransform(progress, [0.82, 0.94], [0.72, 1]);

  return (
    <div className="absolute inset-0">
      <motion.div
        style={{ opacity: cartOpacity, x: cartX }}
        className="absolute left-1/2 top-1/2 w-[min(86vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-amber-200 bg-white/95 p-5 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
            <ShoppingBasket className="size-6" />
          </div>
          <div>
            <p className="font-bold text-zinc-900">Giỏ hàng PetCare</p>
            <p className="text-xs text-zinc-500">Sản phẩm dành cho Miso</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {['Dinh dưỡng hằng ngày', 'Đồ chơi tương tác'].map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-3"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                {index === 0 ? <Bone className="size-5" /> : <PawPrint className="size-5" />}
              </div>

              <span className="flex-1 text-sm font-semibold text-zinc-800">{item}</span>
              <span className="text-xs font-bold text-zinc-500">×1</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        style={{
          opacity: orderOpacity,
          scale: reducedMotion ? 1 : orderScale,
        }}
        className="absolute left-1/2 top-1/2 w-[min(84vw,500px)] -translate-x-1/2 -translate-y-1/2 rounded-[2.25rem] border border-emerald-200 bg-white/95 p-6 text-center shadow-[0_35px_100px_-45px_rgba(16,185,129,0.55)]"
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-[1.5rem] bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
          <PackageCheck className="size-8" />
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
          Order confirmed
        </p>

        <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-zinc-900">
          Đơn hàng đã được tạo.
        </h3>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-600">
          Thông tin mua sắm tiếp tục đi cùng hồ sơ PetCare của thú cưng.
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          <Box className="size-5" />
          Sẵn sàng chuyển vào hành trình chung
        </div>
      </motion.div>
    </div>
  );
}

export function ShopJourneyScene({ progress, reducedMotion }: ShopJourneySceneProps) {
  const headingOpacity = useTransform(progress, [0, 0.08, 0.78, 0.94], [0, 1, 1, 0]);

  const headingX = useTransform(progress, [0, 0.12, 0.82, 1], [45, 0, 0, 45]);

  const cameraScale = useTransform(
    progress,
    [0, 0.4, 0.7, 1],
    reducedMotion ? [1, 1, 1, 1] : [0.88, 1, 1.08, 0.96]
  );

  const routeLength = useTransform(progress, [0.05, 0.95], [0, 1]);

  return (
    <section
      id="shop-journey"
      aria-labelledby="shop-journey-title"
      className="relative flex min-h-svh items-center overflow-hidden px-5 py-12 sm:px-8 lg:px-14"
    >
      <motion.header
        style={{
          opacity: headingOpacity,
          x: reducedMotion ? 0 : headingX,
        }}
        className="absolute right-5 top-8 z-30 max-w-xl text-right sm:right-8 lg:right-14"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Shop Journey</p>

        <h2
          id="shop-journey-title"
          className="mt-2 text-[clamp(2rem,3.8vw,4.1rem)] font-black leading-[0.96] tracking-[-0.055em] text-zinc-900"
        >
          Đúng sản phẩm.
          <span className="block text-amber-500">Đúng thú cưng.</span>
        </h2>
      </motion.header>

      <motion.div
        style={{ scale: cameraScale }}
        className="relative mx-auto h-[min(78svh,720px)] w-full max-w-6xl"
      >
        <CategoryOrbit progress={progress} reducedMotion={reducedMotion} />
        <ProductMatch progress={progress} reducedMotion={reducedMotion} />
        <CartOrder progress={progress} reducedMotion={reducedMotion} />

        <svg
          aria-hidden="true"
          viewBox="0 0 1100 650"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <path
            d="M1020 95 C850 170 880 420 630 390 C420 365 350 520 70 565"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d="M1020 95 C850 170 880 420 630 390 C420 365 350 520 70 565"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ pathLength: routeLength }}
          />
        </svg>
      </motion.div>
    </section>
  );
}
