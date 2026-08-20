'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Plus,
  Power,
  Save,
  Settings2,
  Trash2,
  X,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  useClinicServices,
  useCreateClinicService,
  useDeleteClinicService,
  useUpdateClinicService,
} from '@/features/clinic-services/hooks/use-clinic-services';

import { clinicServiceSchema, type ClinicServiceFormValues } from '@/schemas/clinic-service.schema';

import type { ClinicService, ClinicServiceRequest } from '@/types/clinic-service';

import { formatVND } from '@/lib/utils';
import { getApiErrorMessage } from '@/lib/axios';
const PAGE_SIZE = 10;

const DEFAULT_VALUES: ClinicServiceFormValues = {
  name: '',
  description: '',
  price: 0,
  durationMin: 30,
  isActive: true,
};

export default function ServiceManagementPage() {
  const [page, setPage] = useState(0);
  const [activeOnly, setActiveOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingService, setEditingService] = useState<ClinicService | null>(null);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const servicesQuery = useClinicServices({
    activeOnly,
    page,
    size: PAGE_SIZE,
  });

  const createMutation = useCreateClinicService();
  const updateMutation = useUpdateClinicService();
  const deleteMutation = useDeleteClinicService();

  const form = useForm<ClinicServiceFormValues>({
    resolver: zodResolver(clinicServiceSchema),
    mode: 'onBlur',
    defaultValues: DEFAULT_VALUES,
  });

  const services = servicesQuery.data?.content ?? [];
  const totalPages = servicesQuery.data?.totalPages ?? 0;
  const totalElements = servicesQuery.data?.totalElements ?? 0;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openCreateForm() {
    setEditingService(null);
    form.reset(DEFAULT_VALUES);
    setShowForm(true);
  }

  function openEditForm(service: ClinicService) {
    setEditingService(service);

    form.reset({
      name: service.name,
      description: service.description ?? '',
      price: service.price,
      durationMin: service.durationMin,
      isActive: service.isActive,
    });

    setShowForm(true);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setShowForm(false);
    setEditingService(null);
    form.reset(DEFAULT_VALUES);
  }

  function toRequest(values: ClinicServiceFormValues): ClinicServiceRequest {
    return {
      name: values.name.trim(),
      description: values.description.trim() || null,
      price: values.price,
      durationMin: values.durationMin,
      isActive: values.isActive,
    };
  }

  async function submitForm(values: ClinicServiceFormValues) {
    const request = toRequest(values);

    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          serviceId: editingService.id,
          request,
        });

        toast.success('Đã cập nhật dịch vụ');
      } else {
        await createMutation.mutateAsync(request);
        toast.success('Đã tạo dịch vụ');
      }

      closeForm();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function toggleStatus(service: ClinicService) {
    try {
      await updateMutation.mutateAsync({
        serviceId: service.id,
        request: {
          name: service.name,
          description: service.description,
          price: service.price,
          durationMin: service.durationMin,
          isActive: !service.isActive,
        },
      });

      toast.success(service.isActive ? 'Đã ngừng cung cấp dịch vụ' : 'Đã kích hoạt dịch vụ');
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function deleteService(serviceId: string) {
    try {
      await deleteMutation.mutateAsync(serviceId);

      toast.success('Đã xóa dịch vụ');
      setPendingDeleteId(null);

      if (services.length === 1 && page > 0) {
        setPage((current) => current - 1);
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-rose-600">Quản lý phòng khám</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">Dịch vụ & bảng giá</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Quản lý giá, thời lượng và trạng thái cung cấp của các dịch vụ.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-orange-500 px-4 text-sm font-semibold text-white shadow-sm hover:brightness-105"
        >
          <Plus className="size-4" />
          Thêm dịch vụ
        </button>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-xl">
        <label className="inline-flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(event) => {
              setActiveOnly(event.target.checked);
              setPage(0);
            }}
            className="size-4 rounded border-zinc-300 accent-rose-600"
          />
          Chỉ hiển thị dịch vụ đang hoạt động
        </label>

        <p className="text-sm text-muted-foreground">
          Tổng cộng: <strong className="text-foreground">{totalElements}</strong> dịch vụ
        </p>
      </section>

      {servicesQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      )}

      {servicesQuery.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Không tải được danh sách dịch vụ: {servicesQuery.error.message}
        </div>
      )}

      {!servicesQuery.isLoading && !servicesQuery.isError && services.length === 0 && (
        <div className="rounded-2xl border border-dashed p-14 text-center">
          <Settings2 className="mx-auto size-10 text-muted-foreground" />

          <p className="mt-3 font-medium">Chưa có dịch vụ phù hợp</p>

          <p className="text-sm text-muted-foreground">
            Thêm dịch vụ mới hoặc bỏ bộ lọc đang hoạt động.
          </p>
        </div>
      )}

      {services.length > 0 && (
        <section className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-zinc-50 text-left">
                <tr>
                  <th className="px-5 py-3 font-semibold">Dịch vụ</th>
                  <th className="px-5 py-3 font-semibold">Giá</th>
                  <th className="px-5 py-3 font-semibold">Thời lượng</th>
                  <th className="px-5 py-3 font-semibold">Trạng thái</th>
                  <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {services.map((service) => (
                  <tr key={service.id} className="transition hover:bg-zinc-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{service.name}</p>

                      <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                        {service.description || 'Chưa có mô tả'}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-medium">{formatVND(service.price)}</td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="size-4 text-muted-foreground" />
                        {service.durationMin} phút
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          service.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {service.isActive ? 'Đang hoạt động' : 'Đã ngừng'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {pendingDeleteId === service.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-red-600">Xác nhận xóa?</span>

                          <button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={() => void deleteService(service.id)}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                          >
                            Xóa
                          </button>

                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                            className="rounded-md border px-3 py-1.5 text-xs"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditForm(service)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            aria-label={`Sửa ${service.name}`}
                          >
                            <Pencil className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => void toggleStatus(service)}
                            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                            aria-label={service.isActive ? 'Ngừng dịch vụ' : 'Kích hoạt dịch vụ'}
                          >
                            <Power className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(service.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            aria-label={`Xóa ${service.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-between">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((current) => current - 1)}
            className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
            Trang trước
          </button>

          <span className="text-sm text-muted-foreground">
            Trang {page + 1}/{totalPages}
          </span>

          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm disabled:opacity-50"
          >
            Trang sau
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-form-title"
        >
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 id="service-form-title" className="text-xl font-bold">
                  {editingService ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Giá và thời lượng sẽ được dùng khi đặt lịch mới.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Đóng"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="mt-6 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </span>

                <input
                  {...form.register('name')}
                  className="h-10 w-full rounded-md border px-3 text-sm"
                />

                {form.formState.errors.name && (
                  <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
                )}
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Mô tả</span>

                <textarea
                  {...form.register('description')}
                  rows={4}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />

                {form.formState.errors.description && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">
                    Giá dịch vụ <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="number"
                    min={1}
                    step={1000}
                    {...form.register('price', {
                      valueAsNumber: true,
                    })}
                    className="h-10 w-full rounded-md border px-3 text-sm"
                  />

                  {form.formState.errors.price && (
                    <p className="text-xs text-red-600">{form.formState.errors.price.message}</p>
                  )}
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">
                    Thời lượng (phút) <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="number"
                    min={5}
                    step={5}
                    {...form.register('durationMin', {
                      valueAsNumber: true,
                    })}
                    className="h-10 w-full rounded-md border px-3 text-sm"
                  />

                  {form.formState.errors.durationMin && (
                    <p className="text-xs text-red-600">
                      {form.formState.errors.durationMin.message}
                    </p>
                  )}
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  {...form.register('isActive')}
                  className="size-4 accent-rose-600"
                />

                <span>
                  <span className="block text-sm font-medium">Đang cung cấp dịch vụ</span>

                  <span className="text-xs text-muted-foreground">
                    Dịch vụ hoạt động sẽ xuất hiện trong form đặt lịch.
                  </span>
                </span>
              </label>
            </div>

            <footer className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-rose-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Save className="size-4" />
                {isSaving ? 'Đang lưu...' : 'Lưu dịch vụ'}
              </button>
            </footer>
          </form>
        </div>
      )}
    </main>
  );
}
