import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  createErrorResponse
} from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { resetPassword, getUserFromRequest } from '@/lib/services/auth';

/**
 * 重置密码接口
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { mobile, newPassword, code } = body;
    const user = getUserFromRequest(request);

    if (user.mobile !== mobile) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '手机号不匹配'
      );
    }
    const result = await resetPassword(mobile, newPassword, code);
    return createSuccessResponse(
      result,
      '密码重置成功'
    );
  } catch (error: any) {
    console.error('密码重置异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      error?.message || '密码重置过程中发生错误'
    );
  }
}
