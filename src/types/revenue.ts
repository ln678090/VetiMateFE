export interface RevenueOverview {
  totalRevenue: number;
  clinicRevenue: number;
  shopRevenue: number;
  totalOrders: number;
  completedOrders: number;
  totalAppointments: number;
  completedAppointments: number;
  growthPercentage: number;
}

export interface RevenueTimelineItem {
  label: string;
  clinicRevenue: number;
  shopRevenue: number;
  totalRevenue: number;
  orderCount: number;
  appointmentCount: number;
}

export interface TopItemRevenue {
  name: string;
  category: 'SERVICE' | 'PRODUCT';
  quantity: number;
  totalAmount: number;
}

export interface RecentTransaction {
  id: string;
  code: string;
  type: 'CLINIC' | 'SHOP';
  title: string;
  customerName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface RevenueAnalytics {
  period: string;
  overview: RevenueOverview;
  timeline: RevenueTimelineItem[];
  topServices: TopItemRevenue[];
  topProducts: TopItemRevenue[];
  recentTransactions: RecentTransaction[];
}
