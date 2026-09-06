'use client';

import { useState } from 'react';

import { ChevronLeft, ChevronRight, FileClock, Search } from 'lucide-react';

import { useAuditLogs } from '@/hooks/use-audit-logs';
import type { AuditAction, AuditLog, AuditLogFilters } from '@/types/audit';
import { formatDateTime } from '@/lib/utils';

const ACTION_OPTIONS: Array<{
  value: AuditAction;
  label: string;
}> = [
  { value: 'INSERT', label: 'Tạo mới' },
  { value: 'UPDATE', label: 'Cập nhật' },
  { value: 'DELETE', label: 'Xóa' },
  { value: 'LOGIN', label: 'Đăng nhập' },
  { value: 'ROLE_CHANGE', label: 'Thay đổi quyền' },
];

const MODULE_OPTIONS = ['AUTH', 'RBAC', 'STAFF', 'CLINIC', 'SHOP', 'INVENTORY', 'BILLING'] as const;

interface FilterDraft {
  actor: string;
  module: string;
  action: '' | AuditAction;
  from: string;
  to: string;
}

const INITIAL_DRAFT: FilterDraft = {
  actor: '',
  module: '',
  action: '',
  from: '',
  to: '',
};

function getActionLabel(action: AuditAction): string {
  return ACTION_OPTIONS.find((option) => option.value === action)?.label ?? action;
}

function JsonViewer({ label, value }: { label: string; value: unknown }) {
  if (value == null) {
    return null;
  }

  return (
    <details className="rounded-lg border">
      <summary className="cursor-pointer px-3 py-2 text-sm font-medium">{label}</summary>

      <pre className="max-h-72 overflow-auto border-t bg-zinc-950 p-3 text-xs text-zinc-100">
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
}

function AuditDetails({ auditLog }: { auditLog: AuditLog }) {
  return (
    <details>
      <summary className="cursor-pointer text-sm font-medium text-rose-600 hover:text-rose-700">
        Xem chi tiết
      </summary>

      <div className="mt-3 grid gap-3">
        {auditLog.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{auditLog.description}</p>
        )}

        <div className="grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
          <span>Bảng: {auditLog.tableName}</span>

          <span>Mã bản ghi: {auditLog.recordId ?? 'Không có'}</span>

          <span>Mã người thực hiện: {auditLog.createdBy ?? 'Không có'}</span>

          <span>IP: {auditLog.ipAddress ?? 'Không có'}</span>

          {auditLog.userAgent && (
            <span className="break-all sm:col-span-2">Thiết bị: {auditLog.userAgent}</span>
          )}
        </div>

        <JsonViewer label="Dữ liệu trước thay đổi" value={auditLog.oldData} />

        <JsonViewer label="Dữ liệu sau thay đổi" value={auditLog.newData} />
      </div>
    </details>
  );
}

