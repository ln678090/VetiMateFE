'use client';

import { CheckCircle2, ClipboardPlus, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCancelServiceIndication,
  useCompleteServiceIndication,
  useCreateServiceIndication,
  useServiceIndications,
} from '@/features/examination/hooks/use-service-indications';
import type { ServiceIndicationResponse } from '@/types/service-indication';

export interface IndicationServiceOption {
  id: string;
  name: string;
}

interface ServiceIndicationPanelProps {
  medicalRecordId: string;
  services: readonly IndicationServiceOption[];
  editable?: boolean;
}

function formatCreatedAt(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function IndicationItem({
  indication,
  medicalRecordId,
  editable,
}: {
  indication: ServiceIndicationResponse;
  medicalRecordId: string;
  editable: boolean;
}) {
  const [resultNote, setResultNote] = useState('');

  const completeMutation = useCompleteServiceIndication();

  const cancelMutation = useCancelServiceIndication();

  const isPending = indication.status === 'PENDING';

  const isMutating = completeMutation.isPending || cancelMutation.isPending;

  async function handleComplete(): Promise<void> {
    const normalizedResult = resultNote.trim();

    if (!normalizedResult) {
      toast.error('Vui lòng nhập kết quả');
      return;
    }

    try {
      await completeMutation.mutateAsync({
        medicalRecordId,
        indicationId: indication.id,
        request: {
          resultNote: normalizedResult,
        },
      });

      setResultNote('');
      toast.success('Đã hoàn tất chỉ định');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể hoàn tất chỉ định');
    }
  }

  async function handleCancel(): Promise<void> {
    const confirmed = window.confirm(`Hủy chỉ định "${indication.serviceName}"?`);

    if (!confirmed) return;

    try {
      await cancelMutation.mutateAsync({
        medicalRecordId,
        indicationId: indication.id,
      });

      toast.success('Đã hủy chỉ định');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể hủy chỉ định');
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-zinc-900 dark:text-white">{indication.serviceName}</p>

          <p className="mt-1 text-xs text-zinc-500">{formatCreatedAt(indication.createdAt)}</p>
        </div>

        <span
          className={[
            'rounded-full px-2.5 py-1 text-xs font-medium',
            indication.status === 'DONE'
              ? 'bg-emerald-100 text-emerald-700'
              : indication.status === 'CANCELLED'
                ? 'bg-zinc-100 text-zinc-600'
                : 'bg-amber-100 text-amber-700',
          ].join(' ')}
        >
          {indication.status === 'DONE'
            ? 'Hoàn tất'
            : indication.status === 'CANCELLED'
              ? 'Đã hủy'
              : 'Chờ xử lý'}
        </span>
      </div>

      {indication.resultNote && (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <span className="font-medium">Kết quả:</span> {indication.resultNote}
        </div>
      )}

      {editable && isPending && (
        <div className="mt-4 space-y-3">
          <textarea
            value={resultNote}
            onChange={(event) => setResultNote(event.target.value)}
            rows={3}
            maxLength={5000}
            placeholder="Nhập kết quả dịch vụ hoặc xét nghiệm..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-zinc-950"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={isMutating || !resultNote.trim()}
              onClick={() => void handleComplete()}
            >
              {completeMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 size-4" />
              )}
              Hoàn tất
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isMutating}
              onClick={() => void handleCancel()}
            >
              {cancelMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 size-4" />
              )}
              Hủy chỉ định
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceIndicationPanel({
  medicalRecordId,
  services,
  editable = true,
}: ServiceIndicationPanelProps) {
  const [serviceId, setServiceId] = useState('');

  const indicationsQuery = useServiceIndications(medicalRecordId, Boolean(medicalRecordId));

  const createMutation = useCreateServiceIndication();

  async function handleCreate(): Promise<void> {
    if (!serviceId) {
      toast.error('Vui lòng chọn dịch vụ');
      return;
    }

    try {
      await createMutation.mutateAsync({
        medicalRecordId,
        request: { serviceId },
      });

      setServiceId('');
      toast.success('Đã tạo chỉ định');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tạo chỉ định');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardPlus className="size-5 text-rose-500" />
          Chỉ định dịch vụ
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {editable && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
              className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="">Chọn dịch vụ hoặc xét nghiệm</option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>

            <Button
              type="button"
              disabled={createMutation.isPending || !serviceId}
              onClick={() => void handleCreate()}
            >
              {createMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <ClipboardPlus className="mr-2 size-4" />
              )}
              Thêm chỉ định
            </Button>
          </div>
        )}

        {indicationsQuery.isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-zinc-500">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Đang tải chỉ định...
          </div>
        )}

        {indicationsQuery.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Không thể tải danh sách chỉ định.
          </div>
        )}

        {!indicationsQuery.isLoading &&
          !indicationsQuery.isError &&
          indicationsQuery.data?.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-zinc-500">
              Chưa có chỉ định dịch vụ.
            </div>
          )}

        <div className="space-y-3">
          {indicationsQuery.data?.map((indication) => (
            <IndicationItem
              key={indication.id}
              indication={indication}
              medicalRecordId={medicalRecordId}
              editable={editable}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
