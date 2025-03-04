import { NextRequest } from 'next/server';
import { uploadSingleFile, uploadMultipleFiles } from '@/lib/services/upload';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { ErrorCode } from '@/lib/types/api';

/**
 * 上传单个文件
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const directory = formData.get('directory') as string || '';

    // 验证文件是否存在
    if (!file) {
      return createErrorResponse(
        ErrorCode.INVALID_PARAMS, 
        '请选择要上传的文件'
      );
    }

    // 验证文件大小（限制为10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return createErrorResponse(
        ErrorCode.FILE_TOO_LARGE, 
        '文件大小不能超过10MB'
      );
    }

    // 上传文件
    const result = await uploadSingleFile(file, directory);

    if (result.success) {
      return createSuccessResponse(result.data, result.message);
    } else {
      return createErrorResponse(
        ErrorCode.UPLOAD_FAILED, 
        result.message
      );
    }
  } catch (error) {
    console.error('文件上传异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR, 
      '文件上传过程中发生错误'
    );
  }
}

/**
 * 获取上传文件的预签名URL（预留接口，暂不实现）
 */
export async function GET(request: NextRequest) {
  // 这里可以实现获取预签名URL的逻辑
  return createSuccessResponse({ message: '此接口尚未实现' });
}
