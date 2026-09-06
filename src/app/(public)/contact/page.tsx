'use client';

import { Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${type} vào khay nhớ tạm!`);
  };

  return (
    <main className="min-h-screen bg-zinc-50/50 pb-24 pt-16 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 md:text-6xl dark:text-white">
            Liên hệ với{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
              PetCare
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về dịch vụ cũng như
            sản phẩm chăm sóc thú cưng.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {/* Hotline Card */}
          <a
            href="tel:0974501927"
            onClick={(e) => {
              // Vẫn giữ tính năng mở app gọi điện, nhưng copy thêm vào clipboard phòng hờ
              handleCopy('0974501927', 'số điện thoại');
            }}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-white p-10 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 border border-zinc-200/60 dark:border-zinc-800/60 dark:bg-zinc-900/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-rose-50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-amber-950/20 dark:to-rose-950/20"></div>
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-transform group-hover:scale-110 dark:bg-amber-900/30 dark:text-amber-400">
              <Phone className="h-10 w-10" />
            </div>
            <h2 className="relative mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
              Hotline
            </h2>
            <p className="relative text-xl font-medium text-zinc-600 dark:text-zinc-300">
              0974501927
            </p>
            <p className="relative mt-3 text-sm text-zinc-500 dark:text-zinc-500">
              Bấm để gọi hoặc copy
            </p>
          </a>

          {/* Email Card */}
          <a
            href="mailto:ln678090@gmail.com"
            onClick={(e) => {
              handleCopy('ln678090@gmail.com', 'email');
            }}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-white p-10 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 border border-zinc-200/60 dark:border-zinc-800/60 dark:bg-zinc-900/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-emerald-950/20 dark:to-teal-950/20"></div>
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Mail className="h-10 w-10" />
            </div>
            <h2 className="relative mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
              Email
            </h2>
            <p className="relative text-xl font-medium text-zinc-600 dark:text-zinc-300">
              ln678090@gmail.com
            </p>
            <p className="relative mt-3 text-sm text-zinc-500 dark:text-zinc-500">
              Bấm để gửi mail hoặc copy
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
