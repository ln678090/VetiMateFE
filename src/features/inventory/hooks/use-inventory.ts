import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  alertApi,
  batchApi,
  dashboardApi,
  medicineApi,
  supplierApi,
  voucherApi,
} from '../api/inventory.api';
import type {
  CreateVoucherRequest,
  MedicineRequest,
  SupplierRequest,
  VoucherStatus,
  VoucherType,
} from '@/types/inventory';

// ===== Query Keys =====
const KEYS = {
  suppliers: ['inventory', 'suppliers'] as const,
  medicines: ['inventory', 'medicines'] as const,
  lowStock: ['inventory', 'medicines', 'low-stock'] as const,
  vouchers: ['inventory', 'vouchers'] as const,
  batchesMedicine: (id: string) => ['inventory', 'batches', 'medicine', id] as const,
  batchesProduct: (id: string) => ['inventory', 'batches', 'product', id] as const,
  nearExpiry: ['inventory', 'alerts', 'near-expiry'] as const,
  expired: ['inventory', 'alerts', 'expired'] as const,
  dashboard: ['inventory', 'dashboard'] as const,
};

// ===== Suppliers =====

export function useSuppliers(all = false) {
  return useQuery({
    queryKey: [...KEYS.suppliers, { all }],
    queryFn: async () => {
      const { data } = await supplierApi.getAll(all);
      return data.data;
    },
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplierRequest) => supplierApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.suppliers }),
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupplierRequest }) =>
      supplierApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.suppliers }),
  });
}

export function useToggleSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supplierApi.toggleActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.suppliers }),
  });
}

// ===== Medicines =====

export function useMedicines(all = false) {
  return useQuery({
    queryKey: [...KEYS.medicines, { all }],
    queryFn: async () => {
      const { data } = await medicineApi.getAll(all);
      return data.data;
    },
  });
}

export function useLowStockMedicines() {
  return useQuery({
    queryKey: KEYS.lowStock,
    queryFn: async () => {
      const { data } = await medicineApi.getLowStock();
      return data.data;
    },
  });
}

export function useCreateMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicineRequest) => medicineApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.medicines }),
  });
}

export function useUpdateMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicineRequest }) =>
      medicineApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.medicines }),
  });
}

export function useToggleMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicineApi.toggleActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.medicines }),
  });
}

// ===== Vouchers =====

export function useVouchers(params?: {
  type?: VoucherType;
  status?: VoucherStatus;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: [...KEYS.vouchers, params],
    queryFn: async () => {
      const { data } = await voucherApi.getAll(params);
      return data.data;
    },
  });
}

export function useVoucherById(id: string) {
  return useQuery({
    queryKey: [...KEYS.vouchers, id],
    queryFn: async () => {
      const { data } = await voucherApi.getById(id);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVoucherRequest) => voucherApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.vouchers });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useApproveVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => voucherApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.vouchers });
      qc.invalidateQueries({ queryKey: KEYS.medicines });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useCancelVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => voucherApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.vouchers });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

// ===== Batches =====

export function useBatchesByMedicine(medicineId: string) {
  return useQuery({
    queryKey: KEYS.batchesMedicine(medicineId),
    queryFn: async () => {
      const { data } = await batchApi.getByMedicine(medicineId);
      return data.data;
    },
    enabled: !!medicineId,
  });
}

export function useBatchesByProduct(productId: string) {
  return useQuery({
    queryKey: KEYS.batchesProduct(productId),
    queryFn: async () => {
      const { data } = await batchApi.getByProduct(productId);
      return data.data;
    },
    enabled: !!productId,
  });
}

// ===== Alerts =====

export function useNearExpiryBatches() {
  return useQuery({
    queryKey: KEYS.nearExpiry,
    queryFn: async () => {
      const { data } = await alertApi.getNearExpiry();
      return data.data;
    },
  });
}

export function useExpiredBatches() {
  return useQuery({
    queryKey: KEYS.expired,
    queryFn: async () => {
      const { data } = await alertApi.getExpired();
      return data.data;
    },
  });
}

// ===== Dashboard =====

export function useInventoryDashboard() {
  return useQuery({
    queryKey: KEYS.dashboard,
    queryFn: async () => {
      const { data } = await dashboardApi.get();
      return data.data;
    },
  });
}
