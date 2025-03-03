import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse, createNotFoundResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { UserService } from '@/lib/services/user';

/**
 * 获取指定用户信息
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '用户ID不能为空'
      );
    }
    
    try {
      // 调用服务层获取用户信息
      const user = await UserService.getUser(userId);
      return createSuccessResponse(user);
    } catch (error: any) {
      // 处理用户不存在的情况
      if (error.code === 'user_not_found') {
        return createNotFoundResponse('用户不存在');
      } else {
        throw error; // 重新抛出其他错误
      }
    }
  } catch (error) {
    console.error('获取用户信息异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '获取用户信息过程中发生错误'
    );
  }
}

/**
 * 更新用户信息
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    
    if (!userId) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '用户ID不能为空'
      );
    }
    
    // 获取要更新的字段
    const { nickname, avatar, status } = body;
    
    try {
      // 调用服务层更新用户信息
      const updatedUser = await UserService.updateUser(userId, {
        nickname,
        avatar,
        status
      });
      
      return createSuccessResponse(updatedUser, '用户信息更新成功');
    } catch (error: any) {
      if (error.code === 'user_not_found') {
        return createNotFoundResponse('用户不存在');
      } else if (error.code === 'validation_error') {
        return createErrorResponse(
          ErrorCode.INVALID_PARAMS,
          error.message || '输入参数有误'
        );
      } else {
        throw error; // 重新抛出其他错误
      }
    }
  } catch (error) {
    console.error('更新用户信息异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '更新用户信息过程中发生错误'
    );
  }
}

/**
 * 删除用户
 * 注意：实际应用中通常不会物理删除用户，而是标记为已删除状态
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '用户ID不能为空'
      );
    }
    
    try {
      // 调用服务层删除用户
      await UserService.deleteUser(userId);
      return createSuccessResponse(null, '用户删除成功');
    } catch (error: any) {
      if (error.code === 'user_not_found') {
        return createNotFoundResponse('用户不存在');
      } else {
        throw error; // 重新抛出其他错误
      }
    }
  } catch (error) {
    console.error('删除用户异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '删除用户过程中发生错误'
    );
  }
}
