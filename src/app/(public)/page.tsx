import { LandingPage } from '@/features/landing/components/LandingPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PetCare — Chăm sóc thú cưng toàn diện',
  description: 'Đặt lịch khám thú y, chăm sóc spa và mua sắm sản phẩm chính hãng cho chó mèo.',
};

export default function HomePage() {
  return <LandingPage />;
}
