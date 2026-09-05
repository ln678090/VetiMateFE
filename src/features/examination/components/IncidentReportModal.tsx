'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertOctagon, ShieldAlert, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReportIncident } from '../hooks/use-doctor-clinical';
import type { MedicalIncidentRequest } from '@/types/examination';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
  medicalRecordId?: string;
  petName?: string;
}

export function IncidentReportModal({
  isOpen,
  onClose,
  petId,
  medicalRecordId,
  petName = 'Thú cưng',
}: IncidentReportModalProps) {
  const reportMutation = useReportIncident();

  const [incidentType, setIncidentType] = useState<'DRUG_SHOCK' | 'DEATH' | 'SURGICAL_COMPLICATION' | 'CUSTOMER_COMPLAINT' | 'MEDICATION_ERROR'>('DRUG_SHOCK');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('CRITICAL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [immediateAction, setImmediateAction] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và mô tả sự cố.');
      return;
    }

    try {
      const payload: MedicalIncidentRequest = {
        petId,
        medicalRecordId: medicalRecordId || null,
        incidentType,
        severity,
        title: title.trim(),
        description: description.trim(),
        rootCause: rootCause.trim() || undefined,
        immediateAction: immediateAction.trim() || undefined,
        correctiveAction: correctiveAction.trim() || undefined,
      };

      await reportMutation.mutateAsync(payload);
      toast.success('Đã lưu báo cáo sự cố y khoa vào hệ thống quản lý rủi ro.');
      onClose();
    } catch (err) {
      toast.error('Lỗi khi lưu báo cáo sự cố: ' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
                <AlertOctagon className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Báo cáo Sự cố Y khoa & Truy xuất Rủi ro
                </h3>
                <p className="text-xs text-zinc-500">
                  Ghi nhận ca sốc thuốc, pet tử vong, tai biến phẫu thuật hoặc khiếu nại ({petName}).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
            {/* Incident Type & Severity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Loại sự cố *</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value="DRUG_SHOCK">💉 Sốc phản vệ / Sốc thuốc</option>
                  <option value="DEATH">🖤 Thú cưng tử vong (Pet death)</option>
                  <option value="SURGICAL_COMPLICATION">⚠️ Tai biến phẫu thuật / Gây mê</option>
                  <option value="CUSTOMER_COMPLAINT">😡 Khách hàng khiếu nại gay gắt</option>
                  <option value="MEDICATION_ERROR">💊 Sai sót cấp phát thuốc</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Mức độ nghiêm trọng *</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800 text-red-600 font-bold"
                >
                  <option value="CRITICAL">🔴 CRITICAL - Tối khẩn cấp / Tử vong</option>
                  <option value="HIGH">🟠 HIGH - Nghiêm trọng</option>
                  <option value="MEDIUM">🟡 MEDIUM - Trung bình</option>
                  <option value="LOW">🟢 LOW - Nhẹ</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Tiêu đề sự cố *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Sốc phản vệ độ 2 sau tiêm kháng sinh..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 p-2.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Diễn biến chi tiết sự cố *</label>
              <textarea
                rows={3}
                required
                placeholder="Mô tả cụ thể thời gian, triệu chứng xuất hiện, biểu hiện lâm sàng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 p-2.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>

            {/* Root Cause & Actions */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Nguyên nhân gốc rễ (Root cause)</label>
                <input
                  type="text"
                  placeholder="Cơ địa dị ứng chưa khai báo / quá mẫn với thuốc..."
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-2 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Biện pháp xử lý tức thời (Immediate action)</label>
                <input
                  type="text"
                  placeholder="Tiêm Adrenaline cấp cứu, thở oxy lồng 30 phút..."
                  value={immediateAction}
                  onChange={(e) => setImmediateAction(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-2 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Biện pháp khắc phục & Rút kinh nghiệm (Corrective action)</label>
                <input
                  type="text"
                  placeholder="Ghi nhận cảnh báo đỏ dị ứng vĩnh viễn vào hồ sơ EMR..."
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-2 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={reportMutation.isPending}
                className="gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                <Save className="size-3.5" />
                Gửi báo cáo rủi ro
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
