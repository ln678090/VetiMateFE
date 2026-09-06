import { api } from '@/lib/axios';
import type { AuditLog, AuditLogFilters, SpringPage } from '@/types/audit';

function toStartOfDay(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function toEndOfDay(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T23:59:59.999`);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export const auditLogApi = {
  async search(filters: AuditLogFilters): Promise<SpringPage<AuditLog>> {
    const response = await api.get<SpringPage<AuditLog>>('/api/admin/audit-logs', {
      params: {
        actor: filters.actor || undefined,
        module: filters.module || undefined,
        action: filters.action || undefined,
        from: toStartOfDay(filters.from),
        to: toEndOfDay(filters.to),
        page: filters.page,
        size: filters.size,
      },
    });

    return response.data;
  },
};
