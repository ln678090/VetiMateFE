import { api, publicApi, unwrap } from '@/lib/axios';
import type {
  LobbyQueueBoardDto,
  QueueTicketDto,
  IssueTicketRequest,
  CallTicketRequest,
} from '@/types/clinic';

export const queueApi = {
  // Lấy dữ liệu màn hình TV sảnh chờ (public, không yêu cầu login)
  async getLobbyBoard(date?: string): Promise<LobbyQueueBoardDto> {
    return unwrap<LobbyQueueBoardDto>(
      publicApi.get('/api/clinic/queue/lobby', {
        params: { date: date || undefined },
      })
    );
  },

  // Lấy danh sách vé trong ngày
  async getTickets(date?: string, queueType?: string): Promise<QueueTicketDto[]> {
    return unwrap<QueueTicketDto[]>(
      api.get('/api/clinic/queue/tickets', {
        params: { date: date || undefined, queueType: queueType || undefined },
      })
    );
  },

  // Cấp số thứ tự mới
  async issueTicket(body: IssueTicketRequest): Promise<QueueTicketDto> {
    return unwrap<QueueTicketDto>(api.post('/api/clinic/queue/issue', body));
  },

  // Gọi số thứ tự
  async callTicket(body: CallTicketRequest): Promise<QueueTicketDto> {
    return unwrap<QueueTicketDto>(api.post('/api/clinic/queue/call', body));
  },

  // Hoàn thành phục vụ
  async completeTicket(ticketId: string): Promise<QueueTicketDto> {
    return unwrap<QueueTicketDto>(api.post(`/api/clinic/queue/${ticketId}/complete`));
  },

  // Hủy vé
  async cancelTicket(ticketId: string): Promise<QueueTicketDto> {
    return unwrap<QueueTicketDto>(api.post(`/api/clinic/queue/${ticketId}/cancel`));
  },
};
