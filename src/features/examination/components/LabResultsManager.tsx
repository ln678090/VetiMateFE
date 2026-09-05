'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  FlaskConical,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLabResults, useSaveLabResults } from '../hooks/use-doctor-clinical';
import type { LabResultItem, LabResultResponse } from '@/types/examination';

interface LabResultsManagerProps {
  medicalRecordId: string;
  isReadOnly?: boolean;
}

// Preset reference templates for quick filling
const PRESET_CBC_ITEMS: LabResultItem[] = [
  {
    testType: 'BLOOD_CBC',
    testName: 'Tổng phân tích tế bào máu (CBC)',
    parameterCode: 'WBC',
    parameterName: 'Bạch cầu (WBC)',
    measuredValue: 12.5,
    unit: '10^3/uL',
    minNormal: 6.0,
    maxNormal: 17.0,
  },
  {
    testType: 'BLOOD_CBC',
    testName: 'Tổng phân tích tế bào máu (CBC)',
    parameterCode: 'RBC',
    parameterName: 'Hồng cầu (RBC)',
    measuredValue: 6.8,
    unit: '10^6/uL',
    minNormal: 5.5,
    maxNormal: 8.5,
  },
  {
    testType: 'BLOOD_CBC',
    testName: 'Tổng phân tích tế bào máu (CBC)',
    parameterCode: 'HGB',
    parameterName: 'Huyết sắc tố (HGB)',
    measuredValue: 14.5,
    unit: 'g/dL',
    minNormal: 12.0,
    maxNormal: 18.0,
  },
  {
    testType: 'BLOOD_CBC',
    testName: 'Tổng phân tích tế bào máu (CBC)',
    parameterCode: 'PLT',
    parameterName: 'Tiểu cầu (PLT)',
    measuredValue: 320.0,
    unit: '10^3/uL',
    minNormal: 200.0,
    maxNormal: 500.0,
  },
];

const PRESET_BIOCHEM_ITEMS: LabResultItem[] = [
  {
    testType: 'BIOCHEMISTRY',
    testName: 'Sinh hóa máu - Chức năng Gan Thận',
    parameterCode: 'ALT',
    parameterName: 'Men gan (ALT/GPT)',
    measuredValue: 45.0,
    unit: 'U/L',
    minNormal: 10.0,
    maxNormal: 100.0,
  },
  {
    testType: 'BIOCHEMISTRY',
    testName: 'Sinh hóa máu - Chức năng Gan Thận',
    parameterCode: 'CREA',
    parameterName: 'Creatinine (Thận)',
    measuredValue: 1.1,
    unit: 'mg/dL',
    minNormal: 0.5,
    maxNormal: 1.5,
  },
  {
    testType: 'BIOCHEMISTRY',
    testName: 'Sinh hóa máu - Chức năng Gan Thận',
    parameterCode: 'BUN',
    parameterName: 'Ure máu (BUN)',
    measuredValue: 18.0,
    unit: 'mg/dL',
    minNormal: 7.0,
    maxNormal: 27.0,
  },
  {
    testType: 'BIOCHEMISTRY',
    testName: 'Sinh hóa máu - Chức năng Gan Thận',
    parameterCode: 'GLU',
    parameterName: 'Đường huyết (Glucose)',
    measuredValue: 95.0,
    unit: 'mg/dL',
    minNormal: 70.0,
    maxNormal: 140.0,
  },
];

const PRESET_URINE_ITEMS: LabResultItem[] = [
  {
    testType: 'URINALYSIS',
    testName: 'Tổng phân tích Nước tiểu',
    parameterCode: 'pH',
    parameterName: 'Độ pH nước tiểu',
    measuredValue: 6.5,
    unit: 'pH',
    minNormal: 5.5,
    maxNormal: 7.5,
  },
  {
    testType: 'URINALYSIS',
    testName: 'Tổng phân tích Nước tiểu',
    parameterCode: 'PROT',
    parameterName: 'Protein niệu',
    measuredValue: 0.0,
    unit: 'mg/dL',
    minNormal: 0.0,
    maxNormal: 30.0,
  },
];

