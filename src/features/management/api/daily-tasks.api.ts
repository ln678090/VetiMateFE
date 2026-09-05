import { api, unwrap } from '@/lib/axios';
import type { DailyCareTaskDto, UpdateDailyTaskRequest } from '@/types/clinic';

export const dailyTasksApi = {
  // Lấy danh sách việc cần làm cho ngày được chọn (mặc định hôm nay)
  async getTasks(date?: string): Promise<DailyCareTaskDto[]> {
    return unwrap<DailyCareTaskDto[]>(
      api.get('/api/clinic/daily-tasks', {
        params: { date: date || undefined },
      })
    );
  },

  // Tái tạo / làm mới danh sách việc trong ngày
  async generateTasks(date?: string): Promise<DailyCareTaskDto[]> {
    return unwrap<DailyCareTaskDto[]>(
      api.post('/api/clinic/daily-tasks/generate', null, {
        params: { date: date || undefined },
      })
    );
  },

  // Cập nhật trạng thái, kết quả cuộc gọi, ghi chú
  async updateTask(id: string, body: UpdateDailyTaskRequest): Promise<DailyCareTaskDto> {
    return unwrap<DailyCareTaskDto>(api.put(`/api/clinic/daily-tasks/${id}`, body));
  },
};
