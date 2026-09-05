import { getUserFromToken } from '@/lib/auth-roles';
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

  setAuth: ({ user, accessToken }) =>
    set({
      user: user ?? getUserFromToken(accessToken),
      accessToken,
      isAuthenticated: !!accessToken,
      isHydrating: false,
    }),

  setAccessToken: (token) =>
    set((s) => ({
      accessToken: token,
      isAuthenticated: !!token,
      user: token ? (s.user ?? getUserFromToken(token)) : null,
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
