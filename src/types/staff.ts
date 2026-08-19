export type StaffRoleType =
  | 'DOCTOR'
  | 'RECEPTIONIST'
  | 'MANAGER'
  | 'ACCOUNTANT'
  | 'WAREHOUSE'
  | 'SHOP_STAFF';

export interface StaffResponse {
  id: string;
  userId: string | null;
  fullName: string;
  phone: string | null;
  roleType: StaffRoleType;
  licenseNumber: string | null;
  baseSalary: number;
  commissionRate: number;
  active: boolean;
  createdAt: string;
}

export interface CreateStaffRequest {
  userId: string | null;
  fullName: string;
  phone: string | null;
  roleType: StaffRoleType;
  licenseNumber: string | null;
  baseSalary: number;
  commissionRate: number;
}

export interface UpdateStaffRequest extends CreateStaffRequest {
  active: boolean;
}

export interface StaffFilters {
  keyword?: string;
  roleType?: StaffRoleType;
  active?: boolean;
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
  empty: boolean;
}
