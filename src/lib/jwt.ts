import type { User } from '@/types/auth';

/**
 * Decode JWT payload (không verify chữ ký — việc verify do backend lo).
 * Trả về User object từ các claims trong access token.
 */
export function decodeJwtUser(token: string): User | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64 → decode (UTF-8 safe)
    const base64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const binaryStr = atob(base64);
    const jsonStr = decodeURIComponent(
      binaryStr
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const json = JSON.parse(jsonStr);

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
