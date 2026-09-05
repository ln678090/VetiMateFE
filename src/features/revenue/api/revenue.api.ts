import { api, unwrap } from '@/lib/axios';
import type { ApiResp } from '@/types';
import type { RevenueAnalytics } from '@/types/revenue';

export const revenueApi = {
  async getRevenueAnalytics(period: string = 'MONTH'): Promise<RevenueAnalytics> {
    return unwrap(
      api.get<ApiResp<RevenueAnalytics>>('/api/management/revenue', {
        params: { period },
      })
    );
  },
};
