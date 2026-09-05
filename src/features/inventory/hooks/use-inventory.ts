import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/axios';
import {
  supplierApi,
  medicineApi,
  voucherApi,
  batchApi,
  alertApi,
  dashboardApi,
} from '../api/inventory.api';
import type {
  SupplierRequest,
  MedicineRequest,
  CreateVoucherRequest,
  VoucherType,
  VoucherStatus,
} from '@/types/inventory';

const SUPPLIER_KEY = 'suppliers';
const MEDICINE_KEY = 'medicines';
const VOUCHER_KEY = 'vouchers';

// ===== Suppliers =====
export const useSuppliers = (all = false) =>
  useQuery({
    queryKey: [SUPPLIER_KEY, all],
    queryFn: async () => {
      const res = await supplierApi.getAll(all);
      return res.data.data;
    },
  });

export const useCreateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplierRequest) => supplierApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SUPPLIER_KEY] });
      toast.success('Thêm nhà cung cấp thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

export const useUpdateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupplierRequest }) =>
      supplierApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SUPPLIER_KEY] });
      toast.success('Cập nhật nhà cung cấp thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

export const useToggleSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supplierApi.toggleActive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SUPPLIER_KEY] });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

// ===== Medicines =====
export const useMedicines = (all = false) =>
  useQuery({
    queryKey: [MEDICINE_KEY, all],
    queryFn: async () => {
      const res = await medicineApi.getAll(all);
      return res.data.data;
    },
  });

export const useCreateMedicine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicineRequest) => medicineApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [MEDICINE_KEY] });
      toast.success('Thêm thuốc thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

export const useUpdateMedicine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicineRequest }) =>
      medicineApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [MEDICINE_KEY] });
      toast.success('Cập nhật thuốc thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

export const useToggleMedicine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicineApi.toggleActive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [MEDICINE_KEY] });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

export const useLowStockMedicines = () =>
  useQuery({
    queryKey: [MEDICINE_KEY, 'low-stock'],
    queryFn: async () => {
      const res = await medicineApi.getLowStock();
      return res.data.data;
    },
  });

// ===== Vouchers =====
export const useVouchers = (params?: {
  type?: VoucherType;
  status?: VoucherStatus;
  page?: number;
  size?: number;
}) =>
  useQuery({
    queryKey: [VOUCHER_KEY, params],
    queryFn: async () => {
      const res = await voucherApi.getAll(params);
      return res.data.data;
    },
  });

export const useCreateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVoucherRequest) => voucherApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [VOUCHER_KEY] });
      toast.success('Tạo phiếu thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

export const useApproveVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => voucherApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [VOUCHER_KEY] });
      toast.success('Duyệt phiếu thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

export const useCancelVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => voucherApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [VOUCHER_KEY] });
      toast.success('Huỷ phiếu thành công');
    },
    onError: (err: unknown) => toast.error(getApiErrorMessage(err)),
  });
};

// ===== Batches =====
export const useBatchesByMedicine = (medicineId: string) =>
  useQuery({
    queryKey: ['batches', 'medicine', medicineId],
    queryFn: async () => {
      const res = await batchApi.getByMedicine(medicineId);
      return res.data.data;
    },
    enabled: !!medicineId,
  });

// ===== Alerts =====
export const useNearExpiryAlerts = () =>
  useQuery({
    queryKey: ['alerts', 'near-expiry'],
    queryFn: async () => {
      const res = await alertApi.getNearExpiry();
      return res.data.data;
    },
  });

export const useExpiredAlerts = () =>
  useQuery({
    queryKey: ['alerts', 'expired'],
    queryFn: async () => {
      const res = await alertApi.getExpired();
      return res.data.data;
    },
  });

// ===== Dashboard =====
export const useInventoryDashboard = () =>
  useQuery({
    queryKey: ['inventory-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.get();
      return res.data.data;
    },
  });

// ===== Alerts =====
export const useNearExpiryBatches = () =>
  useQuery({
    queryKey: ['alerts', 'near-expiry'],
    queryFn: async () => {
      const res = await alertApi.getNearExpiry();
      return res.data.data;
    },
  });

export const useExpiredBatches = () =>
  useQuery({
    queryKey: ['alerts', 'expired'],
    queryFn: async () => {
      const res = await alertApi.getExpired();
      return res.data.data;
    },
  });
