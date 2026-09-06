'use client';

import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất có thể!');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <main className="min-h-screen bg-zinc-50/50 pb-24 pt-8 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 md:text-5xl dark:text-white">
            Liên hệ với <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">PetCare</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về dịch vụ cũng như sản phẩm chăm sóc thú cưng.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-8 rounded-3xl bg-white p-8 shadow-sm border border-zinc-200/60 dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Thông tin liên hệ</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Địa chỉ</h3>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">123 Đường Thú Cưng, Quận Yêu Thương, Thành phố Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Hotline</h3>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">1900 1234 56 (Cấp cứu 24/7)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Email</h3>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">support@petcare.vn</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Giờ mở cửa</h3>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">Tất cả các ngày trong tuần: 08:00 - 20:00<br/>Dịch vụ cấp cứu: 24/24</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-8 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Gửi lời nhắn cho chúng tôi</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-zinc-700 dark:text-white dark:focus:border-rose-500"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-zinc-700 dark:text-white dark:focus:border-rose-500"
                  placeholder="Nhập email của bạn"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Lời nhắn</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-zinc-700 dark:text-white dark:focus:border-rose-500"
                  placeholder="Nội dung cần hỗ trợ..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25">
                <Send className="mr-2 h-5 w-5" />
                Gửi lời nhắn
              </Button>
            </form>
          </div>
        </div>
        
      </div>
    </main>
  );
}
