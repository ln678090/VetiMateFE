export type PetHealthStatus = 'HEALTHY' | 'MONITORING' | 'TREATMENT' | 'CRITICAL' | 'RECOVERING';

export type MedicalRecordStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface MedicineOptionResponse {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  sellPrice: number;
  activeIngredient?: string | null;
  usageInstructions?: string | null;
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
  activeIngredient?: string | null;
}

export interface SaveExaminationRequest {
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  weightKg: number | null;
  healthStatus: PetHealthStatus;
  doctorNote: string;
  temperatureC?: number | null;
  heartRateBpm?: number | null;
  respiratoryRate?: number | null;
  bloodPressure?: string | null;
  followUpDate?: string | null;
  complianceScore?: number | null;
  protocolCode?: string | null;
}

export interface MedicalRecordResponse {
  id: string;
  appointmentId: string | null;
  petId: string;
  doctorId: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatmentPlan: string | null;
  weightKg: number | null;
  healthStatus: PetHealthStatus;
  doctorNote: string | null;
  temperatureC?: number | null;
  heartRateBpm?: number | null;
  respiratoryRate?: number | null;
  bloodPressure?: string | null;
  followUpDate?: string | null;
  complianceScore?: number | null;
  protocolCode?: string | null;
  isWalkIn?: boolean;
  status: MedicalRecordStatus;
  createdAt: string;
  updatedAt: string;
  prescriptions: PrescriptionItemResponse[];
}

export interface ExaminationHistoryItem {
  id: string;
  appointmentId: string | null;
  petId: string;
  petName: string;
  diagnosis: string | null;
  healthStatus: PetHealthStatus;
  weightKg: number | null;
  completedAt: string;
}

// 1. DRUG SAFETY & ALLERGIES
export interface DrugSafetyAlert {
  type: 'DRUG_INTERACTION' | 'ALLERGY_CONTRAINDICATION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  medicineAName?: string;
  medicineBName?: string;
  allergenName?: string;
}

export interface DrugSafetyCheckResponse {
  hasCriticalAlert: boolean;
  totalAlerts: number;
  alerts: DrugSafetyAlert[];
}

// 2. LAB RESULTS (Chỉ số máu / Nước tiểu)
export interface LabResultItem {
  id?: string;
  testType: 'BLOOD_CBC' | 'BIOCHEMISTRY' | 'URINALYSIS' | 'RAPID_TEST' | 'ULTRASOUND';
  testName: string;
  parameterCode: string;
  parameterName: string;
  measuredValue: number;
  unit: string;
  minNormal: number;
  maxNormal: number;
  status?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  doctorNotes?: string;
}

export interface LabResultResponse extends LabResultItem {
  id: string;
  medicalRecordId: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  createdAt: string;
}

// 3. PROTOCOLS & COMPLIANCE
export interface MedicalProtocol {
  id: string;
  code: string;
  name: string;
  targetDisease: string;
  description: string;
  requiredIngredients: string[];
  optionalIngredients: string[];
  minDurationDays: number;
  guidelines: string;
}

export interface ProtocolComplianceResponse {
  protocolCode: string;
  protocolName: string;
  scorePercentage: number;
  rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NON_COMPLIANT';
  matchedRequiredIngredients: string[];
  missingRequiredIngredients: string[];
  matchedOptionalIngredients: string[];
  suggestions: string[];
  isCompliant: boolean;
}

// 4. INCIDENTS & RISK REPORTING
export interface MedicalIncident {
  id: string;
  medicalRecordId?: string | null;
  petId: string;
  petName: string;
  customerName: string;
  doctorId: string;
  doctorName: string;
  incidentType: 'DRUG_SHOCK' | 'DEATH' | 'SURGICAL_COMPLICATION' | 'CUSTOMER_COMPLAINT' | 'MEDICATION_ERROR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  rootCause?: string;
  immediateAction?: string;
  correctiveAction?: string;
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED';
  reportedAt: string;
  createdAt: string;
}

export interface MedicalIncidentRequest {
  medicalRecordId?: string | null;
  petId: string;
  incidentType: 'DRUG_SHOCK' | 'DEATH' | 'SURGICAL_COMPLICATION' | 'CUSTOMER_COMPLAINT' | 'MEDICATION_ERROR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  rootCause?: string;
  immediateAction?: string;
  correctiveAction?: string;
}

// 5. WALK-IN EXAMINATION RECEPTION
export interface WalkInExamRequest {
  customerId: string;
  petId: string;
  serviceId: string;
  initialSymptoms?: string;
  weightKg?: number | null;
}

// 6. PET EMR HISTORY
export interface WeightHistoryPoint {
  date: string;
  weightKg: number;
}

export interface PastPrescriptionItem {
  medicineName: string;
  activeIngredient?: string;
  quantity: number;
  unit: string;
  dosage: string;
  durationDays: number;
}

export interface PastVisitRecord {
  medicalRecordId: string;
  date: string;
  doctorName: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatmentPlan: string | null;
  weightKg: number | null;
  healthStatus: PetHealthStatus;
  doctorNote: string | null;
  prescriptions: PastPrescriptionItem[];
  labResults: LabResultResponse[];
}

export interface VaccineHistoryItem {
  serviceName: string;
  date: string;
  doctorName: string;
}

export interface PetAllergyItem {
  id: string;
  allergen?: string;
  medicineName?: string;
  severity: string;
  note?: string;
}

export interface PetEmrHistoryResponse {
  petId: string;
  petName: string;
  breed: string;
  species: string;
  currentWeightKg: number | null;
  customerName: string;
  customerPhone: string;
  allergies: PetAllergyItem[];
  weightHistory: WeightHistoryPoint[];
  vaccineHistory: VaccineHistoryItem[];
  pastVisits: PastVisitRecord[];
}

// 7. ORDER SERVICES
export interface ServiceIndicationResponse {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  status: string;
  resultNote?: string;
  createdAt: string;
}

// 8. SLA REMINDER
export interface SlaReminderResponse {
  medicalRecordId: string;
  appointmentId?: string | null;
  petId: string;
  petName: string;
  customerName: string;
  doctorName: string;
  diagnosis: string;
  createdAt: string;
  hoursPending: number;
  reason: string;
}
