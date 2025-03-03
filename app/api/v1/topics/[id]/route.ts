import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse, createNotFoundResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';
import { getTopicById, getTopicPosts, updateTopic, deleteTopic } from '@/lib/service/topics';

/**
 * 获取指定话题信息
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
    
    const result = await getTopicById(topicId);
    
    if (result.success && result.data) {
      return createSuccessResponse(result.data);
    } else {
      return createNotFoundResponse('话题不存在');
    }
  } catch (error) {
    console.error('获取话题信息异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '获取话题信息过程中发生错误'
    );
  }
}

/**
 * 更新话题信息
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topicId = params.id;
    const body = await request.json();
    
    if (!topicId) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '话题ID不能为空'
      );
    }
    
    // 参数验证
    if (!body.name || body.name.trim() === '') {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS,
        '话题名称不能为空'
      );
    }
    
    // 不允许修改敏感字段
    const { id, created_at, updated_at, ...updateData } = body;
    
    // 更新话题
    const result = await updateTopic(topicId, {
      ...updateData,
      name: typeof updateData.name === 'string' ? updateData.name.trim() : updateData.name
    });
    
    if (result.success) {
      return createSuccessResponse(result.data, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.CONTENT_NOT_FOUND,
        result.message || '话题更新失败'
      );
    }
  } catch (error) {
    console.error('更新话题信息异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '更新话题信息过程中发生错误'
    );
  }
}

/**
 * 删除话题
 */
export async function DELETE(
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
    
    const result = await deleteTopic(topicId);
    
    if (result.success) {
      return createSuccessResponse(null, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.CONTENT_NOT_FOUND,
        result.message || '话题删除失败'
      );
    }
  } catch (error) {
    console.error('删除话题异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      '删除话题过程中发生错误'
    );
  }
}
