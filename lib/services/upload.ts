import { uploadFile, uploadFiles, generateKey } from '../tools/qiniu';
import { downloadPathConfig } from '../config/qiniu';

export interface UploadResult {
  success: boolean;
  message: string;
  data?: {
    key: string;
    url: string;
  }
}

export interface BatchUploadResult {
  success: boolean;
  message: string;
  data?: {
    files: {
      key: string;
      url: string;
    }[]
  }
}

/**
 * 获取完整的文件访问URL
 * @param key 文件存储键名
 * @returns 完整的文件访问URL
 */
export function getFileUrl(key: string): string {
  return `${downloadPathConfig.domain}/${key}`;
}

/**
 * 上传单个文件
 * @param file 文件对象
 * @param directory 文件存储目录
 * @returns 上传结果
 */
export async function uploadSingleFile(file: File, directory: string = ''): Promise<UploadResult> {
  try {
    // 构建存储路径
    const basePath = directory 
      ? `${downloadPathConfig.basePath}/${directory}` 
      : downloadPathConfig.basePath;
    
    // 上传文件
    const key = await uploadFile(file, basePath);
    
    return {
      success: true,
      message: '文件上传成功',
      data: {
        key,
        url: getFileUrl(key)
      }
    };
  } catch (error) {
    console.error('文件上传失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '文件上传失败'
    };
  }
}

/**
 * 批量上传文件
 * @param files 文件列表
 * @param directory 文件存储目录
 * @returns 批量上传结果
 */
export async function uploadMultipleFiles(files: File[], directory: string = ''): Promise<BatchUploadResult> {
  try {
    // 构建存储路径
    const basePath = directory 
      ? `${downloadPathConfig.basePath}/${directory}` 
      : downloadPathConfig.basePath;
    
    // 批量上传文件
    const keys = await uploadFiles(files, basePath);
    
    return {
      success: true,
      message: '文件批量上传成功',
      data: {
        files: keys.map(key => ({
          key,
          url: getFileUrl(key)
        }))
      }
    };
  } catch (error) {
    console.error('文件批量上传失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '文件批量上传失败'
    };
  }
}
