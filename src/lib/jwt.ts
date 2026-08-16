import type { User } from '@/types/auth';

/**
 * Decode JWT payload (không verify chữ ký — việc verify do backend lo).
 * Trả về User object từ các claims trong access token.
 */
export function decodeJwtUser(token: string): User | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64 → decode
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const json = JSON.parse(atob(payload));

    return {
      id: json.sub ?? '',
      email: json.email ?? '',
      username: json.username ?? '',
      fullName: json.fullName ?? '',
      enabled: true,
      roles: json.roles ? json.roles.split(' ') : [],
    };
  } catch {
    return null;
  }
}
