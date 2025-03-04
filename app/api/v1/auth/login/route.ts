import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { loginWithCode, loginWithPassword } from '@/lib/services/auth';

/**
 * 用户登录接口 - 支持密码登录和验证码登录
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { mobile, password, code, loginType } = body;
    let result;

    // 判断登录类型
    if (loginType === 'code') {
      result = await loginWithCode(mobile, code);
    } else {
      // 默认为密码登录
      result = await loginWithPassword(mobile, password);
    }
    return createSuccessResponse(result, '登录成功');
  } catch (error: any) {
    console.error('登录异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      error?.message || '登录过程中发生错误'
    );
  }
}
