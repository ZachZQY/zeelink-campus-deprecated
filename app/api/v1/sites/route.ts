import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils/response';
import { ezClient } from "@/lib/tools/ezclient";
import { Sites as Site } from '@/dataModel/types';
/**
 * 获取站点列表
 * GET /api/v1/site
 */
export async function GET(req: NextRequest) {
  try {


    // 获取站点列表
    const result: Site[] = await ezClient.query({
      name: "sites",
      fields: ["id", "name"],
    });

    const response = {
      list: result
    }
    return createSuccessResponse(response);
  } catch (error) {
    console.error('获取站点列表失败:', error);
    return createErrorResponse(3000, error instanceof Error ? error.message : '获取站点列表失败');
  }
}
