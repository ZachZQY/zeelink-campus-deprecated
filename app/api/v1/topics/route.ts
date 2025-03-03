import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { getTopicList, createTopic } from '@/lib/service/topics';

/**
 * 获取话题列表
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

    // 调用话题服务获取话题列表
    const result = await getTopicList({
      page,
      pageSize,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      keyword
    });

    if (result.success) {
      return createSuccessResponse(result.data);
    } else {
      return createErrorResponse(
        ErrorCode.SERVICE_UNAVAILABLE, 
        result.message || '获取话题列表失败'
      );
    }
  } catch (error) {
    console.error('获取话题列表异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '获取话题列表过程中发生错误'
    );
  }
}

/**
 * 创建新话题
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // 参数验证
    if (!name || name.trim() === '') {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '话题名称不能为空'
      );
    }

    // 创建话题
    const result = await createTopic({
      name: name.trim()
    });

    if (result.success) {
      return createSuccessResponse(result.data, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.CONTENT_VALIDATION_FAILED, 
        result.message || '话题创建失败'
      );
    }
  } catch (error) {
    console.error('创建话题异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '创建话题过程中发生错误'
    );
  }
}
