import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { ErrorCode, PaginationParams } from '@/lib/types/api';
import { Posts as Post } from '@/dataModel/types';
import { PaginationData } from '@/lib/types/api';
import { ezClient } from '@/lib/tools/ezclient';
import { autocompleteTopicIdsByNames } from '@/lib/services/topics';
import { getUserFromRequest } from '@/lib/services/auth';
import { uploadFiles } from '@/lib/tools/qiniu';
/**
 * 获取帖子列表
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;

    const paginationParams: PaginationParams = {
      pageNumber: parseInt(searchParams.get('pageNumber') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '10', 10),
      orderBy: searchParams.get('orderBy') || 'created_at',
      orderSort: searchParams.get('orderSort') as 'asc' | 'desc' || 'desc',
    }


    // 调用帖子服务获取帖子列表
    const result: PaginationData<Post> = await ezClient.find({
      name: 'posts',
      page_number: paginationParams.pageNumber,
      page_size: paginationParams.pageSize,
      args: {
        order_by: {
          [paginationParams?.orderBy || "created_at"]: () => paginationParams?.orderSort
        },
      },
      fields: ['id', 'content', 'created_at', 'updated_at', 'author{id,nickname,avatar_url}', 'site{id,name,icon_url}', 'post_topics{id,name}']
    })
    return createSuccessResponse(result);
  } catch (error: any) {
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      error?.message || '获取帖子列表失败'
    );
  }
}

/**
 * 创建新帖子
 */
export async function POST(request: NextRequest) {
  try {
    // 从会话中获取当前用户信息
    const user = await getUserFromRequest(request);

    // 从FormData获取数据
    const formData = await request.formData();
    const siteId = formData.get('site_id') as string;
    const content = formData.get('content') as string;
    const topicsArr = formData.getAll('topics') as string[];
    const imageFiles = formData.getAll('images') as File[];

    // 参数验证
    if (!content) {
      return createErrorResponse(ErrorCode.INVALID_PARAMS, '内容不能为空');
    }

    if (!user.id) {
      return createErrorResponse(ErrorCode.INVALID_PARAMS, '用户ID不能为空');
    }


    // 处理图片上传
    let mediaData: { name?: string, path: string, type: string }[] = [];

    if (imageFiles && imageFiles.length > 0) {
      const uploadResult = await uploadFiles(imageFiles);
      mediaData = uploadResult
    }


    const topics = await autocompleteTopicIdsByNames(topicsArr);

    // 创建帖子
    const post: Post = await ezClient.mutationGetFirstOne({
      name: 'insert_posts',
      args: {
        objects: [{
          content,
          media_data: mediaData,
          author_users: user.id,
          site_sites: siteId,
          post_topics: {
            data: topics.map(topic => ({
              topic_topics: topic.id
            }))
          }
        }]
      },
      returning_fields: ['id']
    });

    return createSuccessResponse(post);
  } catch (error: any) {
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      error instanceof Error ? error.message : '创建帖子过程中发生错误'
    );
  }
}
