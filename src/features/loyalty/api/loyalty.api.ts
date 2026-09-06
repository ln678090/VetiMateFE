import { api } from '@/lib/axios';
import {
  CreateVoucherReq,
  PointTransaction,
  PointsResponse,
  UserVoucher,
  Voucher,
} from '../types/loyalty.types';

// User endpoints
export const getMyPoints = async () => {
  const { data } = await api.get<{ data: PointsResponse }>('/api/loyalty/points');
  return data.data;
};

export const getMyTransactions = async () => {
  const { data } = await api.get<{ data: PointTransaction[] }>('/api/loyalty/transactions');
  return data.data;
};

export const getAvailableVouchers = async () => {
  const { data } = await api.get<{ data: Voucher[] }>('/api/loyalty/vouchers');
  return data.data;
};

export const getMyVouchers = async () => {
  const { data } = await api.get<{ data: UserVoucher[] }>('/api/loyalty/my-vouchers');
  return data.data;
};

export const redeemVoucher = async (voucherId: string) => {
  const { data } = await api.post<{ data: UserVoucher }>('/api/loyalty/vouchers/redeem', {
    voucherId,
  });
  return data.data;
};

// Manager endpoints
export const getAllVouchers = async () => {
  const { data } = await api.get<{ data: Voucher[] }>('/api/management/vouchers');
  return data.data;
};

export const createVoucher = async (req: CreateVoucherReq) => {
  const { data } = await api.post<{ data: Voucher }>('/api/management/vouchers', req);
  return data.data;
};

export const updateVoucher = async (id: string, req: CreateVoucherReq) => {
  const { data } = await api.put<{ data: Voucher }>(`/api/management/vouchers/${id}`, req);
  return data.data;
};

export const deleteVoucher = async (id: string) => {
  await api.delete(`/api/management/vouchers/${id}`);
};
