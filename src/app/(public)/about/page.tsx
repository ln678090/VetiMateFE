import { Metadata } from 'next';
import { PawPrint, Heart, ShieldCheck, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Về chúng tôi | PetCare',
  description:
    'Tìm hiểu về PetCare - Nơi cung cấp dịch vụ thú y và sản phẩm chăm sóc thú cưng hàng đầu.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50/50 pb-24 pt-8 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25">
            <PawPrint className="h-10 w-10" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 md:text-5xl dark:text-white">
            Về{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
              PetCare
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Chúng tôi hiểu rằng thú cưng không chỉ là vật nuôi, mà còn là những người bạn, những
            thành viên không thể thiếu trong gia đình bạn.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200/60 bg-white p-8 text-center shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">Sứ mệnh</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Mang đến giải pháp chăm sóc toàn diện, an toàn và ngập tràn tình yêu thương cho thú
              cưng, giúp chúng sống khỏe mạnh và hạnh phúc mỗi ngày.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200/60 bg-white p-8 text-center shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">Tầm nhìn</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Trở thành hệ thống thú y và cửa hàng tiện ích cho thú cưng được tin tưởng nhất, dẫn
              đầu về chất lượng dịch vụ và sản phẩm tại Việt Nam.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200/60 bg-white p-8 text-center shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">Đội ngũ</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Tập hợp những bác sĩ thú y tận tâm, giàu kinh nghiệm và những chuyên gia chăm sóc thú
              cưng được đào tạo bài bản, chuyên nghiệp.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/50">
          <div className="grid md:grid-cols-2">
            <div className="bg-zinc-100 p-12 dark:bg-zinc-800/50 flex flex-col justify-center">
              <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
                Câu chuyện của chúng tôi
              </h2>
              <p className="mb-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Được thành lập từ năm 2026, PetCare khởi nguồn từ tình yêu thương vô bờ bến dành cho
                động vật. Chúng tôi nhận thấy những khó khăn của người nuôi thú cưng trong việc tìm
                kiếm một địa chỉ uy tín để vừa chăm sóc sức khỏe, vừa mua sắm những sản phẩm chất
                lượng.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Đó là lý do PetCare ra đời - mô hình kết hợp &quot;All-in-one&quot; giữa Phòng khám
                thú y hiện đại và Siêu thị thú cưng cao cấp. Chúng tôi cam kết không ngừng nỗ lực để
                mang lại những trải nghiệm tốt nhất cho bạn và thú cưng của mình.
              </p>
            </div>
            <div className="relative min-h-[300px] md:min-h-full">
              {/* Image Placeholder - since we don't have an exact image, we can just use a nice gradient or placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-amber-500 opacity-90"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <PawPrint className="h-32 w-32 text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
