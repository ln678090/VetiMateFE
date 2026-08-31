import { api, unwrap } from '@/lib/axios';
import { ApiResp } from '@/types/api';
import { QueueTicketDto, QueueTicketRequest, QueueStatusUpdateRequest, QueueType } from '@/types/queue';

const QUEUE_URL = '/api/clinic/queue';

export const queueService = {
  getTodayQueue: async (type: QueueType): Promise<QueueTicketDto[]> => {
    return unwrap(api.get<ApiResp<QueueTicketDto[]>>(QUEUE_URL, {
      params: { type },
    }));
  },

  createTicket: async (data: QueueTicketRequest): Promise<QueueTicketDto> => {
    return unwrap(api.post<ApiResp<QueueTicketDto>>(QUEUE_URL, data));
  },

  updateStatus: async (id: string, data: QueueStatusUpdateRequest): Promise<QueueTicketDto> => {
    return unwrap(api.put<ApiResp<QueueTicketDto>>(`${QUEUE_URL}/${id}/status`, data));
  },
};
