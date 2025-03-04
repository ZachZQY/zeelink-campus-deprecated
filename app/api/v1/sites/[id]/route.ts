import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  createErrorResponse
} from '@/lib/utils/response';
import {
  Sites as Site
} from '@/dataModel/types';
import { ErrorCode } from '@/lib/types/api';
import { ezClient } from '@/lib/tools/ezclient';
/**
 * 获取站点数据接口
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    
    const result: Site | null = await ezClient.queryGetFirstOne({
      name: "sites",
      fields: ["id", "name", {
        name: "site_banners",
        fields: ["id", "name", "image_url", "link"]
      }, {
          name: "site_quicklinks",
          fields: ["id", "name", "image_url", "link"]
        }],
      args: {
        where: {
          id:{
            _eq: id
          }
        }
      }
    })
    return createSuccessResponse(result);
  } catch (error: any) {
    console.error('获取站点数据异常:', error);
    return createErrorResponse(
      ErrorCode.UNKNOWN_ERROR,
      error?.message || '获取站点数据过程中发生错误'
    );
  }
}
