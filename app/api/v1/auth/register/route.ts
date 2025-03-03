import { NextRequest } from 'next/server';
import { 
  createSuccessResponse, 
  createErrorResponse 
} from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { UserService } from '@/lib/services/user';

/**
 * 用户注册接口
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { mobile, nickname, password, code } = body;
    
    try {
      // 调用服务层的注册方法
      const result = await UserService.register({ 
        mobile, 
        nickname, 
        password, 
        code 
      });
      
      // 成功返回用户信息和token
      return createSuccessResponse({
        token: result.token,
        user: result.user
      }, '注册成功');
    } catch (error: any) {
      // 捕获服务层抛出的错误
      if (error.code === 'invalid_verification_code') {
        return createErrorResponse(
          ErrorCode.INVALID_VERIFICATION_CODE,
          error.message || '验证码无效或已过期'
        );
      } else if (error.code === 'user_exists') {
        return createErrorResponse(
          ErrorCode.USER_ALREADY_EXISTS,
          error.message || '该手机号已注册'
        );
      } else if (error.code === 'validation_error') {
        return createErrorResponse(
          ErrorCode.INVALID_PARAMS,
          error.message || '输入参数有误'
        );
      } else {
        throw error; // 重新抛出未处理的错误
      }
    }
  } catch (error) {
    console.error('注册异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '注册过程中发生错误'
    );
  }
}
