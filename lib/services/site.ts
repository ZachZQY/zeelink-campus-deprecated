import { ID, ForeignKey, Site } from '@/dataModel/types';
import { ezClient } from '@/lib/tools/ezclient';

/**
 * 获取站点列表
 */
export async function getSiteList() {
  try {
    const sites = await ezClient.query({
      name: 'site',
      args: {
        order_by: {
          created_at: ()=>'desc'
        }
      },
      fields: ['id', 'name', 'created_at', 'updated_at']
    });

    return {
      success: true,
      data: {
        list: sites || []
      }
    };
  } catch (error) {
    console.error('获取站点列表失败:', error);
    return {
      success: false,
      message: '获取站点列表失败'
    };
  }
}

/**
 * 获取默认站点（按照创建时间排序，取最早创建的站点）
 */
export async function getDefaultSite() {
  try {
    const sites = await ezClient.query({
      name: 'site',
      args: {
        order_by: {
          created_at: ()=>'asc'
        },
        limit: 1
      },
      fields: ['id', 'name', 'created_at', 'updated_at']
    });

    return sites && sites.length > 0 ? sites[0] : null;
  } catch (error) {
    console.error('获取默认站点失败:', error);
    return null;
  }
}

/**
 * 根据ID获取站点信息
 */
export async function getSiteById(siteId: ID) {
  try {
    const site = await ezClient.queryGetFirstOne({
      name: 'site',
      args: {
        where: {
          id: { _eq: siteId }
        }
      },
      fields: ['id', 'name', 'created_at', 'updated_at']
    });

    return site || null;
  } catch (error) {
    console.error('获取站点信息失败:', error);
    return null;
  }
}

/**
 * 创建站点
 * @param siteData 站点数据
 */
export async function createSite(siteData: Partial<Site>) {
  try {
    const newSite = await ezClient.mutationGetFirstOne({
      name: 'insert_site',
      args: {
        objects: [{
          ...siteData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      },
      returning_fields: ['id', 'name', 'created_at', 'updated_at']
    });

    return newSite || null;
  } catch (error) {
    console.error('创建站点失败:', error);
    return null;
  }
}

/**
 * 更新用户的当前站点
 * @param userId 用户ID
 * @param siteId 站点ID
 */
export async function updateUserCurrentSite(userId: ID, siteId: ID) {
  try {
    const success = await ezClient.mutationGetFirstOne({
      name: 'update_user',
      args: {
        where: {
          id: { _eq: userId }
        },
        _set: {
          current_site_site: siteId,
          updated_at: new Date().toISOString()
        }
      }
    });

    return success > 0;
  } catch (error) {
    console.error('更新用户当前站点失败:', error);
    return false;
  }
}

/**
 * 获取用户当前站点
 * @param userId 用户ID
 */
export async function getUserCurrentSite(userId: ID) {
  try {
    const user = await ezClient.queryGetFirstOne({
      name: 'user',
      args: {
        where: {
          id: { _eq: userId }
        }
      },
      fields: [
        'id',
        {
          name: "current_site",

          fields: [
            'id',
            'name',
            'created_at',
            'updated_at'
          ]
        }
      ]
    });

    return user?.current_site || null;
  } catch (error) {
    console.error('获取用户当前站点失败:', error);
    return null;
  }
}
