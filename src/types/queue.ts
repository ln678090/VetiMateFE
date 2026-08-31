export type QueueType = 'CLINIC' | 'SPA';
export type QueueStatus = 'WAITING' | 'CALLED' | 'DONE' | 'CANCELLED';

export interface QueueTicketDto {
  id: string;
  appointmentId?: string;
  customerName?: string;
  petName?: string;
  serviceName?: string;
  queueDate: string;
  queueType: QueueType;
  ticketNumber: number;
  status: QueueStatus;
  calledAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface QueueTicketRequest {
  queueType: QueueType;
  appointmentId?: string;
}

export interface QueueStatusUpdateRequest {
  status: QueueStatus;
}
