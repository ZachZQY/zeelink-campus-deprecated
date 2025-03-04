import { NextResponse } from 'next/server';
import { ApiResponse, ErrorCode } from '../types/api';

/**
 * 创建API成功响应
 * @param data 响应数据
 * @param message 成功消息
 * @returns NextResponse对象
 */
export function createSuccessResponse<T>(data?: T, message: string = '成功'): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    code: 200,
    message,
    data,
    timestamp: Date.now()
  };

  return NextResponse.json(response);
}

/**
 * 创建API错误响应
 * @param code 错误代码
 * @param message 错误消息
 * @param status HTTP状态码
 * @returns NextResponse对象
 */
export function createErrorResponse(
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  message: string = '失败',
  status: number = 400
): NextResponse {
  const response: ApiResponse = {
    success: false,
    code,
    message,
    timestamp: Date.now()
  };

  return NextResponse.json(response, { status });
}

/**
 * 未授权响应
 * @param message 错误消息
 * @returns NextResponse对象
 */
export function createUnauthorizedResponse(message: string = '请先登录'): NextResponse {
  return createErrorResponse(ErrorCode.UNAUTHORIZED, message, 401);
}

/**
 * 禁止访问响应
 * @param message 错误消息
 * @returns NextResponse对象
 */
export function createForbiddenResponse(message: string = '没有操作权限'): NextResponse {
  return createErrorResponse(ErrorCode.FORBIDDEN, message, 403);
}

/**
 * 资源不存在响应
 * @param message 错误消息
 * @returns NextResponse对象
 */
export function createNotFoundResponse(message: string = '资源不存在'): NextResponse {
  return createErrorResponse(ErrorCode.CONTENT_NOT_FOUND, message, 404);
}
