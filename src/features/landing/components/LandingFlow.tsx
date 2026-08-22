'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'framer-motion';

import {
  getSceneById,
  LANDING_SCENES,
  LANDING_TOTAL_SCROLL_VH,
  type LandingSceneId,
} from '../data/landing-flow';
import { ClinicJourneyScene } from './ClinicJourneyScene';
import { HealthPassportSceneV4 } from './HealthPassportSceneV4';
import { HeroGatewayScene } from './HeroGatewayScene';
import { LandingFlowCanvas } from './LandingFlowCanvas';
import { ProblemPortalScene } from './ProblemPortalScene';
import { ShopJourneyScene } from './ShopJourneyScene';
import { TrustProofFinaleScene } from './TrustProofFinaleScene';

interface SceneRange {
  start: number;
  end: number;
}

interface SceneFrameProps {
  heightVh: number;
  children: ReactNode;
}

function createSceneRanges(): Record<LandingSceneId, SceneRange> {
  let consumedVh = 0;

  return LANDING_SCENES.reduce(
    (ranges, scene) => {
      const start = consumedVh / LANDING_TOTAL_SCROLL_VH;

      consumedVh += scene.scrollVh;

      ranges[scene.id] = {
        start,
        end: consumedVh / LANDING_TOTAL_SCROLL_VH,
      };

      return ranges;
    },
    {} as Record<LandingSceneId, SceneRange>
  );
}

const SCENE_RANGES = createSceneRanges();

const HERO_SCENE = getSceneById('hero');
const PROBLEM_SCENE = getSceneById('problem');
const CLINIC_SCENE = getSceneById('clinic');
const SHOP_SCENE = getSceneById('shop');
const PASSPORT_SCENE = getSceneById('passport');
const PROOF_SCENE = getSceneById('proof');
const FINALE_SCENE = getSceneById('finale');

function SceneFrame({ heightVh, children }: SceneFrameProps) {
  return (
    <div className="relative" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">{children}</div>
    </div>
  );
}

export function LandingFlow() {
  const flowRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: flowRef,
    offset: ['start start', 'end end'],
  });

  const heroProgress = useTransform(
    scrollYProgress,
    [SCENE_RANGES.hero.start, SCENE_RANGES.hero.end],
    [0, 1],
    { clamp: true }
  );

  const problemProgress = useTransform(
    scrollYProgress,
    [SCENE_RANGES.problem.start, SCENE_RANGES.problem.end],
    [0, 1],
    { clamp: true }
  );

  const clinicProgress = useTransform(
    scrollYProgress,
    [SCENE_RANGES.clinic.start, SCENE_RANGES.clinic.end],
    [0, 1],
    { clamp: true }
  );

  const shopProgress = useTransform(
    scrollYProgress,
    [SCENE_RANGES.shop.start, SCENE_RANGES.shop.end],
    [0, 1],
    { clamp: true }
  );

  const passportProgress = useTransform(
    scrollYProgress,
    [SCENE_RANGES.passport.start, SCENE_RANGES.passport.end],
    [0, 1],
    { clamp: true }
  );

  const finaleProgress = useTransform(
    scrollYProgress,
    [SCENE_RANGES.proof.start, SCENE_RANGES.finale.end],
    [0, 1],
    { clamp: true }
  );

  return (
    <section
      ref={flowRef}
      aria-label="Hành trình PetCare"
      className="relative overflow-clip bg-[#FFF8F6]"
    >
      <LandingFlowCanvas progress={scrollYProgress} reducedMotion={reducedMotion}>
        <SceneFrame heightVh={HERO_SCENE.scrollVh}>
          <HeroGatewayScene progress={heroProgress} reducedMotion={reducedMotion} />
        </SceneFrame>

        <SceneFrame heightVh={PROBLEM_SCENE.scrollVh}>
          <ProblemPortalScene progress={problemProgress} reducedMotion={reducedMotion} />
        </SceneFrame>

        <SceneFrame heightVh={CLINIC_SCENE.scrollVh}>
          <ClinicJourneyScene progress={clinicProgress} reducedMotion={reducedMotion} />
        </SceneFrame>

        <SceneFrame heightVh={SHOP_SCENE.scrollVh}>
          <ShopJourneyScene progress={shopProgress} reducedMotion={reducedMotion} />
        </SceneFrame>

        <SceneFrame heightVh={PASSPORT_SCENE.scrollVh}>
          <HealthPassportSceneV4 progress={passportProgress} reducedMotion={reducedMotion} />
        </SceneFrame>

        <SceneFrame heightVh={PROOF_SCENE.scrollVh + FINALE_SCENE.scrollVh}>
          <TrustProofFinaleScene progress={finaleProgress} reducedMotion={reducedMotion} />
        </SceneFrame>
      </LandingFlowCanvas>
    </section>
  );
}
