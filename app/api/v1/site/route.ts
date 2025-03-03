import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { getSiteList } from '@/lib/services/site';
import { verifyToken } from '@/lib/services/auth';

/**
 * 获取站点列表
 * GET /api/v1/site
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    
    // 验证令牌
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse(2001, '未授权', 401);
    }
    
    const token = authHeader.substring(7);
    const user = await verifyToken(token);
    
    if (!user) {
      return createErrorResponse(2001, '未授权', 401);
    }
    
    // 获取站点列表
    const result = await getSiteList();
    
    if (!result.success) {
      return createErrorResponse(3000, result.message || '获取站点列表失败');
    }
    
    return createSuccessResponse(result.data);
  } catch (error) {
    console.error('获取站点列表失败:', error);
    return createErrorResponse(3000, error instanceof Error ? error.message : '获取站点列表失败');
  }
}
