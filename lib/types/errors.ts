/**
 * 应用错误类，用于规范化错误处理
 */
export class AppError extends Error {
  /**
   * 错误代码
   */
  code: string;
  
  /**
   * 错误状态码
   */
  statusCode: number;
  
  /**
   * 错误数据
   */
  data?: any;
  
  constructor(message: string, code: string, statusCode: number = 400, data?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.data = data;
  }
}

// 用户相关错误
export class UserNotFoundError extends AppError {
  constructor(message: string = '用户不存在') {
    super(message, 'user_not_found', 404);
  }
}

export class UserExistsError extends AppError {
  constructor(message: string = '用户已存在') {
    super(message, 'user_exists', 409);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = '用户名或密码错误') {
    super(message, 'invalid_credentials', 401);
  }
}

// 验证码相关错误
export class InvalidVerificationCodeError extends AppError {
  constructor(message: string = '验证码无效或已过期') {
    super(message, 'invalid_verification_code', 400);
  }
}

export class SendTooFrequentlyError extends AppError {
  constructor(message: string = '发送过于频繁，请稍后再试') {
    super(message, 'send_too_frequently', 429);
  }
}

// 内容相关错误
export class ContentNotFoundError extends AppError {
  constructor(message: string = '内容不存在') {
    super(message, 'content_not_found', 404);
  }
}

// 权限相关错误
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权访问') {
    super(message, 'unauthorized', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = '没有操作权限') {
    super(message, 'forbidden', 403);
  }
}

// 参数验证错误
export class ValidationError extends AppError {
  constructor(message: string = '参数验证失败', data?: any) {
    super(message, 'validation_error', 400, data);
  }
}

// 服务层错误
export class ServiceUnavailableError extends AppError {
  constructor(message: string = '服务不可用') {
    super(message, 'service_unavailable', 503);
  }
}

// 通用错误处理函数
export function handleServiceError(error: any): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  // 处理ZodError等验证库错误
  if (error.name === 'ZodError') {
    return new ValidationError('参数验证失败', error.errors);
  }
  
  // 处理其他未知错误
  console.error('Unhandled error:', error);
  return new AppError(
    error.message || '未知错误',
    'unknown_error',
    500
  );
}
