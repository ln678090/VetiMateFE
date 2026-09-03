import { decodeJwt } from 'jose';

export type ApplicationRole =
  | 'ROLE_ADMIN'
  | 'ROLE_MANAGER'
  | 'ROLE_RECEPTIONIST'
  | 'ROLE_DOCTOR'
  | 'ROLE_ACCOUNTANT'
  | 'ROLE_SHOP_STAFF'
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

export function hasAuthority(authorities: readonly string[], authority: string): boolean {
  const normalized = normalizeAuthority(authority);

  return normalized ? authorities.includes(normalized) : false;
}
