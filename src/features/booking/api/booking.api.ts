// src/feature/booking/api/booking.api.ts

import { api, unwrap } from '@/lib/axios';
import type {
  ClinicServiceDto,
  PetDto,
  AppointmentDto,
  CreateAppointmentRequest,
  CreatePetRequest,
  CustomerDto,
  UpdatePetRequest,
} from '@/types/clinic';

// Spring Page<T> shape
interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// Helper: chấp nhận cả T[] hoặc Page<T>, luôn trả về T[]
function toArray<T>(data: T[] | SpringPage<T>): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as SpringPage<T>).content)) {
    return (data as SpringPage<T>).content;
  }
  return [];
}

// GET /api/clinic/services?activeOnly=true
export async function getActiveServices(): Promise<ClinicServiceDto[]> {
  const data = await unwrap<ClinicServiceDto[] | SpringPage<ClinicServiceDto>>(
    api.get('/api/clinic/services', { params: { activeOnly: true } })
  );
  return toArray(data);
}

// GET /api/clinic/pets?customerId=...
export async function getMyPets(customerId: string): Promise<PetDto[]> {
  const data = await unwrap<PetDto[] | SpringPage<PetDto>>(
    api.get('/api/clinic/pets', { params: { customerId } })
  );
  return toArray(data);
}

// POST /api/clinic/appointments
export async function createAppointment(body: CreateAppointmentRequest): Promise<AppointmentDto> {
  return unwrap<AppointmentDto>(api.post('/api/clinic/appointments', body));
}

// GET /api/clinic/appointments?customerId=...
export async function getMyAppointments(customerId: string): Promise<AppointmentDto[]> {
  const data = await unwrap<AppointmentDto[] | SpringPage<AppointmentDto>>(
    api.get('/api/clinic/appointments', { params: { customerId } })
  );
  return toArray(data);
}

// POST /api/clinic/pets — tạo thú cưng mới
export async function createPet(body: CreatePetRequest): Promise<PetDto> {
  return unwrap<PetDto>(api.post('/api/clinic/pets', body));
}
export async function getMyCustomer(): Promise<CustomerDto> {
  return unwrap<CustomerDto>(api.get('/api/clinic/customers/me/customer'));
}

export interface AvailableSlotResponse {
  startTime: string; // "08:00"
  endTime: string; // "08:30"
  available: boolean;
}

/**
 * Lấy danh sách khung giờ trống cho dịch vụ trong ngày
 * GET /api/clinic/services/{id}/available-slots?date=yyyy-MM-dd
 *
 * BE sinh slot từ 8h-17h theo duration_min của service,
 * loại bỏ slot đã có lịch + slot quá khứ
 */
export async function getAvailableSlots(
  serviceId: string,
  date: string // format: yyyy-MM-dd
): Promise<AvailableSlotResponse[]> {
  const data = await unwrap<AvailableSlotResponse[]>(
    api.get(`/api/clinic/services/${serviceId}/available-slots`, {
      params: { date },
    })
  );
  return data;
}
// ============ UPDATE PET ============
// PUT /api/clinic/pets/{id}
export async function updatePet(petId: string, body: UpdatePetRequest): Promise<PetDto> {
  return unwrap<PetDto>(api.put(`/api/clinic/pets/${petId}`, body));
}

// ============ DELETE PET (soft) ============
// DELETE /api/clinic/pets/{id}
export async function deletePet(petId: string): Promise<void> {
  await api.delete(`/api/clinic/pets/${petId}`);
}

// ============ GET SINGLE PET ============
// GET /api/clinic/pets/{id}
export async function getPetById(petId: string): Promise<PetDto> {
  return unwrap<PetDto>(api.get(`/api/clinic/pets/${petId}`));
}
