import { NextRequest } from "next/server";
import {
  createSuccessResponse,
  createErrorResponse
} from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { sendVerificationCode } from "@/lib/services/auth";

/**
 * 发送验证码接口
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { mobile, type = 'login' } = body;
    const result = await sendVerificationCode(mobile, type);

    return createSuccessResponse({
      // 在开发环境返回验证码，方便测试
      code: process.env.NODE_ENV !== 'production' ? result.code : undefined
    }, '验证码发送成功');
  } catch (error: any) {
    console.error('发送验证码失败:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      error?.message || '验证码发送失败，请稍后重试'
    );
  }
}
