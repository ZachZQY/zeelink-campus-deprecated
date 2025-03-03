import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { getPostList, createPost } from '@/lib/service/posts';

/**
 * 获取帖子列表
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
    const authorId = searchParams.get('authorId') || '';
    const siteId = searchParams.get('siteId') || '';
    const topicId = searchParams.get('topicId') || '';

    // 调用帖子服务获取帖子列表
    const result = await getPostList({
      page,
      pageSize,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      keyword,
      authorId: authorId || undefined,
      siteId: siteId || undefined,
      topicId: topicId || undefined
    });

    if (result.success) {
      return createSuccessResponse(result.data);
    } else {
      return createErrorResponse(
        ErrorCode.SERVICE_UNAVAILABLE, 
        result.message || '获取帖子列表失败'
      );
    }
  } catch (error) {
    console.error('获取帖子列表异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '获取帖子列表过程中发生错误'
    );
  }
}

/**
 * 创建新帖子
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, media_data, author_user, site_site, topics } = body;

    // 参数验证
    if (!content || !author_user || !site_site) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '内容、作者ID和站点ID不能为空'
      );
    }

    // 创建帖子
    const result = await createPost({
      content,
      media_data,
      author_user,
      site_site,
      topics
    });

    if (result.success) {
      return createSuccessResponse(result.data, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.CONTENT_VALIDATION_FAILED, 
        result.message || '帖子创建失败'
      );
    }
  } catch (error) {
    console.error('创建帖子异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '创建帖子过程中发生错误'
    );
  }
}
