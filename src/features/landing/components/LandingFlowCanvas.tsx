'use client';

import type { ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

import { LANDING_SCENES } from '../data/landing-flow';

type LandingScene = (typeof LANDING_SCENES)[number];

export interface LandingFlowCanvasProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
  children: ReactNode;
}

interface SceneMarkerProps {
  scene: LandingScene;
  index: number;
  progress: MotionValue<number>;
}

function SceneMarker({ scene, index, progress }: SceneMarkerProps) {
  const activationStart = Math.max(0, scene.routeProgress - 0.035);
  const activationEnd = Math.min(1, scene.routeProgress + 0.015);

  const markerScale = useTransform(
    progress,
    [activationStart, activationEnd],
    [index === 0 ? 1 : 0.65, 1],
    { clamp: true }
  );

  const markerOpacity = useTransform(
    progress,
    [activationStart, activationEnd],
    [index === 0 ? 1 : 0.35, 1],
    { clamp: true }
  );

  const labelX = useTransform(progress, [activationStart, activationEnd], [10, 0], { clamp: true });

  return (
    <li className="relative flex min-h-9 items-center justify-end gap-3">
      <motion.span
        style={{
          opacity: markerOpacity,
          x: labelX,
        }}
        className="text-right text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600"
      >
        {scene.navLabel}
      </motion.span>

      <motion.span
        style={{
          opacity: markerOpacity,
          scale: markerScale,
        }}
        className="relative z-10 size-3 rounded-full border-2 border-white bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.14)]"
      />
    </li>
  );
}

export function LandingFlowCanvas({ progress, reducedMotion, children }: LandingFlowCanvasProps) {
  const cameraX = useTransform(
    progress,
    [0, 0.32, 0.58, 1],
    reducedMotion ? ['0%', '0%', '0%', '0%'] : ['0%', '-5%', '4%', '0%']
  );

  const cameraY = useTransform(
    progress,
    [0, 0.42, 0.75, 1],
    reducedMotion ? ['0%', '0%', '0%', '0%'] : ['0%', '-4%', '3%', '-2%']
  );

  const atmosphereRotation = useTransform(progress, [0, 1], reducedMotion ? [0, 0] : [-4, 8]);

  const atmosphereScale = useTransform(
    progress,
    [0, 0.5, 1],
    reducedMotion ? [1, 1, 1] : [1, 1.12, 1.04]
  );

  const routeDashOffset = useTransform(progress, [0, 1], [28, 0]);

  const railProgress = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div className="relative isolate bg-[#FFF8F6]">
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 z-0 h-svh overflow-hidden"
      >
        <motion.div
          style={{
            x: cameraX,
            y: cameraY,
            rotate: atmosphereRotation,
            scale: atmosphereScale,
          }}
          className="absolute -inset-[15%]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.17),transparent_28%),radial-gradient(circle_at_82%_34%,rgba(245,158,11,0.16),transparent_30%),radial-gradient(circle_at_54%_82%,rgba(236,72,153,0.13),transparent_32%),linear-gradient(180deg,#FFF8F6_0%,#FFF1F2_48%,#FFFFFF_100%)]" />

          <div className="absolute left-[7%] top-[18%] size-[28rem] rounded-full border border-rose-200/40" />
          <div className="absolute right-[3%] top-[8%] size-[36rem] rounded-full border border-amber-200/40" />
          <div className="absolute bottom-[-12%] left-[35%] size-[30rem] rounded-full border border-pink-200/40" />
        </motion.div>

        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
        >
          <defs>
            <linearGradient id="landing-flow-route" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="55%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <filter id="landing-flow-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="
              M -80 700
              C 140 620, 120 260, 360 300
              C 590 340, 470 720, 730 650
              C 980 580, 850 190, 1120 240
              C 1320 280, 1240 610, 1520 540
            "
            fill="none"
            stroke="#FFE4E6"
            strokeWidth="14"
            strokeLinecap="round"
          />

          <motion.path
            d="
              M -80 700
              C 140 620, 120 260, 360 300
              C 590 340, 470 720, 730 650
              C 980 580, 850 190, 1120 240
              C 1320 280, 1240 610, 1520 540
            "
            fill="none"
            stroke="url(#landing-flow-route)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="14 28"
            filter="url(#landing-flow-glow)"
            style={{
              pathLength: reducedMotion ? 1 : progress,
              strokeDashoffset: routeDashOffset,
            }}
          />

          <motion.circle
            r="11"
            fill="#FFFFFF"
            stroke="#F43F5E"
            strokeWidth="5"
            filter="url(#landing-flow-glow)"
            style={{
              offsetPath: `path(
                "M -80 700
                C 140 620, 120 260, 360 300
                C 590 340, 470 720, 730 650
                C 980 580, 850 190, 1120 240
                C 1320 280, 1240 610, 1520 540"
              )`,
              offsetDistance: useTransform(progress, [0, 1], ['0%', '100%']),
            }}
          />
        </svg>

        <div className="absolute inset-x-0 top-0 h-px bg-rose-100">
          <motion.div
            style={{ scaleX: progress }}
            className="h-full origin-left bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400"
          />
        </div>

        <nav
          aria-label="Tiến trình hành trình PetCare"
          className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block"
        >
          <div className="relative rounded-3xl border border-white/80 bg-white/70 px-4 py-4 shadow-xl shadow-rose-100/50 backdrop-blur-xl">
            <div className="absolute bottom-7 right-[21px] top-7 w-px bg-rose-100">
              <motion.div
                style={{ height: railProgress }}
                className="w-full bg-gradient-to-b from-rose-500 via-pink-500 to-amber-400"
              />
            </div>

            <ol className="relative space-y-1">
              {LANDING_SCENES.map((scene, index) => (
                <SceneMarker key={scene.id} scene={scene} index={index} progress={progress} />
              ))}
            </ol>
          </div>
        </nav>
      </div>

      <div className="relative z-10 -mt-[100svh]">{children}</div>
    </div>
  );
}
