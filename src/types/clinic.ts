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
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
}

export type AppointmentStatus =
  | 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DONE' | 'CANCELLED';

export interface AppointmentDto {
  id: string;
  customerId: string;
  petId: string;
  petName: string;
  serviceId: string;
  serviceName: string;
  startAt: string;   // ISO
  endAt: string;     // ISO
  priceSnapshot: number;
  durationMin: number;
  status: AppointmentStatus;
  note: string | null;
}

// Body POST /api/clinic/appointments — CHỈ 4 field (anti-tamper)
export interface CreateAppointmentRequest {
  petId: string;
  serviceId: string;
  startAt: string;  // ISO
  note?: string;
}

export type PetSpecies = 'DOG' | 'CAT';

export const PET_SPECIES_OPTIONS: { value: PetSpecies; label: string }[] = [
  { value: 'DOG', label: 'Chó' },
  { value: 'CAT', label: 'Mèo' },
];

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
