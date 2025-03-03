import { NextRequest } from 'next/server';
import { 
  createSuccessResponse, 
  createErrorResponse 
} from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { UserService } from '@/lib/services/user';

/**
 * 发送验证码接口
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { mobile, type } = body;
    
    // 参数验证
    if (!mobile) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '手机号不能为空'
      );
    }
    
    if (!type || !['login', 'register', 'reset', 'bind'].includes(type)) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '验证码类型错误，支持的类型：login, register, reset, bind'
      );
    }
    
    try {
      // 调用服务层的发送验证码方法
      const result = await UserService.sendCode({ mobile, type });
      
      // 成功返回
      return createSuccessResponse({
        // 在开发环境下，可以返回验证码用于测试
        ...(process.env.NODE_ENV === 'development' ? { code: result.code } : {})
      }, '验证码已发送');
    } catch (error: any) {
      // 捕获服务层抛出的错误
      if (error.code === 'send_too_frequently') {
        return createErrorResponse(
          ErrorCode.SEND_TOO_FREQUENTLY,
          error.message || '发送过于频繁，请稍后再试'
        );
      } else if (error.code === 'user_not_exists' && type === 'login') {
        return createErrorResponse(
          ErrorCode.USER_NOT_FOUND,
          error.message || '用户不存在'
        );
      } else if (error.code === 'user_exists' && type === 'register') {
        return createErrorResponse(
          ErrorCode.USER_ALREADY_EXISTS,
          error.message || '该手机号已注册'
        );
      } else {
        throw error; // 重新抛出未处理的错误
      }
    }
  } catch (error) {
    console.error('发送验证码异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '发送验证码过程中发生错误'
    );
  }
}
