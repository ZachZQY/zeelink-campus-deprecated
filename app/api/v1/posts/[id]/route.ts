import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse, createNotFoundResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { getPostById, updatePost, deletePost } from '@/lib/service/posts';

/**
 * 获取指定帖子信息
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    if (!postId) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '帖子ID不能为空'
      );
    }
    
    const result = await getPostById(postId);
    
    if (result.success && result.data) {
      return createSuccessResponse(result.data);
    } else {
      return createNotFoundResponse('帖子不存在');
    }
  } catch (error) {
    console.error('获取帖子信息异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '获取帖子信息过程中发生错误'
    );
  }
}

/**
 * 更新帖子信息
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json();
    
    if (!postId) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '帖子ID不能为空'
      );
    }
    
    // 不允许修改敏感字段
    const { id, created_at, updated_at, author_user, site_site, ...updateData } = body;
    const { topics, ...postData } = updateData;
    
    // 更新帖子
    const result = await updatePost(postId, postData, topics);
    
    if (result.success) {
      return createSuccessResponse(result.data, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.CONTENT_NOT_FOUND,
        result.message || '帖子更新失败'
      );
    }
  } catch (error) {
    console.error('更新帖子信息异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '更新帖子信息过程中发生错误'
    );
  }
}

/**
 * 删除帖子
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    if (!postId) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '帖子ID不能为空'
      );
    }
    
    const result = await deletePost(postId);
    
    if (result.success) {
      return createSuccessResponse(null, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.CONTENT_NOT_FOUND,
        result.message || '帖子删除失败'
      );
    }
  } catch (error) {
    console.error('删除帖子异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '删除帖子过程中发生错误'
    );
  }
}
