'use client';

import { motion } from 'framer-motion';
import { CalendarHeart, ShoppingBag, Stethoscope, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  gradient: string;
}

const FEATURES: Feature[] = [
  {
    icon: CalendarHeart,
    title: 'Đặt lịch chăm sóc',
    desc: 'Spa tắm gội, cắt tỉa lông, cắt móng cho thú cưng. Lựa chọn khung giờ linh hoạt theo lịch trình của bạn.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Stethoscope,
    title: 'Khám thú y chuyên sâu',
    desc: 'Khám tổng quát, tiêm vaccine, xét nghiệm và điều trị bởi đội ngũ bác sĩ thú y giàu kinh nghiệm.',
    gradient: 'from-sky-500 to-indigo-500',
  },
  {
    icon: ShoppingBag,
    title: 'Cửa hàng đầy đủ',
    desc: 'Thức ăn cao cấp, đồ chơi an toàn, cát vệ sinh, phụ kiện - tất cả từ các thương hiệu uy tín hàng đầu.',
    gradient: 'from-amber-500 to-orange-500',
  },
];

export function LandingFeatures() {
  return (
    <section
      id="services"
      className="relative border-t border-zinc-200/50 bg-gradient-to-b from-white to-rose-50/30 py-20 md:py-28 dark:border-zinc-800/50 dark:from-zinc-950 dark:to-zinc-950"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
            Tất cả những gì thú cưng của bạn cần
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Từ chăm sóc sức khỏe đến mua sắm hàng ngày - chúng tôi đồng hành cùng bạn trong mọi
            khoảnh khắc.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 p-7 backdrop-blur-xl transition-all hover:border-rose-300/60 hover:shadow-xl hover:shadow-rose-100/50 dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:hover:border-rose-500/30 dark:hover:shadow-rose-500/5"
              >
                {/* Decorative blob */}
                <div
                  className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
                />

                <div
                  className={`mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md`}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
