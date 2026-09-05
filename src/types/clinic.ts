// Types khớp DTO backend (com.graduation.project.clinic.dto)
export interface ClinicServiceDto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  isActive: boolean;
}

export interface PetDto {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  gender: PetGender | null;
  birthDate: string | null;
  weightKg: number | null;
  note: string | null;
}

export interface AppointmentDto {
  id: string;
  customerId: string;
  customerName: string;
  petId: string;
  petName: string;
  serviceId: string;
  serviceName: string;
  startAt: string; // ISO
  endAt: string; // ISO
  priceSnapshot: number;
  durationMin: number;
  status: AppointmentStatus;
  note: string | null;
  isCalledToConfirm: boolean;
}

// Body POST /api/clinic/appointments — CHỈ 4 field (anti-tamper)
export interface CreateAppointmentRequest {
  petId: string;
  serviceId: string;
  startAt: string; // ISO
  note?: string;
}

export const PET_SPECIES_OPTIONS: { value: PetSpecies; label: string }[] = [
  { value: 'DOG', label: 'Chó' },
  { value: 'CAT', label: 'Mèo' },
];
export type PetSpecies = 'DOG' | 'CAT';

export type PetGender = 'MALE' | 'FEMALE' | 'UNKNOWN';
export interface CustomerDto {
  id: string;
  userId: string | null;
  fullName: string | null;
  phone: string | null;
}

export interface AvailableSlotDto {
  startAt: string; // ISO instant
  endAt: string;
  available: boolean;
}

// Body POST /api/clinic/pets — khớp PetRequest (BE)
export interface CreatePetRequest {
  customerId: string;
  name: string;
  species: PetSpecies; // 'DOG' | 'CAT'
  breed?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN' | null;
  birthDate?: string | null; // 'yyyy-MM-dd'
  weightKg?: number | null;
  note?: string | null;
}

// ============ PET GENDER OPTIONS ============
export const PET_GENDER_OPTIONS = [
  { value: 'MALE', label: 'Đực' },
  { value: 'FEMALE', label: 'Cái' },
  { value: 'UNKNOWN', label: 'Không xác định' },
] as const;

// ============ UPDATE PET REQUEST ============
export interface UpdatePetRequest {
  name: string;
  species: PetSpecies;
  breed?: string | null;
  gender?: PetGender | null;
  birthDate?: string | null; // yyyy-MM-dd
  weightKg?: number | null;
  note?: string | null;
}

export type AppointmentStatus =
  'SCHEDULED' | 'CONFIRMED' | 'DONE' | 'CANCELLED' | 'NO_SHOW' | 'ARRIVED';

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ManagementAppointmentParams {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
  page?: number;
  size?: number;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
}
// fix
