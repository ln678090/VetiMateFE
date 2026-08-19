export interface ClinicService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicServiceRequest {
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  isActive: boolean;
}

export interface ClinicServiceFilters {
  activeOnly: boolean;
  page: number;
  size: number;
}
