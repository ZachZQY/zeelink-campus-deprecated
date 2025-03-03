/**
 * 标准API响应结构
 */
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  timestamp: number;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应数据
 */
export interface PaginationData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 错误代码枚举
 */
export enum ErrorCode {
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR = 1000,
  INVALID_PARAMS = 1001,
  SERVICE_UNAVAILABLE = 1002,
  RATE_LIMIT_EXCEEDED = 1003,
  
  // 授权相关错误 (2000-2999)
  UNAUTHORIZED = 2000,
  FORBIDDEN = 2001,
  TOKEN_EXPIRED = 2002,
  INVALID_TOKEN = 2003,
  
  // 用户相关错误 (3000-3999)
  USER_NOT_FOUND = 3000,
  INVALID_CREDENTIALS = 3001,
  ACCOUNT_LOCKED = 3002,
  ACCOUNT_DISABLED = 3003,
  USER_ALREADY_EXISTS = 3004,
  VERIFICATION_CODE_INVALID = 3005,
  
  // 文件上传相关错误 (4000-4999)
  UPLOAD_FAILED = 4000,
  INVALID_FILE_TYPE = 4001,
  FILE_TOO_LARGE = 4002,
  
  // 内容相关错误 (5000-5999)
  CONTENT_NOT_FOUND = 5000,
  DUPLICATE_CONTENT = 5001,
  CONTENT_VALIDATION_FAILED = 5002,
}
