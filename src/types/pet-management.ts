export type PetSpecies = 'DOG' | 'CAT';

export type PetHealthStatus = 'HEALTHY' | 'MONITORING' | 'TREATMENT' | 'CRITICAL' | 'RECOVERING';

export interface OwnerPet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  gender: string | null;
  birthDate: string | null;
  weightKg: number | null;
  customerId: string;
  customerName: string;
  currentHealthStatus: PetHealthStatus | null;
  currentHealthNote: string | null;
  lastExaminedAt: string | null;
}

export interface OwnerPetRequest {
  name: string;
  species: PetSpecies;
  breed: string | null;
  gender: string | null;
  birthDate: string | null;
  weightKg: number | null;
}

export interface ManagementPetRequest extends OwnerPetRequest {
  customerId: string;
}

export interface PetManagementSummary extends OwnerPet {
  customerPhone: string | null;
  customerEmail: string | null;
  deleted: boolean;
  deletedAt: string | null;
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

export interface ManagementPetFilters {
  keyword?: string;
  species?: PetSpecies;
  deleted?: boolean;
  customerId?: string;
  page?: number;
  size?: number;
  sort?: string;
}
