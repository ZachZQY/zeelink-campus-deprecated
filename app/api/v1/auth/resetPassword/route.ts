import { NextRequest } from 'next/server';
import { 
  createSuccessResponse, 
  createErrorResponse
} from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { resetPassword } from '@/lib/services/auth';

/**
 * 重置密码接口
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { mobile, newPassword, code } = body;
    
    // 参数验证
    if (!mobile) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '手机号不能为空'
      );
    }
    
    if (!newPassword) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '新密码不能为空'
      );
    }
    
    if (!code) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '验证码不能为空'
      );
    }
    
    // 调用重置密码方法
    try {
      const result = await resetPassword(mobile, newPassword, code);
      
      return createSuccessResponse(
        result,
        '密码重置成功'
      );
    } catch (error: any) {
      // 处理重置密码中的特定错误
      if (error.message.includes('验证码错误')) {
        return createErrorResponse(
          ErrorCode.VERIFICATION_CODE_INVALID,
          error.message
        );
      } else if (error.message.includes('用户不存在')) {
        return createErrorResponse(
          ErrorCode.USER_NOT_FOUND,
          error.message
        );
      } else {
        return createErrorResponse(
          ErrorCode.SERVICE_UNAVAILABLE,
          error.message || '密码重置失败，请稍后重试'
        );
      }
    }
  } catch (error) {
    console.error('密码重置异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '密码重置过程中发生错误'
    );
  }
}
