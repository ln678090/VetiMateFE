export type PetHealthStatus = 'HEALTHY' | 'MONITORING' | 'TREATMENT' | 'CRITICAL' | 'RECOVERING';

export type MedicalRecordStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface MedicineOptionResponse {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  sellPrice: number;
}

export interface PrescriptionItemRequest {
  medicineId: string;
  quantity: number;
  dosage: string;
  durationDays: number;
  note: string;
}

export interface ReplacePrescriptionsRequest {
  items: PrescriptionItemRequest[];
}

export interface PrescriptionItemResponse {
  id: string;
  medicineId: string;
  medicineName: string;
  sku: string | null;
  unit: string;
  quantity: number;
  dosage: string;
  durationDays: number;
  note: string | null;
}

export interface SaveExaminationRequest {
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  weightKg: number | null;
  healthStatus: PetHealthStatus;
  doctorNote: string;
}

export interface MedicalRecordResponse {
  id: string;
  appointmentId: string;
  petId: string;
  doctorId: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatmentPlan: string | null;
  weightKg: number | null;
  healthStatus: PetHealthStatus;
  doctorNote: string | null;
  status: MedicalRecordStatus;
  createdAt: string;
  updatedAt: string;
  prescriptions: PrescriptionItemResponse[];
}

export interface ExaminationHistoryItem {
  id: string;
  appointmentId: string;
  petId: string;
  petName: string;
  diagnosis: string | null;
  healthStatus: PetHealthStatus;
  weightKg: number | null;
  completedAt: string;
}
