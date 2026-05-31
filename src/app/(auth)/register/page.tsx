import { FadeIn } from '@/components/animations/FadeIn';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Tạo tài khoản PetCare Vet Shop',
};

export default function RegisterPage() {
  return (
    <FadeIn className="w-full max-w-md">
      <div className="rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-sky-100/40 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-black/40">
        <div className="mb-7 space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tạo tài khoản mới
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tham gia cộng đồng yêu thú cưng của chúng tôi
          </p>
        </div>

        <RegisterForm />
      </div>
    </FadeIn>
  );
}
