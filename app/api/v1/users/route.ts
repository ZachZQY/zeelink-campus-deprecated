import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse, createNotFoundResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { UserService } from '@/lib/services/user';

/**
 * 获取用户列表
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const keyword = searchParams.get('keyword') || '';

    try {
      // 调用服务层获取用户列表
      const result = await UserService.getUsers({
        page,
        pageSize,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
        keyword
      });
      
      return createSuccessResponse(result);
    } catch (error: any) {
      throw error; // 继续抛出错误由外层捕获
    }
  } catch (error) {
    console.error('获取用户列表异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '获取用户列表过程中发生错误'
    );
  }
}

/**
 * 创建新用户
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, password, nickname } = body;

    // 参数验证
    if (!mobile || !password) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '手机号和密码不能为空'
      );
    }

    try {
      // 调用服务层创建用户
      const newUser = await UserService.createUser({
        mobile,
        password,
        nickname: nickname || mobile // 如果没有提供昵称，使用手机号代替
      });
      
      return createSuccessResponse(newUser, '用户创建成功');
    } catch (error: any) {
      if (error.code === 'validation_error') {
        return createErrorResponse(
          ErrorCode.INVALID_PARAMS,
          error.message || '输入参数有误'
        );
      } else if (error.code === 'user_exists') {
        return createErrorResponse(
          ErrorCode.USER_ALREADY_EXISTS,
          error.message || '该手机号已注册'
        );
      } else {
        throw error; // 重新抛出其他错误
      }
    }
  } catch (error) {
    console.error('创建用户异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '创建用户过程中发生错误'
    );
  }
}
