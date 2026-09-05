'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, ArrowRight, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '@/lib/axios';
import { useCreateWalkInExam } from '../hooks/use-doctor-clinical';
import type { SpringPage } from '@/types/clinic';

interface CustomerOption {
  id: string;
  fullName: string;
  phone: string;
}

interface PetOption {
  id: string;
  name: string;
  breed?: string;
  weightKg?: number;
}

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  durationMin: number;
}

interface WalkInReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalkInReceptionModal({ isOpen, onClose }: WalkInReceptionModalProps) {
  const router = useRouter();
  const createMutation = useCreateWalkInExam();

  // Load customer list for quick selection
  const { data: customerList = [] } = useQuery({
    queryKey: ['clinic-customers-options'],
    queryFn: async () => {
      try {
        const res = await unwrap<any>(
          api.get('/api/clinic/customers', { params: { page: 0, size: 100, sort: 'fullName,asc' } })
        );
        if (Array.isArray(res)) return res as CustomerOption[];
        if (res?.content && Array.isArray(res.content)) return res.content as CustomerOption[];
        return [];
      } catch (err) {
        console.error('Error fetching customers:', err);
        return [];
      }
    },
    enabled: isOpen,
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  // Load pets belonging to selected customer
  const { data: petList = [] } = useQuery({
    queryKey: ['clinic-pets-options', selectedCustomerId],
    queryFn: async () => {
      if (!selectedCustomerId) return [];
      try {
        const res = await unwrap<any>(
          api.get('/api/clinic/pets', { params: { customerId: selectedCustomerId, size: 100 } })
        );
        if (Array.isArray(res)) return res as PetOption[];
        if (res?.content && Array.isArray(res.content)) return res.content as PetOption[];
        return [];
      } catch (err) {
        console.error('Error fetching pets:', err);
        return [];
      }
    },
    enabled: Boolean(selectedCustomerId),
  });

  // Load clinic services
  const { data: serviceList = [] } = useQuery({
    queryKey: ['clinic-services-options'],
    queryFn: async () => {
      try {
        const res = await unwrap<any>(
          api.get('/api/clinic/services', { params: { page: 0, size: 100, sort: 'name,asc' } })
        );
        if (Array.isArray(res)) return res as ServiceOption[];
        if (res?.content && Array.isArray(res.content)) return res.content as ServiceOption[];
        return [];
      } catch (err) {
        console.error('Error fetching services:', err);
        return [];
      }
    },
    enabled: isOpen,
  });

  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [initialSymptoms, setInitialSymptoms] = useState('');
  const [weightKg, setWeightKg] = useState<number | undefined>();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedPetId || !selectedServiceId) {
      toast.error('Vui lòng chọn đầy đủ chủ nuôi, thú cưng và dịch vụ khám.');
      return;
    }

    try {
      const res = await createMutation.mutateAsync({
        customerId: selectedCustomerId,
        petId: selectedPetId,
        serviceId: selectedServiceId,
        initialSymptoms: initialSymptoms.trim() || undefined,
        weightKg: weightKg || undefined,
      });

      toast.success('Đã tiếp nhận ca khám vãng lai thành công!');
      onClose();
      if (res?.appointmentId) {
        router.push(`/doctor/examinations/${res.appointmentId}`);
      }
    } catch (err) {
      toast.error('Lỗi khi tiếp nhận ca khám: ' + (err instanceof Error ? err.message : ''));
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
          className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                <UserPlus className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Tiếp nhận ca trực tiếp (Walk-in)
                </h3>
                <p className="text-xs text-zinc-500">Khách đến khám trực tiếp không qua đặt lịch trước.</p>
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
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Customer select */}
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Chọn Chủ nuôi (Khách hàng) *
              </label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  setSelectedPetId('');
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800"
              >
                <option value="">-- Chọn khách hàng --</option>
                {Array.isArray(customerList) &&
                  customerList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.phone})
                    </option>
                  ))}
              </select>
            </div>

            {/* Pet select */}
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Chọn Thú cưng *
              </label>
              <select
                required
                disabled={!selectedCustomerId}
                value={selectedPetId}
                onChange={(e) => {
                  setSelectedPetId(e.target.value);
                  const p = petList?.find((x) => x.id === e.target.value);
                  if (p?.weightKg) setWeightKg(p.weightKg);
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800 disabled:opacity-50"
              >
                <option value="">-- Chọn thú cưng --</option>
                {Array.isArray(petList) &&
                  petList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed || 'Pet'}) {p.weightKg ? `- ${p.weightKg} kg` : ''}
                    </option>
                  ))}
              </select>
            </div>

            {/* Service select */}
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Dịch vụ khám ban đầu *
              </label>
              <select
                required
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800"
              >
                <option value="">-- Chọn gói khám / dịch vụ --</option>
                {Array.isArray(serviceList) &&
                  serviceList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.price)})
                    </option>
                  ))}
              </select>
            </div>

            {/* Initial Symptoms & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Cân nặng (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ví dụ: 4.5"
                  value={weightKg ?? ''}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || undefined)}
                  className="w-full rounded-xl border border-zinc-200 p-2.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Lý do khám sơ bộ</label>
                <input
                  type="text"
                  placeholder="Nôn, sốt, bỏ ăn..."
                  value={initialSymptoms}
                  onChange={(e) => setInitialSymptoms(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-2.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                {createMutation.isPending ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="size-3.5" />
                )}
                Tạo phiếu khám ngay
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
