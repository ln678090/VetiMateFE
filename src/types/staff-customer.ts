export type StaffCustomerFilter = 'ALL' | 'TODAY' | 'UPCOMING' | 'COMPLETED' | 'NO_APPOINTMENT';

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'DONE' | 'CANCELLED' | 'NO_SHOW';

export interface StaffCustomerSummary {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  petCount: number;
  latestAppointmentStatus: AppointmentStatus | null;
  latestAppointmentAt: string | null;
}

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface StaffCustomerSearchParams {
  keyword: string;
  filter: StaffCustomerFilter;
  page: number;
  size: number;
}
