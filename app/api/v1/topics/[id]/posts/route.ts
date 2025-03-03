import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse, createNotFoundResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { getTopicById, getTopicPosts } from '@/lib/service/topics';

/**
 * 获取话题下的帖子列表
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topicId = params.id;
    
    if (!topicId) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '话题ID不能为空'
      );
    }
    
    // 先检查话题是否存在
    const topicResult = await getTopicById(topicId);
    
    if (!topicResult.success || !topicResult.data) {
      return createNotFoundResponse('话题不存在');
    }
    
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // 获取话题下的帖子列表
    const result = await getTopicPosts(topicId, {
      page,
      pageSize,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc'
    });
    
    if (result.success) {
      return createSuccessResponse(result.data);
    } else {
      return createErrorResponse(
        ErrorCode.SERVICE_UNAVAILABLE,
        result.message || '获取话题帖子列表失败'
      );
    }
  } catch (error) {
    console.error('获取话题帖子列表异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '获取话题帖子列表过程中发生错误'
    );
  }
}
