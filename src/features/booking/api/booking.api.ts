import { api, unwrap } from '@/lib/axios';
import type {
  ClinicServiceDto,
  PetDto,
  AppointmentDto,
  CreateAppointmentRequest,
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
    api.get('/api/clinic/services', { params: { activeOnly: true } }),
  );
  return toArray(data);
}

// GET /api/clinic/pets?customerId=...
export async function getMyPets(customerId: string): Promise<PetDto[]> {
  const data = await unwrap<PetDto[] | SpringPage<PetDto>>(
    api.get('/api/clinic/pets', { params: { customerId } }),
  );
  return toArray(data);
}

// POST /api/clinic/appointments
export async function createAppointment(
  body: CreateAppointmentRequest,
): Promise<AppointmentDto> {
  return unwrap<AppointmentDto>(api.post('/api/clinic/appointments', body));
}

// GET /api/clinic/appointments?customerId=...
export async function getMyAppointments(
  customerId: string,
): Promise<AppointmentDto[]> {
  const data = await unwrap<AppointmentDto[] | SpringPage<AppointmentDto>>(
    api.get('/api/clinic/appointments', { params: { customerId } }),
  );
  return toArray(data);
}
