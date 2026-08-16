import type { AuthState, User } from '@/types';
import { create } from 'zustand';

interface AuthStore extends AuthState {
  setAuth: (payload: { user: User | null; accessToken: string | null }) => void;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setHydrating: (v: boolean) => void;
  clear: () => void;
}

/**
 * ⚠️ SECURITY: Store này KHÔNG persist vào localStorage/sessionStorage.
 * Access token chỉ sống trong memory → reload trang sẽ mất →
 * useAuth hook sẽ gọi /refresh để khôi phục (refresh_token nằm trong HttpOnly cookie).
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrating: true,

  setAuth: ({ user, accessToken }) => {
    let decodedUser = user;
    if (!decodedUser && accessToken) {
      try {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        let parsedRoles: string[] = [];
        if (Array.isArray(payload.roles)) {
          parsedRoles = payload.roles;
        } else if (typeof payload.roles === 'string') {
          parsedRoles = [payload.roles];
        } else if (payload.role) {
          parsedRoles = Array.isArray(payload.role) ? payload.role : [payload.role];
        }

        decodedUser = {
          id: payload.sub || '',
          email: payload.email || '',
          username: payload.username || '',
          fullName: payload.fullName || '',
          enabled: true,
          roles: parsedRoles,
        };
      } catch (e) {
        // ignore
      }
    }
    return set({
      user: decodedUser,
      accessToken,
      isAuthenticated: !!accessToken,
      isHydrating: false,
    });
  },

  setAccessToken: (token) =>
    set((s) => ({
      accessToken: token,
      isAuthenticated: !!token,
      // giữ user cũ nếu chỉ refresh token
      user: token ? s.user : null,
    })),

  setUser: (user) => set({ user }),

  setHydrating: (v) => set({ isHydrating: v }),

  clear: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrating: false,
    }),
}));

/** Selector helpers — tránh re-render không cần thiết */
export const selectAccessToken = (s: AuthStore) => s.accessToken;
export const selectIsAuthenticated = (s: AuthStore) => s.isAuthenticated;
export const selectUser = (s: AuthStore) => s.user;
