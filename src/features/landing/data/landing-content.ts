import {
  CalendarHeart,
  HeartPulse,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

export interface LandingService {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  color: string;
}

export interface CareStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const LANDING_SERVICES: LandingService[] = [
  {
    icon: Stethoscope,
    eyebrow: 'Veterinary',
    title: 'Khám thú y chuyên sâu',
    description: 'Đặt lịch nhanh, lưu bệnh án theo từng lần khám và theo dõi sức khỏe lâu dài.',
    href: '/booking',
    color: 'from-sky-500 to-indigo-500',
  },
  {
    icon: Sparkles,
    eyebrow: 'Pet spa',
    title: 'Chăm sóc chuẩn spa',
    description: 'Tắm gội, cắt tỉa và chăm sóc da lông trong khung giờ phù hợp.',
    href: '/booking',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: ShoppingBag,
    eyebrow: 'Premium shop',
    title: 'Cửa hàng chính hãng',
    description: 'Thức ăn, cát vệ sinh, đồ chơi và phụ kiện chọn lọc cho chó mèo.',
    href: '/shop',
    color: 'from-amber-500 to-orange-500',
  },
];

export const CARE_STEPS: CareStep[] = [
  {
    number: '01',
    title: 'Tạo hồ sơ thú cưng',
    description: 'Lưu thông tin giống, tuổi, cân nặng và tình trạng sức khỏe.',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'Chọn dịch vụ và giờ trống',
    description: 'Xem lịch khả dụng theo thời lượng thực tế của từng dịch vụ.',
    icon: CalendarHeart,
  },
  {
    number: '03',
    title: 'Khám và cập nhật bệnh án',
    description: 'Bác sĩ ghi chẩn đoán, phác đồ điều trị và đơn thuốc.',
    icon: HeartPulse,
  },
  {
    number: '04',
    title: 'Theo dõi sức khỏe dài hạn',
    description: 'Mỗi lần khám được giữ riêng để hình thành lịch sử sức khỏe đầy đủ.',
    icon: Stethoscope,
  },
];

export const TRUST_ITEMS = [
  'Bác sĩ có chứng chỉ',
  'Bệnh án điện tử',
  'Đặt lịch theo giờ trống',
  'Sản phẩm chính hãng',
  'Hỗ trợ khách hàng',
];
