'use client';

import { useQuery } from '@tanstack/react-query';
import { MedicineTable } from '@/features/inventory/components/MedicineTable';
import { medicineApi } from '@/features/inventory/api/inventory.api';

export default function MedicinesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => medicineApi.getAll(true),
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-[48px] bg-m3-background h-full">
      <div className="mb-[40px]">
        <h1 className="font-headline-lg text-[24px] md:text-[32px] font-semibold text-m3-on-surface mb-2 tracking-tight">
          Danh mục Thuốc & Vật tư y tế
        </h1>
        <p className="font-body-md text-[16px] text-m3-on-surface-variant">
          Quản lý thông tin, tồn kho và giá bán của các loại thuốc và vật tư.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <MedicineTable data={data?.data?.data} isLoading={isLoading} />
      </div>
    </div>
  );
}
