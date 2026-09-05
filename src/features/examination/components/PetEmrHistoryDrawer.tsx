'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  History,
  Scale,
  Syringe,
  AlertTriangle,
  Stethoscope,
  Pill,
  FileText,
  User,
  Phone,
  Calendar,
} from 'lucide-react';
import { usePetEmrHistory } from '../hooks/use-doctor-clinical';
import { Skeleton } from '@/components/ui/skeleton';

interface PetEmrHistoryDrawerProps {
  petId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PetEmrHistoryDrawer({ petId, isOpen, onClose }: PetEmrHistoryDrawerProps) {
  const { data: emr, isLoading } = usePetEmrHistory(petId);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <History className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>Bệnh án Điện tử (EMR) - {emr?.petName || 'Hồ sơ Thú cưng'}</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {emr?.breed || emr?.species}
                  </span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Lịch sử khám toàn diện, biến thiên cân nặng, vaccine và tiền sử dị ứng.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
              </div>
            ) : emr ? (
              <>
                {/* 1. Customer & Vital Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <User className="size-3.5 text-zinc-400" /> Chủ nuôi
                    </span>
                    <p className="font-bold text-xs text-zinc-900 dark:text-white mt-1">{emr.customerName}</p>
                    <p className="text-[11px] text-zinc-500">{emr.customerPhone}</p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Scale className="size-3.5 text-zinc-400" /> Cân nặng hiện tại
                    </span>
                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                      {emr.currentWeightKg ? `${emr.currentWeightKg} kg` : 'Chưa cân'}
                    </p>
                  </div>

                  <div className="col-span-2 sm:col-span-1 rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="size-3.5 text-zinc-400" /> Tổng số lần khám
                    </span>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white mt-1">
                      {emr.pastVisits.length} lần
                    </p>
                  </div>
                </div>

                {/* 2. Tiền sử Dị ứng (Allergies) */}
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
                    <AlertTriangle className="size-4" /> Tiền sử Dị ứng & Chống chỉ định
                  </h4>
                  {emr.allergies.length === 0 ? (
                    <p className="mt-2 text-xs text-zinc-500">Chưa ghi nhận tiền sử dị ứng thuốc nào.</p>
                  ) : (
                    <div className="mt-2.5 space-y-2">
                      {emr.allergies.map((all, i) => (
                        <div key={i} className="flex items-start justify-between rounded-xl bg-white p-2.5 shadow-xs dark:bg-zinc-800 text-xs">
                          <div>
                            <span className="font-bold text-red-600 dark:text-red-400">{all.allergen || all.medicineName}</span>
                            {all.note && <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">{all.note}</p>}
                          </div>
                          <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-700 dark:bg-red-950 dark:text-red-300 uppercase">
                            {all.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Lịch sử Tiêm chủng Vaccine */}
                {emr.vaccineHistory.length > 0 && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                      <Syringe className="size-4" /> Sổ Tiêm Chủng Vaccine
                    </h4>
                    <div className="mt-2.5 space-y-2">
                      {emr.vaccineHistory.map((vac, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-xs dark:bg-zinc-800 text-xs">
                          <span className="font-semibold text-zinc-900 dark:text-white">{vac.serviceName}</span>
                          <div className="text-right text-[11px] text-zinc-500">
                            <span>{vac.date}</span> • <span>{vac.doctorName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Timeline các lần khám trước */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    <Stethoscope className="size-4 text-emerald-600" /> Chi tiết các lần khám trước
                  </h4>

                  {emr.pastVisits.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-4">Chưa có lần khám nào trước đây.</p>
                  ) : (
                    <div className="space-y-4">
                      {emr.pastVisits.map((visit, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-800/80 space-y-2.5 text-xs"
                        >
                          <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-700">
                            <span className="font-bold text-zinc-900 dark:text-white text-sm">
                              Khám ngày: {visit.date}
                            </span>
                            <span className="text-[11px] text-zinc-500">BS: {visit.doctorName}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-zinc-700 dark:text-zinc-300">
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Triệu chứng:</span>
                              <p className="font-medium">{visit.symptoms || 'Không ghi nhận'}</p>
                            </div>
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Chẩn đoán:</span>
                              <p className="font-bold text-rose-600 dark:text-rose-400">{visit.diagnosis || 'Chưa chẩn đoán'}</p>
                            </div>
                          </div>

                          {visit.treatmentPlan && (
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Phác đồ / Hướng điều trị:</span>
                              <p className="text-zinc-600 dark:text-zinc-300 italic">{visit.treatmentPlan}</p>
                            </div>
                          )}

                          {/* Past Prescriptions */}
                          {visit.prescriptions.length > 0 && (
                            <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-900/50">
                              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-1">
                                <Pill className="size-3 text-emerald-500" /> Đơn thuốc đã kê:
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                                {visit.prescriptions.map((rx, rxi) => (
                                  <li key={rxi}>
                                    <strong>{rx.medicineName}</strong> (SL: {rx.quantity} {rx.unit}) - {rx.dosage} ({rx.durationDays} ngày)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
