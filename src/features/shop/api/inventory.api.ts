import { api } from '@/lib/axios';
import { ApiResp } from '@/types';
import { CreateImportVoucherReq, StockVoucherResp, Supplier } from '../types/inventory.types';

export const inventoryApi = {
  getAllVouchers: async () => {
    const res = await api.get<ApiResp<StockVoucherResp[]>>('/api/inventory/vouchers');
    return res.data;
  },

  createImportVoucher: async (data: CreateImportVoucherReq) => {
    const res = await api.post<ApiResp<StockVoucherResp>>('/api/inventory/vouchers/import', data);
    return res.data;
  },

  approveVoucher: async (id: string) => {
    const res = await api.put<ApiResp<StockVoucherResp>>(`/api/inventory/vouchers/${id}/approve`);
    return res.data;
  },

  getAllSuppliers: async () => {
    const res = await api.get<ApiResp<Supplier[]>>('/api/inventory/suppliers');
    return res.data;
  },
};
