import { FadeIn } from '@/components/animations/FadeIn';
import { LoginForm } from '@/features/auth/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập vào PetCare Vet Shop',
};

export default function LoginPage() {
  return (
    <FadeIn className="w-full max-w-md">
      <div className="rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-rose-100/40 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-black/40">
        <div className="mb-7 space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Chào mừng trở lại
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Đăng nhập để tiếp tục chăm sóc thú cưng của bạn
          </p>
        </div>

        <LoginForm />
      </div>
    </FadeIn>
  );
}
