export interface MedicineOption {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  sellPrice: number;
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  unit: string;
  quantity: number;
  dosage: string;
  durationDays: number | null;
  note: string | null;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  petId: string;
  doctorId: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatmentPlan: string | null;
  weightKg: number | null;
  doctorNote: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  prescriptions: PrescriptionItem[];
}

export interface SaveExaminationRequest {
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  weightKg: number | null;
  doctorNote: string;
}

export interface PrescriptionInput {
  medicineId: string;
  quantity: number;
  dosage: string;
  durationDays: number;
  note: string;
}

export interface ApiResp<T> {
  message: string;
  data: T;
  timestamp: string;
}

export interface MedicineOption {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  sellPrice: number;
}

export interface PrescriptionResponse {
  id: string;
  medicineId: string;
  medicineName: string;
  unit: string;
  quantity: number;
  dosage: string;
  durationDays: number;
  note: string | null;
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
  doctorNote: string | null;
  status: MedicalRecordStatus;
  createdAt: string;
  updatedAt: string;
  prescriptions: PrescriptionResponse[];
}

export interface SaveExaminationRequest {
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  weightKg: number | null;
  doctorNote: string;
}
export interface ReplacePrescriptionsRequest {
  items: PrescriptionItemRequest[];
}

export type MedicalRecordStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface SaveExaminationRequest {
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  weightKg: number | null;
  doctorNote: string;
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

export interface PrescriptionResponse {
  id: string;
  medicineId: string;
  medicineName: string;
  unit: string;
  quantity: number;
  dosage: string;
  durationDays: number;
  note: string | null;
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
  doctorNote: string | null;
  status: MedicalRecordStatus;
  createdAt: string;
  updatedAt: string;
  prescriptions: PrescriptionResponse[];
}

export interface MedicineOptionResponse {
  id: string;
  name: string;
  sku: string;
  unit: string;
  sellPrice: number;
}

export interface ExaminationHistoryItem {
  id: string;
  appointmentId: string;
  petId: string;
  petName: string;
  diagnosis: string | null;
  status: 'COMPLETED';
  completedAt: string;
}
