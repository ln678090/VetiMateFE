export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'ROLE_CHANGE';

export interface AuditLog {
  id: string;
  module: string;
  tableName: string;
  recordId: string | null;
  action: AuditAction;
  oldData: unknown | null;
  newData: unknown | null;
  createdBy: string | null;
  actorIdentifier: string | null;
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogFilters {
  actor?: string;
  module?: string;
  action?: AuditAction;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

export interface SpringPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
