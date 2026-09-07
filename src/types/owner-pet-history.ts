export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'DONE' | 'CANCELLED' | 'NO_SHOW';

export type PetHealthStatus = 'HEALTHY' | 'MONITORING' | 'TREATMENT' | 'CRITICAL' | 'RECOVERING';

export interface OwnerAppointmentStatus {
  appointmentId: string;
  status: AppointmentStatus;
  startAt: string;
  serviceName: string;
}

export interface OwnerVisitHistory {
  medicalRecordId: string;
  appointmentId: string;
  examinedAt: string;
  completedAt: string;
  doctorName: string;
  serviceName: string;
  healthStatus: PetHealthStatus | null;
  weightKg: number | null;
  diagnosis: string | null;
  treatmentPlan: string | null;
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
