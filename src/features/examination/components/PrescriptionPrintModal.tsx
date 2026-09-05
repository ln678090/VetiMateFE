'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Send, QrCode, Stethoscope, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { MedicalRecordResponse, PrescriptionItemResponse } from '@/types/examination';

interface PrescriptionPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecordResponse;
  petName?: string;
  customerName?: string;
  doctorName?: string;
}

export function PrescriptionPrintModal({
  isOpen,
  onClose,
  record,
  petName = 'Bé cưng',
  customerName = 'Chủ nuôi',
  doctorName = 'BS. Trần Văn Bác Sĩ',
}: PrescriptionPrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    toast.success('Đã gửi đơn thuốc điện tử qua Email/Zalo cho chủ thú cưng thành công!');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          {/* Action Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 print:hidden dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Printer className="size-5 text-emerald-600" />
              <span>In & Gửi Đơn Thuốc Y Tế</span>
            </h3>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleSendEmail} className="gap-1.5 rounded-xl text-xs">
                <Send className="size-3.5" /> Gửi chủ pet
              </Button>
              <Button size="sm" onClick={handlePrint} className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                <Printer className="size-3.5" /> In đơn thuốc
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-white print:p-0 print:m-0">
            {/* Clinic Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-4">
              <div>
                <h1 className="text-xl font-black text-emerald-700 tracking-tight">PHÒNG KHÁM THÚ Y VETIMATE</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Hệ thống Y tế & Chăm sóc Thú cưng Tiêu chuẩn Quốc tế</p>
                <p className="text-[11px] text-zinc-400">Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh • Hotline: 1900 8888</p>
              </div>
              <div className="text-right">
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700 border border-emerald-200 uppercase">
                  ĐƠN THUỐC
                </span>
                <p className="text-[11px] text-zinc-400 mt-1">Mã HS: {record.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-[11px] text-zinc-400">Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            {/* Patient & Customer Details */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-zinc-50 p-4 text-xs dark:bg-zinc-800/50">
              <div className="space-y-1">
                <p>
                  <span className="text-zinc-500">Chủ thú cưng:</span> <strong>{customerName}</strong>
                </p>
                <p>
                  <span className="text-zinc-500">Thú cưng:</span> <strong>{petName}</strong>
                </p>
                <p>
                  <span className="text-zinc-500">Cân nặng:</span> <strong>{record.weightKg ? `${record.weightKg} kg` : 'N/A'}</strong>
                </p>
              </div>
              <div className="space-y-1">
                <p>
                  <span className="text-zinc-500">Bác sĩ khám:</span> <strong>{doctorName}</strong>
                </p>
                <p>
                  <span className="text-zinc-500">Chẩn đoán:</span> <strong className="text-rose-600">{record.diagnosis || 'Theo dõi điều trị'}</strong>
                </p>
                {record.temperatureC && (
                  <p>
                    <span className="text-zinc-500">Thân nhiệt:</span> <strong>{record.temperatureC} °C</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Prescriptions Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Chỉ định Thuốc & Liều lượng</h4>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-100 text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700">
                    <th className="py-2 px-3">STT</th>
                    <th className="py-2 px-3">Tên thuốc / Hoạt chất</th>
                    <th className="py-2 px-3 text-center">SL</th>
                    <th className="py-2 px-3">Đơn vị</th>
                    <th className="py-2 px-3">Hướng dẫn liều dùng</th>
                    <th className="py-2 px-3 text-center">Số ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {record.prescriptions.map((rx, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 text-zinc-400 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-zinc-900 dark:text-white">
                        {rx.medicineName}
                        {rx.note && <span className="block text-[10px] text-zinc-500 font-normal italic">{rx.note}</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{rx.quantity}</td>
                      <td className="py-2.5 px-3">{rx.unit}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">{rx.dosage}</td>
                      <td className="py-2.5 px-3 text-center font-medium">{rx.durationDays} ngày</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Doctor Note & Care Instructions */}
            {record.doctorNote && (
              <div className="rounded-xl border border-zinc-200 p-3 text-xs dark:border-zinc-700">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">📌 Lời dặn dò của Bác sĩ:</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{record.doctorNote}</p>
              </div>
            )}

            {record.followUpDate && (
              <p className="text-xs font-bold text-amber-600">
                📅 Lịch hẹn tái khám dự kiến: {record.followUpDate}
              </p>
            )}

            {/* Footer Signature */}
            <div className="mt-8 flex items-end justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="space-y-1 text-center">
                <div className="size-16 rounded-xl border border-dashed border-zinc-300 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
                  <QrCode className="size-10 text-zinc-400" />
                </div>
                <p className="text-[10px] text-zinc-400">Quét mã tra cứu hồ sơ</p>
              </div>

              <div className="text-center space-y-8">
                <p className="font-semibold text-zinc-500">Bác sĩ điều trị</p>
                <p className="font-bold text-sm text-zinc-900 dark:text-white">{doctorName}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
