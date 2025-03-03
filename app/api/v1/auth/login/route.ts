import { NextRequest } from 'next/server';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  createUnauthorizedResponse 
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
    
    // 参数验证
    if (!mobile) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '手机号不能为空'
      );
    }
    
    // 判断登录类型
    if (loginType === 'code') {
      if (!code) {
        return createErrorResponse(
          ErrorCode.INVALID_PARAMS,
          '验证码不能为空'
        );
      }
      
      // 调用验证码登录方法
      try {
        const result = await loginWithCode(mobile, code);
        
        // 成功返回用户信息和token
        return createSuccessResponse({
          token: result.token,
          user: result.user
        }, '登录成功');
      } catch (error: any) {
        // 验证码无效或过期
        return createUnauthorizedResponse(error.message || '验证码无效或已过期');
      }
    } else {
      // 默认为密码登录
      if (!password) {
        return createErrorResponse(
          ErrorCode.INVALID_PARAMS,
          '密码不能为空'
        );
      }
      
      // 调用密码登录方法
      try {
        const result = await loginWithPassword(mobile, password);
        
        // 成功返回用户信息和token
        return createSuccessResponse({
          token: result.token,
          user: result.user
        }, '登录成功');
      } catch (error: any) {
        // 用户名或密码错误
        return createUnauthorizedResponse(error.message || '手机号或密码错误');
      }
    }
  } catch (error) {
    console.error('登录异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '登录过程中发生错误'
    );
  }
}
