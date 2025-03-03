import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/tools/response';
import { updateUserCurrentSite, getUserCurrentSite } from '@/lib/services/site';
import { verifyToken } from '@/lib/services/auth';
import { ID } from '@/dataModel/types';

/**
 * 切换当前站点
 * POST /api/v1/site/switch
 */
export async function POST(req: NextRequest) {
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
    
    // 获取请求体
    const body = await req.json();
    
    // 验证参数
    if (!body.site_id) {
      return createErrorResponse(3001, '站点ID不能为空');
    }
    
    // 更新用户当前站点
    const success = await updateUserCurrentSite(user.id as ID, body.site_id);
    
    if (!success) {
      return createErrorResponse(3002, '切换站点失败');
    }
    
    // 获取更新后的站点信息
    const currentSite = await getUserCurrentSite(user.id as ID);
    
    return createSuccessResponse({ current_site: currentSite }, '切换站点成功');
  } catch (error) {
    console.error('切换站点失败:', error);
    return createErrorResponse(3002, error instanceof Error ? error.message : '切换站点失败');
  }
}
