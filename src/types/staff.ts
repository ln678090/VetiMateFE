export type StaffRoleType =
  'DOCTOR' | 'RECEPTIONIST' | 'MANAGER' | 'ACCOUNTANT' | 'WAREHOUSE' | 'SHOP_STAFF';

export interface StaffResponse {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string | null;
  roleType: StaffRoleType;
  active: boolean;
  createdAt: string;
}

export interface EligibleUserResponse {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string | null;
}

export interface CreateStaffRequest {
  userId: string;
  roleType: StaffRoleType;
  reason: string;
}

export interface UpdateStaffRequest {
  roleType: StaffRoleType;
  active: boolean;
  reason: string;
}

export interface DeactivateStaffRequest {
  reason: string;
}

export interface StaffFilters {
  keyword?: string;
  roleType?: StaffRoleType;
  active?: boolean;
  page: number;
  size: number;
}

export interface EligibleUserFilters {
  keyword?: string;
  page: number;
  size: number;
}

export interface SpringPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

