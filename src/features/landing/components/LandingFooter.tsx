import { APP } from '@/lib/constants';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';

const FOOTER_COLS = [
  {
    title: 'Sản phẩm',
    links: [
      { label: 'Thức ăn', href: '/shop/category/food' },
      { label: 'Đồ chơi', href: '/shop/category/toys' },
      { label: 'Cát vệ sinh', href: '/shop/category/litter' },
      { label: 'Phụ kiện', href: '/shop/category/accessories' },
    ],
  },
  {
    title: 'Dịch vụ',
    links: [
      { label: 'Đặt lịch chăm sóc', href: '/booking' },
      { label: 'Khám thú y', href: '/vet' },
      { label: 'Hồ sơ thú cưng', href: '/profile' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Câu hỏi thường gặp', href: '#' },
      { label: 'Chính sách đổi trả', href: '#' },
      { label: 'Liên hệ', href: '#contact' },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-zinc-200/70 bg-white/70 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/60"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-md">
                <PawPrint className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <span className="text-sm font-semibold tracking-tight">{APP.name}</span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Chăm sóc thú cưng cao cấp dành cho chó mèo. Đặt lịch khám và mua sắm tiện lợi mọi lúc.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-wider text-zinc-900 uppercase dark:text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-200/70 pt-6 sm:flex-row dark:border-zinc-800/60">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} {APP.name}. Đồ án tốt nghiệp.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-white">
              Điều khoản
            </Link>
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-white">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
