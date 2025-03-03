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
    
    // 参数验证
    if (!mobile) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '手机号不能为空'
      );
    }
    
    // 验证码类型验证
    if (!['login', 'register', 'resetPassword'].includes(type)) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '验证码类型无效'
      );
    }
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '请输入正确的手机号'
      );
    }
    
    // 调用服务层发送验证码
    try {
      const result = await sendVerificationCode(mobile, type);
      
      return createSuccessResponse({
        // 在开发环境返回验证码，方便测试
        code: process.env.NODE_ENV !== 'production' ? result.code : undefined
      }, '验证码发送成功');
    } catch (error: any) {
      return createErrorResponse(
        ErrorCode.SERVICE_UNAVAILABLE,
        error.message || '验证码发送失败，请稍后重试'
      );
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '验证码发送过程中发生错误'
    );
  }
}
