'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, AlertTriangle, ShieldAlert, Zap, Info } from 'lucide-react';
import type { DrugSafetyAlert } from '@/types/examination';

interface DrugSafetyAlertBoxProps {
  alerts: DrugSafetyAlert[];
  className?: string;
}

export function DrugSafetyAlertBox({ alerts, className = '' }: DrugSafetyAlertBoxProps) {
  if (!alerts || alerts.length === 0) return null;

  const hasCritical = alerts.some((a) => a.severity === 'CRITICAL');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
        className={`relative overflow-hidden rounded-3xl border ${
          hasCritical
            ? 'border-red-500/60 bg-gradient-to-br from-red-600/15 via-red-50 to-white text-red-950 dark:border-red-500/40 dark:from-red-950/40 dark:via-zinc-900 dark:to-zinc-900 dark:text-red-100'
            : 'border-amber-500/60 bg-gradient-to-br from-amber-500/15 via-amber-50 to-white text-amber-950 dark:border-amber-500/40 dark:from-amber-950/40 dark:via-zinc-900 dark:to-zinc-900 dark:text-amber-100'
        } p-4 sm:p-5 shadow-lg ${className}`}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${
              hasCritical ? 'bg-red-600 animate-pulse' : 'bg-amber-600'
            }`}
          >
            {hasCritical ? <AlertOctagon className="size-6" /> : <AlertTriangle className="size-6" />}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                <span>🚨 CẢNH BÁO AN TOÀN DƯỢC LÂM SÀNG</span>
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white uppercase">
                  {alerts.length} Rủi ro phát hiện
                </span>
              </h4>
            </div>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
              Hệ thống phát hiện tương tác kỵ thuốc hoặc hoạt chất chống chỉ định với tiền sử dị ứng của thú cưng. Vui lòng kiểm tra kỹ trước khi chỉ định.
            </p>
          </div>
        </div>

        {/* List of Alerts */}
        <div className="mt-4 space-y-2.5">
          {alerts.map((alert, idx) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isAllergy = alert.type === 'ALLERGY_CONTRAINDICATION';

            return (
              <div
                key={idx}
                className={`rounded-2xl border p-3.5 text-xs transition-all ${
                  isCritical
                    ? 'border-red-300 bg-red-500/10 dark:border-red-500/30 dark:bg-red-950/50'
                    : 'border-amber-300 bg-amber-500/10 dark:border-amber-500/30 dark:bg-amber-950/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0">
                    {isAllergy ? (
                      <ShieldAlert className="size-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <Zap className="size-4 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm">
                        {alert.title}
                      </span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-500/20 text-amber-800 dark:text-amber-200'
                        }`}
                      >
                        Mức độ: {alert.severity}
                      </span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
