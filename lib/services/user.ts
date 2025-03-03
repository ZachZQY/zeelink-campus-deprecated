import { ezClient } from '../tools/ezclient';
import { User } from '@/dataModel/types';

/**
 * 用户服务接口层
 */
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  status?: string;
}

/**
 * 创建用户参数
 */
export interface CreateUserParams {
  mobile: string;
  password: string;
  nickname: string;
}

/**
 * 获取用户列表
 * @param params 查询参数
 */
export async function getUserList(params: UserQueryParams) {
  const { page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc', keyword } = params;
  
  try {
    // 构建查询条件
    const whereCondition: any = {};
    
    // 添加关键词搜索条件
    if (keyword) {
      whereCondition._or = [
        { nickname: { _ilike: `%${keyword}%` } },
        { mobile: { _ilike: `%${keyword}%` } }
      ];
    }
    
    // 使用 ezClient 的 find 方法进行分页查询
    const result = await ezClient.find({
      name: 'user',
      page_number: page,
      page_size: pageSize,
      args: {
        where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
        order_by: {
          [sortBy]: () => sortOrder // 使用函数避免引号
        }
      },
      fields: ['id', 'mobile', 'nickname', 'created_at', 'updated_at'],
      aggregate_fields: ['count'] // 获取总数
    });
    
    return {
      success: true,
      data: {
        items: result.datas,
        total: result.aggregate.count,
        page,
        pageSize,
        totalPages: Math.ceil(result.aggregate.count / pageSize)
      }
    };
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取用户列表失败'
    };
  }
}

/**
 * 根据ID获取用户信息
 * @param userId 用户ID
 */
export async function getUserById(userId: string | number) {
  try {
    const user = await ezClient.queryGetFirstOne({
      name: 'user',
      args: {
        where: {
          id: { _eq: userId }
        }
      },
      fields: ['id', 'mobile', 'nickname', 'created_at', 'updated_at']
    });
    
    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取用户信息失败'
    };
  }
}

/**
 * 创建用户
 * @param params 用户参数
 */
export async function createUser(params: CreateUserParams) {
  try {
    // 创建用户记录
    const user = await ezClient.mutationGetFirstOne({
      name: 'insert_user',
      args: {
        object: {
          mobile: params.mobile,
          password: params.password, // 实际应用中应该加密
          nickname: params.nickname
        }
      },
      returning_fields: ['id', 'mobile', 'nickname', 'created_at']
    });
    
    return {
      success: true,
      data: user,
      message: '用户创建成功'
    };
  } catch (error) {
    console.error('创建用户失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '创建用户失败'
    };
  }
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param data 更新数据
 */
export async function updateUser(userId: string | number, data: Partial<User>) {
  try {
    // 不允许直接更新ID和时间戳字段
    const { id, created_at, updated_at, ...updateData } = data;
    
    // 更新用户记录
    const result = await ezClient.mutation({
      name: 'update_user',
      args: {
        where: {
          id: { _eq: userId }
        },
        _set: updateData
      },
      fields: [
        'affected_rows',
        {
          name: 'returning',
          fields: ['id', 'mobile', 'nickname', 'updated_at']
        }
      ]
    });
    
    if (!result?.returning?.[0]) {
      return {
        success: false,
        message: '用户不存在或更新失败'
      };
    }
    
    return {
      success: true,
      data: result.returning[0],
      message: '用户信息更新成功'
    };
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '更新用户信息失败'
    };
  }
}

/**
 * 根据手机号查找用户
 * @param mobile 手机号
 */
export async function getUserByMobile(mobile: string) {
  try {
    const user = await ezClient.queryGetFirstOne({
      name: 'user',
      args: {
        where: {
          mobile: { _eq: mobile }
        }
      },
      fields: ['id', 'mobile', 'nickname', 'password', 'created_at', 'updated_at']
    });
    
    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error('根据手机号查找用户失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '查找用户失败'
    };
  }
}
