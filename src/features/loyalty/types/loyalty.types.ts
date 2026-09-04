export interface PointsResponse {
  totalPoints: number;
  availablePoints: number;
}

export interface PointTransaction {
  id: string;
  type: 'EARN' | 'SPEND' | 'REDEEM';
  points: number;
  description: string;
  createdAt: string;
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'FIXED' | 'PERCENT';
  discountValue: number;
  maxDiscount: number;
  minOrderAmount: number;
  maxUsage: number;
  usedCount: number;
  pointCost: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserVoucher {
  id: string;
  voucher: Voucher;
  isUsed: boolean;
  usedAt?: string;
  createdAt: string;
}

export interface CreateVoucherReq {
  code: string;
  name: string;
  description?: string;
  discountType: 'FIXED' | 'PERCENT';
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  maxUsage?: number;
  pointCost: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}
