/** Match cấu trúc ApiResp<T> từ Spring Boot backend */
export interface ApiResp<T> {
  message: string;
  data: T;
  timestamp: string;
}

/** Error shape khi backend trả lỗi */
export interface ApiError {
  message: string;
  status?: number;
  timestamp?: string;
  errors?: Record<string, string[]>;
}
