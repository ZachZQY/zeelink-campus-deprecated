import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { ezClient } from '@/lib/tools/ezclient';
import { Topics as Topic } from '@/dataModel/types';
import { PaginationData } from '@/lib/types/api';
/**
 * 获取帖子列表
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const orderSort = searchParams.get('orderSort') || 'desc';
    const keyword = searchParams.get('keyword') || '';

    // 调用帖子服务获取帖子列表
    const result: PaginationData<Topic> = await ezClient.find({
      page_number: pageNumber,
      page_size: pageSize,
      name: 'topics',
      args: {
        where: {
          name: {
            _like: `%${keyword}%`
          }
        },
        order_by: {
          [orderBy]: () => orderSort
        },
      },
      fields: ["id", "name"]
    })
    return createSuccessResponse(result)
  } catch (error: any) {
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      error?.message || '话题获取失败'
    );
  }
}

