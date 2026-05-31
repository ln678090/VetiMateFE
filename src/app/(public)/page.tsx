import type { Metadata } from 'next';

import { LandingFeatures } from '@/features/landing/components/LandingFeatures';
import { LandingHero } from '@/features/landing/components/LandingHero';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Đặt lịch khám thú y, chăm sóc spa và mua sắm thức ăn, đồ chơi, cát vệ sinh cho chó mèo.',
};

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
    </>
  );
}
