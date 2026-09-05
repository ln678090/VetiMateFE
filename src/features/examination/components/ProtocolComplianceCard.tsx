'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, CheckCircle2, AlertCircle, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { useProtocols, useEvaluateProtocol } from '../hooks/use-doctor-clinical';
import type { ProtocolComplianceResponse } from '@/types/examination';

interface ProtocolComplianceCardProps {
  selectedMedicineIds: string[];
  durationDays?: number;
  onProtocolSelected?: (protocolCode: string) => void;
  className?: string;
}

export function ProtocolComplianceCard({
  selectedMedicineIds,
  durationDays = 5,
  onProtocolSelected,
  className = '',
}: ProtocolComplianceCardProps) {
  const { data: protocols, isLoading } = useProtocols();
  const evaluateMutation = useEvaluateProtocol();

  const [selectedProtocolCode, setSelectedProtocolCode] = useState<string>('PARVO_CANINE');
  const [complianceResult, setComplianceResult] = useState<ProtocolComplianceResponse | null>(null);

  useEffect(() => {
    if (selectedProtocolCode && selectedMedicineIds.length > 0) {
      evaluateMutation.mutate(
        {
          protocolCode: selectedProtocolCode,
          medicineIds: selectedMedicineIds,
          durationDays,
        },
        {
          onSuccess: (res) => {
            setComplianceResult(res);
          },
        }
      );
    } else {
      setComplianceResult(null);
    }
  }, [selectedProtocolCode, selectedMedicineIds, durationDays]);

  const handleSelectProtocol = (code: string) => {
    setSelectedProtocolCode(code);
    onProtocolSelected?.(code);
  };

  const activeProtocol = protocols?.find((p) => p.code === selectedProtocolCode);

  return (
    <div className={`rounded-3xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white">
            <BookOpen className="size-5 text-purple-600 dark:text-purple-400" />
            <span>Đối chiếu Phác đồ Chuẩn & Chấm điểm Tuân thủ</span>
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Hệ thống tự động chấm điểm đơn thuốc của nhân viên theo phác đồ điều trị tiêu chuẩn y khoa.
          </p>
        </div>

        {/* Protocol Switcher Pills */}
        <div className="flex flex-wrap gap-1.5">
          {protocols?.map((p) => (
            <button
              key={p.code}
              type="button"
              onClick={() => handleSelectProtocol(p.code)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                selectedProtocolCode === p.code
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {p.targetDisease}
            </button>
          ))}
        </div>
      </div>

      {/* Protocol Details & Compliance Score Breakdown */}
      {activeProtocol && (
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          {/* Left: Protocol Standards */}
          <div className="lg:col-span-6 space-y-2 rounded-2xl bg-purple-50/50 p-3.5 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-xs">
            <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-200">
              <span>📋 {activeProtocol.name}</span>
              <span className="rounded-md bg-purple-200 px-2 py-0.5 text-[10px] dark:bg-purple-900">
                Liệu trình: ≥ {activeProtocol.minDurationDays} ngày
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{activeProtocol.description}</p>
            <div className="pt-1">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Hoạt chất bắt buộc:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {activeProtocol.requiredIngredients.map((ing, i) => (
                  <span key={i} className="rounded-lg bg-white px-2 py-0.5 font-bold text-purple-700 border border-purple-200 dark:bg-zinc-800 dark:text-purple-300 dark:border-zinc-700">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Real-time Compliance Scoring */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50 flex flex-col justify-between">
            {complianceResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Điểm tuân thủ đơn thuốc
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl font-black ${
                        complianceResult.scorePercentage >= 90
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : complianceResult.scorePercentage >= 75
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {complianceResult.scorePercentage}%
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase text-white ${
                        complianceResult.scorePercentage >= 90
                          ? 'bg-emerald-600'
                          : complianceResult.scorePercentage >= 75
                          ? 'bg-blue-600'
                          : 'bg-amber-600'
                      }`}
                    >
                      {complianceResult.rating}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${complianceResult.scorePercentage}%` }}
                    className={`h-full transition-all ${
                      complianceResult.scorePercentage >= 90
                        ? 'bg-emerald-500'
                        : complianceResult.scorePercentage >= 75
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>

                {/* Matched vs Missing */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-emerald-50 p-2 dark:bg-emerald-950/30">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                      ✅ Thuốc đạt chuẩn ({complianceResult.matchedRequiredIngredients.length})
                    </span>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {complianceResult.matchedRequiredIngredients.join(', ') || 'Chưa có'}
                    </p>
                  </div>

                  <div className="rounded-xl bg-rose-50 p-2 dark:bg-rose-950/30">
                    <span className="font-bold text-rose-700 dark:text-rose-300 block mb-1">
                      ❌ Thuốc còn thiếu ({complianceResult.missingRequiredIngredients.length})
                    </span>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {complianceResult.missingRequiredIngredients.join(', ') || 'Đã đủ'}
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                {complianceResult.suggestions.length > 0 && (
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1">
                    {complianceResult.suggestions.map((s, idx) => (
                      <p key={idx} className="flex items-start gap-1">
                        <span>{s}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-4 text-xs text-zinc-400">
                <Sparkles className="size-6 text-purple-400 mb-1" />
                <p>Kê thuốc vào đơn bên dưới để hệ thống đối chiếu và chấm điểm tự động.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