export default function AdminAuditLogsPage() {
  const [draft, setDraft] = useState<FilterDraft>(INITIAL_DRAFT);

  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 0,
    size: 20,
  });

  const auditLogsQuery = useAuditLogs(filters);
  const pageData = auditLogsQuery.data;

  const hasInvalidDateRange = Boolean(draft.from) && Boolean(draft.to) && draft.from > draft.to;

  function applyFilters(): void {
    if (hasInvalidDateRange) {
      return;
    }

    setFilters((current) => ({
      actor: draft.actor.trim() || undefined,
      module: draft.module || undefined,
      action: draft.action || undefined,

      // Chỉ truyền YYYY-MM-DD.
      // API service chịu trách nhiệm đổi sang Instant.
      from: draft.from || undefined,
      to: draft.to || undefined,

      page: 0,
      size: current.size,
    }));
  }

  function clearFilters(): void {
    setDraft(INITIAL_DRAFT);

    setFilters({
      page: 0,
      size: 20,
    });
  }

  function changePage(page: number): void {
    if (page < 0) {
      return;
    }

    setFilters((current) => ({
      ...current,
      page,
    }));
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 py-8">
      <header>
        <div className="flex items-center gap-3">
          <FileClock className="size-7 text-rose-600" />

          <h1 className="text-3xl font-bold">Nhật ký hệ thống</h1>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Theo dõi các thao tác quan trọng. Nhật ký chỉ được xem, không thể sửa hoặc xóa.
        </p>
      </header>

      <section className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-5 dark:bg-zinc-950">
        <label className="space-y-2">
          <span className="text-sm font-medium">Người thực hiện</span>

          <input
            value={draft.actor}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                actor: event.target.value,
              }))
            }
            placeholder="Email hoặc tên đăng nhập"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Phân hệ</span>

          <select
            value={draft.module}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                module: event.target.value,
              }))
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Tất cả</option>

            {MODULE_OPTIONS.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Hành động</span>

          <select
            value={draft.action}
            onChange={(event) => {
              const action = event.target.value as '' | AuditAction;

              setDraft((current) => ({
                ...current,
                action,
              }));
            }}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Tất cả</option>

            {ACTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Từ ngày</span>

          <input
            type="date"
            value={draft.from}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                from: event.target.value,
              }))
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Đến ngày</span>

          <input
            type="date"
            value={draft.to}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                to: event.target.value,
              }))
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        {hasInvalidDateRange && (
          <p className="text-sm text-red-600 md:col-span-2 lg:col-span-5">
            Ngày bắt đầu không được sau ngày kết thúc.
          </p>
        )}

        <div className="flex gap-2 md:col-span-2 lg:col-span-5">
          <button
            type="button"
            disabled={hasInvalidDateRange}
            onClick={applyFilters}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-rose-600 px-4 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="size-4" />
            Tìm kiếm
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted"
          >
            Xóa bộ lọc
          </button>
        </div>
      </section>

      {auditLogsQuery.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Không tải được nhật ký hệ thống. Vui lòng kiểm tra quyền Admin và kết nối backend.
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Người thực hiện</th>
                <th className="px-4 py-3">Phân hệ</th>
                <th className="px-4 py-3">Hành động</th>
                <th className="px-4 py-3">Đối tượng</th>
                <th className="px-4 py-3">Chi tiết</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {auditLogsQuery.isPending && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Đang tải nhật ký...
                  </td>
                </tr>
              )}

              {!auditLogsQuery.isPending &&
                !auditLogsQuery.isError &&
                pageData?.content.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      Không có nhật ký phù hợp.
                    </td>
                  </tr>
                )}

              {pageData?.content.map((auditLog) => (
                <tr
                  key={auditLog.id}
                  className="align-top hover:bg-zinc-50/70 dark:hover:bg-zinc-900/60"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDateTime(auditLog.createdAt)}
                  </td>

                  <td className="px-4 py-3">{auditLog.actorIdentifier ?? 'Hệ thống'}</td>

                  <td className="px-4 py-3">{auditLog.module}</td>

                  <td className="px-4 py-3">{getActionLabel(auditLog.action)}</td>

                  <td className="px-4 py-3">{auditLog.tableName}</td>

                  <td className="px-4 py-3">
                    <AuditDetails auditLog={auditLog} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageData && pageData.totalPages > 0 && (
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Tổng {pageData.totalElements} bản ghi
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pageData.first || auditLogsQuery.isFetching}
                onClick={() => changePage(pageData.number - 1)}
                className="inline-flex size-9 items-center justify-center rounded-md border disabled:opacity-40"
                aria-label="Trang trước"
              >
                <ChevronLeft className="size-4" />
              </button>

              <span className="text-sm">
                Trang {pageData.number + 1}/{pageData.totalPages}
              </span>

              <button
                type="button"
                disabled={pageData.last || auditLogsQuery.isFetching}
                onClick={() => changePage(pageData.number + 1)}
                className="inline-flex size-9 items-center justify-center rounded-md border disabled:opacity-40"
                aria-label="Trang sau"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </footer>
        )}
      </section>
    </main>
  );
}
