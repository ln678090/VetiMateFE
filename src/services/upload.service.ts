import { api } from '@/lib/axios';
import { ApiResp } from '@/types';

export interface UploadResponse {
  url: string;
  publicId: string;
}

export const uploadFile = async (file: File, folder = 'petcare'): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const { data } = await api.post<ApiResp<UploadResponse>>('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
};
