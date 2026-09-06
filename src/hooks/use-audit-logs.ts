import { useQuery } from '@tanstack/react-query';

import { auditLogApi } from '@/services/audit-log.api';
import type { AuditLogFilters } from '@/types/audit';

export const AUDIT_LOG_QUERY_KEYS = {
  all: ['admin', 'audit-logs'] as const,

  list: (filters: AuditLogFilters) => [...AUDIT_LOG_QUERY_KEYS.all, filters] as const,
};

export function useAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: AUDIT_LOG_QUERY_KEYS.list(filters),
    queryFn: () => auditLogApi.search(filters),
    staleTime: 30_000,
    placeholderData: (previousData) => previousData,
  });
}