export function LabResultsManager({ medicalRecordId, isReadOnly = false }: LabResultsManagerProps) {
  const { data: serverLabs, isLoading } = useLabResults(medicalRecordId);
  const saveMutation = useSaveLabResults(medicalRecordId);

  const [items, setItems] = useState<LabResultItem[]>([]);

  useEffect(() => {
    if (serverLabs && serverLabs.length > 0) {
      setItems(serverLabs);
    }
  }, [serverLabs]);

  const calculateStatus = (item: LabResultItem): 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL' => {
    if (item.measuredValue > item.maxNormal) {
      return item.measuredValue >= item.maxNormal * 1.8 ? 'CRITICAL' : 'HIGH';
    }
    if (item.measuredValue < item.minNormal) {
      return item.measuredValue <= item.minNormal * 0.5 ? 'CRITICAL' : 'LOW';
    }
    return 'NORMAL';
  };

  const handleUpdateItem = (index: number, field: keyof LabResultItem, value: unknown) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      next[index].status = calculateStatus(next[index]);
      return next;
    });
  };

  const handleAddItem = (preset?: LabResultItem) => {
    const newItem: LabResultItem = preset || {
      testType: 'BLOOD_CBC',
      testName: 'Xét nghiệm bổ sung',
      parameterCode: 'PAR-' + (items.length + 1),
      parameterName: 'Chỉ số mới',
      measuredValue: 10,
      unit: 'U/L',
      minNormal: 5,
      maxNormal: 20,
    };
    newItem.status = calculateStatus(newItem);
    setItems((prev) => [...prev, newItem]);
  };

  const handleAddPresetBatch = (presets: LabResultItem[]) => {
    setItems((prev) => {
      const existingCodes = new Set(prev.map((p) => p.parameterCode));
      const filtered = presets.filter((p) => !existingCodes.has(p.parameterCode));
      const withStatus = filtered.map((p) => ({ ...p, status: calculateStatus(p) }));
      return [...prev, ...withStatus];
    });
    toast.success('Đã nạp gói mẫu chỉ số xét nghiệm');
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error('Chưa có chỉ số xét nghiệm nào để lưu.');
      return;
    }
    try {
      await saveMutation.mutateAsync(items);
      toast.success('Đã lưu và cập nhật kết quả xét nghiệm thành công!');
    } catch (err) {
      toast.error('Lỗi khi lưu kết quả xét nghiệm: ' + (err instanceof Error ? err.message : ''));
    }
  };

  const abnormalCount = items.filter((i) => i.status === 'HIGH' || i.status === 'LOW' || i.status === 'CRITICAL').length;

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white">
            <FlaskConical className="size-5 text-indigo-500" />
            <span>Kết quả Cận lâm sàng & Xét nghiệm (Lab Results)</span>
            {abnormalCount > 0 && (
              <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-black text-white animate-pulse">
                🚨 {abnormalCount} Chỉ số vượt chuẩn
              </span>
            )}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Tự động đánh dấu đỏ các chỉ số máu/nước tiểu nằm ngoài khoảng tham chiếu an toàn.
          </p>
        </div>

        {/* Action Controls */}
        {!isReadOnly && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddPresetBatch(PRESET_CBC_ITEMS)}
              className="text-xs gap-1 rounded-xl"
            >
              + Bộ CBC (Máu)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddPresetBatch(PRESET_BIOCHEM_ITEMS)}
              className="text-xs gap-1 rounded-xl"
            >
              + Bộ Sinh hóa
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddPresetBatch(PRESET_URINE_ITEMS)}
              className="text-xs gap-1 rounded-xl"
            >
              + Nước tiểu
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Save className="size-3.5" />
              Lưu chỉ số
            </Button>
          </div>
        )}
      </div>

      {/* Lab Results Table */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-800/30">
          <FlaskConical className="mx-auto size-8 text-zinc-300 dark:text-zinc-600" />
          <p className="mt-2 text-xs font-medium text-zinc-500">Chưa có kết quả xét nghiệm nào cho ca khám này.</p>
          {!isReadOnly && (
            <div className="mt-3 flex justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleAddPresetBatch(PRESET_CBC_ITEMS)} className="text-xs">
                Nạp nhanh bộ xét nghiệm máu CBC
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <th className="py-2.5 px-3">Loại xét nghiệm</th>
                <th className="py-2.5 px-3">Tên chỉ số</th>
                <th className="py-2.5 px-3">Kết quả đo</th>
                <th className="py-2.5 px-3">Đơn vị</th>
                <th className="py-2.5 px-3">Khoảng chuẩn (Min - Max)</th>
                <th className="py-2.5 px-3 text-center">Đánh giá</th>
                {!isReadOnly && <th className="py-2.5 px-3 text-center">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((item, idx) => {
                const status = calculateStatus(item);
                const isAbnormal = status === 'HIGH' || status === 'LOW' || status === 'CRITICAL';

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      status === 'CRITICAL'
                        ? 'bg-red-500/15 font-semibold dark:bg-red-950/40'
                        : isAbnormal
                        ? 'bg-amber-500/10 font-medium dark:bg-amber-950/30'
                        : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30'
                    }`}
                  >
                    {/* Test Type */}
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300">
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase dark:bg-zinc-800">
                        {item.testType}
                      </span>
                    </td>

                    {/* Parameter Name */}
                    <td className="py-2.5 px-3">
                      {isReadOnly ? (
                        <span className="font-bold text-zinc-900 dark:text-white">{item.parameterName}</span>
                      ) : (
                        <input
                          type="text"
                          value={item.parameterName}
                          onChange={(e) => handleUpdateItem(idx, 'parameterName', e.target.value)}
                          className="w-full rounded-lg border border-transparent px-2 py-1 focus:border-indigo-400 focus:bg-white dark:focus:bg-zinc-800 font-semibold"
                        />
                      )}
                    </td>

                    {/* Measured Value */}
                    <td className="py-2.5 px-3">
                      {isReadOnly ? (
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-sm font-black ${
                            isAbnormal
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'text-zinc-900 dark:text-white'
                          }`}
                        >
                          {item.measuredValue}
                        </span>
                      ) : (
                        <input
                          type="number"
                          step="0.1"
                          value={item.measuredValue}
                          onChange={(e) => handleUpdateItem(idx, 'measuredValue', parseFloat(e.target.value) || 0)}
                          className={`w-24 rounded-lg px-2.5 py-1 text-sm font-black border ${
                            isAbnormal
                              ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200 shadow-xs'
                              : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                          }`}
                        />
                      )}
                    </td>

                    {/* Unit */}
                    <td className="py-2.5 px-3 text-zinc-500">{item.unit}</td>

                    {/* Reference Range */}
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300">
                      {isReadOnly ? (
                        <span>{item.minNormal} - {item.maxNormal}</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.1"
                            value={item.minNormal}
                            onChange={(e) => handleUpdateItem(idx, 'minNormal', parseFloat(e.target.value) || 0)}
                            className="w-14 rounded border border-zinc-200 px-1 py-0.5 text-center text-xs dark:border-zinc-700 dark:bg-zinc-800"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            step="0.1"
                            value={item.maxNormal}
                            onChange={(e) => handleUpdateItem(idx, 'maxNormal', parseFloat(e.target.value) || 0)}
                            className="w-14 rounded border border-zinc-200 px-1 py-0.5 text-center text-xs dark:border-zinc-700 dark:bg-zinc-800"
                          />
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 text-center">
                      {status === 'CRITICAL' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-xs">
                          <AlertCircle className="size-3" /> NGUY HIỂM
                        </span>
                      )}
                      {status === 'HIGH' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-bold">
                          ▲ CAO VƯỢT
                        </span>
                      )}
                      {status === 'LOW' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-bold">
                          ▼ THẤP
                        </span>
                      )}
                      {status === 'NORMAL' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 className="size-3" /> Bình thường
                        </span>
                      )}
                    </td>

                    {/* Delete */}
                    {!isReadOnly && (
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-zinc-400 hover:text-red-600 transition"
                          title="Xóa chỉ số"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
