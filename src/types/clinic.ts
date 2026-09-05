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
  photoUrl?: string | null;
  currentHealthStatus?: string | null;
  currentHealthNote?: string | null;
  note: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface UpdateCustomerRequest {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface MergeCustomerRequest {
  targetId: string;
  sourceId: string;
}

export interface MergePetRequest {
  targetId: string;
  sourceId: string;
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
  photoUrl?: string | null;
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
  customerId?: string;
  name: string;
  species: PetSpecies;
  breed?: string | null;
  gender?: PetGender | null;
  birthDate?: string | null; // yyyy-MM-dd
  weightKg?: number | null;
  photoUrl?: string | null;
  note?: string | null;
}

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'DONE' | 'CANCELLED' | 'NO_SHOW';

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
  date: string;
  status?: AppointmentStatus;
  page?: number;
  size?: number;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
}

// ============ DAILY CARE TASKS ============
export type DailyTaskType = 'POST_OP_CALL' | 'VACCINE_REMINDER';
export type DailyTaskStatus = 'PENDING' | 'CALLED' | 'COMPLETED' | 'CANCELLED';

export interface DailyCareTaskDto {
  id: string;
  taskDate: string;
  taskType: DailyTaskType;
  petId: string | null;
  petName: string | null;
  petSpecies: string | null;
  petBreed: string | null;
  petPhotoUrl: string | null;
  customerId: string | null;
  customerName: string | null;
  phone: string;
  appointmentId: string | null;
  serviceName: string | null;
  title: string;
  description: string;
  status: DailyTaskStatus;
  callResult: string | null;
  notes: string | null;
  performedById: string | null;
  performedByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDailyTaskRequest {
  status?: DailyTaskStatus;
  callResult?: string;
  notes?: string;
  performedById?: string;
}

// ============ SMART QUEUE & TV DISPLAY ============
export type QueueLaneType = 'CLINIC' | 'SPA';
export type QueueTicketStatus = 'WAITING' | 'CALLED' | 'DONE' | 'CANCELLED';

export interface QueueTicketDto {
  id: string;
  appointmentId: string | null;
  queueDate: string;
  queueType: QueueLaneType;
  ticketNumber: number;
  formattedTicket: string;
  status: QueueTicketStatus;
  calledAt: string | null;
  completedAt: string | null;
  petName: string;
  customerName: string;
  serviceName: string;
  roomCounter: string;
  doctorOrStaffName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QueueLaneDto {
  laneType: QueueLaneType;
  title: string;
  currentServing: QueueTicketDto | null;
  waitingList: QueueTicketDto[];
  calledHistory: QueueTicketDto[];
  totalWaiting: number;
  totalServed: number;
}

export interface LobbyQueueBoardDto {
  queueDate: string;
  clinicLane: QueueLaneDto;
  spaLane: QueueLaneDto;
  lastCalledTicket: QueueTicketDto | null;
}

export interface IssueTicketRequest {
  appointmentId?: string;
  queueType: QueueLaneType;
  petName?: string;
  customerName?: string;
  serviceName?: string;
  roomCounter?: string;
  doctorOrStaffName?: string;
}

export interface CallTicketRequest {
  ticketId?: string;
  queueType?: QueueLaneType;
  roomCounter?: string;
  doctorOrStaffName?: string;
}

