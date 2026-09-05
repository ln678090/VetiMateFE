import { decodeJwt } from 'jose';
import type { User } from '@/types';

export type ApplicationRole =
  | 'ROLE_ADMIN'
  | 'ROLE_MANAGER'
  | 'ROLE_RECEPTIONIST'
  | 'ROLE_DOCTOR'
  | 'ROLE_USER';

function normalizeAuthority(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  if (!normalized) {
    return null;
  }

  return normalized.startsWith('ROLE_') ? normalized : `ROLE_${normalized}`;
}

function extractRoles(source: unknown): string[] {
  if (typeof source === 'string') {
    return source
      .split(/[,\s]+/)
      .map(normalizeAuthority)
      .filter((role): role is string => role !== null);
  }

  if (!Array.isArray(source)) {
    return [];
  }

  return source.map(normalizeAuthority).filter((role): role is string => role !== null);
}

export function getAuthoritiesFromToken(accessToken: string | null | undefined): string[] {
  if (!accessToken) {
    return [];
  }

  try {
    const claims = decodeJwt(accessToken);

    return [...new Set(extractRoles(claims.roles ?? claims.authorities ?? claims.role))];
  } catch {
    return [];
  }
}

export function getUserFromToken(accessToken: string | null | undefined): User | null {
  if (!accessToken) {
    return null;
  }

  try {
    const claims = decodeJwt(accessToken);
    const roles = [...new Set(extractRoles(claims.roles ?? claims.authorities ?? claims.role))];
    const email = typeof claims.email === 'string' ? claims.email : '';
    const fullName = typeof claims.fullName === 'string' ? claims.fullName : '';
    const sub = typeof claims.sub === 'string' ? claims.sub : '';

    return {
      id: sub,
      username: email ? email.split('@')[0] : sub,
      email,
      fullName: fullName || getRoleDisplayName(roles),
      enabled: true,
      roles,
    };
  } catch {
    return null;
  }
}

export function getRoleDisplayName(roles: readonly string[]): string {
  if (roles.includes('ROLE_ADMIN')) return 'Quản trị viên';
  if (roles.includes('ROLE_DOCTOR')) return 'Bác sĩ thú y';
  if (roles.includes('ROLE_MANAGER')) return 'Quản lý phòng khám';
  if (roles.includes('ROLE_RECEPTIONIST')) return 'Lễ tân';
  return 'Khách hàng';
}

export function getRoleInitials(roles: readonly string[], name?: string): string {
  if (roles.includes('ROLE_DOCTOR')) return 'BS';
  if (roles.includes('ROLE_ADMIN')) return 'AD';
  if (roles.includes('ROLE_RECEPTIONIST')) return 'LT';
  if (roles.includes('ROLE_MANAGER')) return 'QL';

  if (name && name !== 'Khách hàng' && name !== 'User') {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  return 'KH';
}

export function hasAuthority(authorities: readonly string[], authority: string): boolean {
  const normalized = normalizeAuthority(authority);

  return normalized ? authorities.includes(normalized) : false;
}
