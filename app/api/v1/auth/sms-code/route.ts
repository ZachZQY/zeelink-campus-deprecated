import { NextRequest } from 'next/server';
import { sendSmsSceneCode, SmsSceneType, verifySmsSceneCode } from '@/lib/service/sms';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';

/**
 * 发送短信验证码
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, scene } = body;

    // 参数验证
    if (!mobile) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '手机号不能为空'
      );
    }

    // 验证手机号格式 (简单验证)
    const mobileRegex = /^1[3-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '手机号格式不正确'
      );
    }

    // 验证场景合法性
    if (!scene || !Object.values(SmsSceneType).includes(scene as SmsSceneType)) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '短信场景不合法'
      );
    }

    // 发送验证码
    const result = await sendSmsSceneCode(mobile, scene as SmsSceneType);

    if (result.success) {
      return createSuccessResponse(null, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.SERVICE_UNAVAILABLE, 
        result.message
      );
    }
  } catch (error) {
    console.error('发送短信验证码异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '发送短信验证码过程中发生错误'
    );
  }
}

/**
 * 验证短信验证码
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, scene, code } = body;

    // 参数验证
    if (!mobile || !scene || !code) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '缺少必要参数'
      );
    }

    // 验证手机号格式
    const mobileRegex = /^1[3-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '手机号格式不正确'
      );
    }

    // 验证场景合法性
    if (!Object.values(SmsSceneType).includes(scene as SmsSceneType)) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '短信场景不合法'
      );
    }

    // 验证验证码
    const result = verifySmsSceneCode(mobile, scene as SmsSceneType, code);

    if (result.success) {
      return createSuccessResponse(null, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.VERIFICATION_CODE_INVALID, 
        result.message
      );
    }
  } catch (error) {
    console.error('验证短信验证码异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '验证短信验证码过程中发生错误'
    );
  }
}
