export interface JourneyBeat {
  id:
    | 'opening'
    | 'clinic-discovery'
    | 'shop-discovery'
    | 'parallel-actions'
    | 'examination'
    | 'order'
    | 'convergence'
    | 'passport'
    | 'finale';

  index: number;
  start: number;
  focus: number;
  end: number;
  eyebrow: string;
  title: string;
  description: string;
}

export const JOURNEY_BEATS: readonly JourneyBeat[] = [
  {
    id: 'opening',
    index: 1,
    start: 0,
    focus: 0.05,
    end: 0.13,
    eyebrow: 'Mọi thứ bắt đầu',
    title: 'Chó mèo cần nhiều hơn một nơi.',
    description: 'Lịch khám, sức khỏe và mua sắm đang nằm rời rạc.',
  },
  {
    id: 'clinic-discovery',
    index: 2,
    start: 0.1,
    focus: 0.16,
    end: 0.25,
    eyebrow: 'Nhánh phòng khám',
    title: 'Giờ trống xuất hiện ngay trước mắt.',
    description: 'Không cần gọi nhiều lần để hỏi lịch.',
  },
  {
    id: 'shop-discovery',
    index: 3,
    start: 0.22,
    focus: 0.29,
    end: 0.38,
    eyebrow: 'Nhánh cửa hàng',
    title: 'Sản phẩm phù hợp được chọn lọc.',
    description: 'Thức ăn, cát, đồ chơi và phụ kiện cho chó mèo.',
  },
  {
    id: 'parallel-actions',
    index: 4,
    start: 0.35,
    focus: 0.42,
    end: 0.51,
    eyebrow: 'Cùng một lúc',
    title: 'Đặt lịch và mua sắm song song.',
    description: 'Hai hành trình vận hành trong cùng một hệ thống.',
  },
  {
    id: 'examination',
    index: 5,
    start: 0.48,
    focus: 0.55,
    end: 0.64,
    eyebrow: 'Tại phòng khám',
    title: 'Mỗi lần khám tạo một bệnh án.',
    description: 'Chẩn đoán, cân nặng và tình trạng sức khỏe được lưu lại.',
  },
  {
    id: 'order',
    index: 6,
    start: 0.61,
    focus: 0.67,
    end: 0.75,
    eyebrow: 'Tại cửa hàng',
    title: 'Sản phẩm chính hãng thành một đơn hàng.',
    description: 'Danh mục rõ ràng, không cần đoán nguồn gốc.',
  },
  {
    id: 'convergence',
    index: 7,
    start: 0.72,
    focus: 0.78,
    end: 0.86,
    eyebrow: 'Hai nhánh hội tụ',
    title: 'Mọi dữ liệu trở về đúng hồ sơ Pet.',
    description: 'Sức khỏe và chăm sóc không còn tách biệt.',
  },
  {
    id: 'passport',
    index: 8,
    start: 0.83,
    focus: 0.89,
    end: 0.96,
    eyebrow: 'Pet Health Passport',
    title: 'Một lịch sử khỏe mạnh được hình thành.',
    description: 'Bệnh án cũ được giữ nguyên, trạng thái mới luôn được cập nhật.',
  },
  {
    id: 'finale',
    index: 9,
    start: 0.93,
    focus: 0.975,
    end: 1,
    eyebrow: 'PetCare',
    title: 'Trọn hành trình khỏe mạnh của thú cưng.',
    description: 'Phòng khám và cửa hàng trong một trải nghiệm liền mạch.',
  },
] as const;

export const JOURNEY_SCROLL_HEIGHT_VH = 760;

export function getBeat(id: JourneyBeat['id']): JourneyBeat {
  const beat = JOURNEY_BEATS.find((item) => item.id === id);

  if (!beat) {
    throw new Error(`Không tìm thấy journey beat: ${id}`);
  }

  return beat;
}

export function getBeatInput(id: JourneyBeat['id']): [number, number, number] {
  const beat = getBeat(id);

  return [beat.start, beat.focus, beat.end];
}

export function getBeatOpacityInput(id: JourneyBeat['id']): number[] {
  const beat = getBeat(id);

  const fadeDistance = 0.025;

  return [
    Math.max(0, beat.start - fadeDistance),
    beat.start,
    beat.focus,
    beat.end,
    Math.min(1, beat.end + fadeDistance),
  ];
}

export const JOURNEY_EASING = [0.22, 1, 0.36, 1] as const;
