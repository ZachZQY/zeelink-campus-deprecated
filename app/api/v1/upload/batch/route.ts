import { NextRequest } from 'next/server';
import { uploadMultipleFiles } from '@/lib/services/upload';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';

/**
 * 批量上传文件
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const directory = formData.get('directory') as string || '';

    // 验证文件是否存在
    if (!files || files.length === 0) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '请选择要上传的文件'
      );
    }

    // 验证文件大小（限制单个文件为10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      return createErrorResponse(
        ErrorCode.FILE_TOO_LARGE, 
        '文件大小不能超过10MB'
      );
    }

    // 批量上传文件
    const result = await uploadMultipleFiles(files, directory);

    if (result.success) {
      return createSuccessResponse(result.data, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.UPLOAD_FAILED, 
        result.message
      );
    }
  } catch (error) {
    console.error('批量文件上传异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '批量文件上传过程中发生错误'
    );
  }
}
