'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Cat, Clock, Dog, Heart, Mail, MapPin, PawPrint, Phone } from 'lucide-react';
import Link from 'next/link';

const FOOTER_GROUPS = [
  {
    title: 'Phòng khám',
    links: [
      {
        label: 'Đặt lịch khám',
        href: '/booking',
      },
      {
        label: 'Hồ sơ thú cưng',
        href: '/profile/pets',
      },
      {
        label: 'Quy trình chăm sóc',
        href: '/#clinic',
      },
    ],
  },
  {
    title: 'Cửa hàng',
    links: [
      {
        label: 'Khám phá sản phẩm',
        href: '/shop',
      },
      {
        label: 'Giỏ hàng',
        href: '/cart',
      },
      {
        label: 'Đơn hàng của tôi',
        href: '/customer/orders',
      },
    ],
  },
  {
    title: 'Tài khoản',
    links: [
      {
        label: 'Đăng nhập',
        href: '/login',
      },
      {
        label: 'Đăng ký',
        href: '/register',
      },
      {
        label: 'Vào Dashboard',
        href: '/dashboard',
      },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-rose-100 bg-[#fffaf8]">
      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-0 size-96 rounded-full bg-rose-100/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 top-0 size-96 rounded-full bg-amber-100/70 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.8fr]">
          <div id="about">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-lg shadow-rose-200">
                <PawPrint className="size-6" />

                <motion.span
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -left-3 -top-3 grid size-7 place-items-center rounded-full border-2 border-white bg-rose-400 text-white"
                >
                  <Dog className="size-4" strokeWidth={1.5} />
                </motion.span>

                <motion.span
                  animate={{
                    y: [0, 3, 0],
                  }}
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-3 -right-3 grid size-7 place-items-center rounded-full border-2 border-white bg-amber-400 text-white"
                >
                  <Cat className="size-4" strokeWidth={1.5} />
                </motion.span>
              </span>

              <div>
                <p className="text-xl font-black tracking-[-0.04em] text-zinc-950">VetiMate</p>
                <p className="text-xs font-medium text-rose-500">Phòng Khám Thú Y & Pet Shop</p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-600">
              Hệ sinh thái chăm sóc thú cưng toàn diện: đặt lịch y tế, hồ sơ sức khỏe điện tử và mua sắm phụ kiện chính hãng cho chó mèo.
            </p>

            <div className="mt-5 space-y-2 text-xs text-zinc-600">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-rose-500 shrink-0" />
                <span>123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-rose-500 shrink-0" />
                <a href="tel:19008888" className="font-semibold text-zinc-900 hover:text-rose-600">1900 8888 / 0909 123 456</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-rose-500 shrink-0" />
                <a href="mailto:support@vetimate.vn" className="hover:text-rose-600">support@vetimate.vn</a>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="size-4 text-rose-500 shrink-0" />
                <span>08:00 - 20:00 (Tất cả các ngày trong tuần)</span>
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-zinc-500">
              <Heart className="size-4 fill-rose-400 text-rose-400" />
              Thiết kế vì hành trình khỏe mạnh của thú cưng.
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-xs font-black uppercase tracking-[0.17em] text-zinc-900">
                  {group.title}
                </h2>

                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 transition-colors hover:text-rose-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

        <div className="mt-7 flex flex-col items-center justify-between gap-4 text-center text-xs text-zinc-400 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} VetiMate. Veterinary Clinic & Pet Shop.</p>

          <motion.a
            href="#top"
            whileHover={{
              y: -3,
            }}
            className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-3 py-2 font-semibold text-rose-500 shadow-sm"
          >
            Lên đầu trang
            <ArrowUp className="size-3.5" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
