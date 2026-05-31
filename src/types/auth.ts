/** Khớp với AuthResponse từ backend Java */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string | null; // null trên web (cookie), có giá trị trên mobile
  tokenType: 'Bearer' | string;
}

/** User info (mở rộng sau khi backend có endpoint /me) */
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  enabled: boolean;
  roles: string[];
}

/** State trong Zustand store */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
}
