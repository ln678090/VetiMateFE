export type LandingSceneId =
  'hero' | 'problem' | 'clinic' | 'shop' | 'passport' | 'proof' | 'finale';

export type LandingSceneAccent = 'rose' | 'pink' | 'amber';

export interface LandingScene {
  id: LandingSceneId;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  scrollVh: number;
  routeProgress: number;
  accent: LandingSceneAccent;
}

export const LANDING_SCENES = [
  {
    id: 'hero',
    navLabel: 'Bắt đầu',
    eyebrow: 'PetCare Journey',
    title: 'Trọn hành trình khỏe mạnh của thú cưng.',
    description: 'Một nơi kết nối chăm sóc, khám chữa bệnh và mua sắm.',
    scrollVh: 110,
    routeProgress: 0,
    accent: 'rose',
  },
  {
    id: 'problem',
    navLabel: 'Nhu cầu',
    eyebrow: 'Mọi thứ từng rời rạc',
    title: 'Quá nhiều lựa chọn. Quá ít sự kết nối.',
    description: 'Lịch khám, hồ sơ sức khỏe và sản phẩm phù hợp đang nằm ở nhiều nơi.',
    scrollVh: 200,
    routeProgress: 0.14,
    accent: 'pink',
  },
  {
    id: 'clinic',
    navLabel: 'Phòng khám',
    eyebrow: 'Clinic Journey',
    title: 'Từ một khung giờ đến kết quả điều trị.',
    description: 'Chọn lịch, gặp bác sĩ và lưu lại toàn bộ diễn biến sức khỏe.',
    scrollVh: 240,
    routeProgress: 0.34,
    accent: 'rose',
  },
  {
    id: 'shop',
    navLabel: 'Cửa hàng',
    eyebrow: 'Shop Journey',
    title: 'Sản phẩm phù hợp cho đúng thú cưng.',
    description: 'Danh mục rõ ràng dành cho chó và mèo, gắn với hành trình chăm sóc.',
    scrollVh: 220,
    routeProgress: 0.54,
    accent: 'amber',
  },
  {
    id: 'passport',
    navLabel: 'Hồ sơ',
    eyebrow: 'Pet Health Passport',
    title: 'Mỗi dữ liệu hội tụ về một hồ sơ.',
    description: 'Lịch khám, chẩn đoán và hành trình mua sắm cùng theo sát thú cưng.',
    scrollVh: 200,
    routeProgress: 0.72,
    accent: 'pink',
  },
  {
    id: 'proof',
    navLabel: 'Giá trị',
    eyebrow: 'Một nền tảng thống nhất',
    title: 'Ít thao tác hơn. Nhiều thông tin hữu ích hơn.',
    description: 'Phòng khám, cửa hàng và hồ sơ sức khỏe hoạt động trong cùng hệ thống.',
    scrollVh: 140,
    routeProgress: 0.88,
    accent: 'rose',
  },
  {
    id: 'finale',
    navLabel: 'Khám phá',
    eyebrow: 'Bắt đầu hành trình',
    title: 'Chăm sóc tốt hơn bắt đầu từ hôm nay.',
    description: 'Đặt lịch cho thú cưng hoặc khám phá cửa hàng PetCare.',
    scrollVh: 140,
    routeProgress: 1,
    accent: 'amber',
  },
] as const satisfies readonly LandingScene[];

export const LANDING_TOTAL_SCROLL_VH = LANDING_SCENES.reduce(
  (total, scene) => total + scene.scrollVh,
  0
);

export function getSceneById(sceneId: LandingSceneId): (typeof LANDING_SCENES)[number] {
  const scene = LANDING_SCENES.find((candidate) => candidate.id === sceneId);

  if (!scene) {
    throw new Error(`Landing scene "${sceneId}" is not configured.`);
  }

  return scene;
}

export function getSceneScrollHeight(sceneId: LandingSceneId): string {
  return `${getSceneById(sceneId).scrollVh}vh`;
}

