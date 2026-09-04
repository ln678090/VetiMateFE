export type ServiceIndicationStatus = 'PENDING' | 'DONE' | 'CANCELLED';

export interface CreateServiceIndicationRequest {
  serviceId: string;
}

export interface CompleteServiceIndicationRequest {
  resultNote: string;
}

export interface ServiceIndicationResponse {
  id: string;
  medicalRecordId: string;
  serviceId: string;
  serviceName: string;
  status: ServiceIndicationStatus;
  resultNote: string | null;
  createdAt: string;
}
