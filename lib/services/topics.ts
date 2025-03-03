import { ezClient } from '../tools/ezclient';
import { Topics } from '@/dataModel/types';

/**
 * 话题查询参数
 */
export interface TopicQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
}

/**
 * 创建话题参数
 */
export interface CreateTopicParams {
  name: string;
}

/**
 * 获取话题列表
 * @param params 查询参数
 */
export async function getTopicList(params: TopicQueryParams) {
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy = 'created_at', 
    sortOrder = 'desc', 
    keyword
  } = params;
  
  try {
    // 构建查询条件
    const whereCondition: any = {};
    
    // 添加名称关键词搜索条件
    if (keyword) {
      whereCondition.name = { _ilike: `%${keyword}%` };
    }
    
    // 使用 ezClient 的 find 方法进行分页查询
    const result = await ezClient.find({
      name: 'topics',
      page_number: page,
      page_size: pageSize,
      args: {
        where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
        order_by: {
          [sortBy]: () => sortOrder // 使用函数避免引号
        }
      },
      fields: ['id', 'name', 'created_at', 'updated_at'],
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
    console.error('获取话题列表失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取话题列表失败'
    };
  }
}

/**
 * 根据ID获取话题详情
 * @param topicId 话题ID
 */
export async function getTopicById(topicId: string | number) {
  try {
    const topic = await ezClient.queryGetFirstOne({
      name: 'topics',
      args: {
        where: {
          id: { _eq: topicId }
        }
      },
      fields: ['id', 'name', 'created_at', 'updated_at']
    });
    
    return {
      success: true,
      data: topic
    };
  } catch (error) {
    console.error('获取话题详情失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取话题详情失败'
    };
  }
}

/**
 * 获取话题下的帖子列表
 * @param topicId 话题ID
 * @param params 查询参数
 */
export async function getTopicPosts(
  topicId: string | number,
  params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
) {
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy = 'created_at', 
    sortOrder = 'desc'
  } = params;
  
  try {
    // 使用 ezClient 的 find 方法进行分页查询
    const result = await ezClient.find({
      name: 'post_topics',
      page_number: page,
      page_size: pageSize,
      args: {
        where: {
          topic_topics: { _eq: topicId }
        },
        order_by: {
          [sortBy]: () => sortOrder // 使用函数避免引号
        }
      },
      fields: [
        'id',
        {
          name: 'post',
          fields: [
            'id', 
            'content', 
            'created_at',
            {
              name: 'author',
              fields: ['id', 'nickname']
            }
          ]
        },
        {
          name: 'topic',
          fields: ['id', 'name']
        }
      ],
      aggregate_fields: ['count'] // 获取总数
    });
    
    // 处理结果，提取帖子信息
    const posts = result.datas.map(item => item.post).filter(Boolean);
    
    return {
      success: true,
      data: {
        items: posts,
        total: result.aggregate.count,
        page,
        pageSize,
        totalPages: Math.ceil(result.aggregate.count / pageSize)
      }
    };
  } catch (error) {
    console.error('获取话题帖子列表失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取话题帖子列表失败'
    };
  }
}

/**
 * 创建话题
 * @param params 话题参数
 */
export async function createTopic(params: CreateTopicParams) {
  const { name } = params;
  
  try {
    // 检查话题名称是否已存在
    const existingTopic = await ezClient.query({
      name: 'topics',
      args: {
        where: {
          name: { _eq: name }
        },
        limit: 1
      },
      fields: ['id']
    });
    
    if (existingTopic && existingTopic.length > 0) {
      return {
        success: false,
        message: '话题名称已存在'
      };
    }
    
    // 创建话题记录
    const topic = await ezClient.mutationGetFirstOne({
      name: 'insert_topics',
      args: {
        object: {
          name
        }
      },
      returning_fields: ['id', 'name', 'created_at']
    });
    
    return {
      success: true,
      data: topic,
      message: '话题创建成功'
    };
  } catch (error) {
    console.error('创建话题失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '创建话题失败'
    };
  }
}

/**
 * 更新话题
 * @param topicId 话题ID
 * @param data 更新数据
 */
export async function updateTopic(
  topicId: string | number, 
  data: Partial<Topics>
) {
  try {
    // 不允许直接更新ID和时间戳字段
    const { id, created_at, updated_at, ...updateData } = data;
    
    // 如果有话题名称更新，检查是否重复
    if (updateData.name) {
      const existingTopic = await ezClient.query({
        name: 'topics',
        args: {
          where: {
            name: { _eq: updateData.name },
            id: { _neq: topicId }
          },
          limit: 1
        },
        fields: ['id']
      });
      
      if (existingTopic && existingTopic.length > 0) {
        return {
          success: false,
          message: '话题名称已存在'
        };
      }
    }
    
    // 更新话题记录
    const result = await ezClient.mutation({
      name: 'update_topics',
      args: {
        where: {
          id: { _eq: topicId }
        },
        _set: updateData
      },
      fields: [
        'affected_rows',
        {
          name: 'returning',
          fields: ['id', 'name', 'updated_at']
        }
      ]
    });
    
    if (!result?.returning?.[0]) {
      return {
        success: false,
        message: '话题不存在或更新失败'
      };
    }
    
    return {
      success: true,
      data: result.returning[0],
      message: '话题更新成功'
    };
  } catch (error) {
    console.error('更新话题失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '更新话题失败'
    };
  }
}

/**
 * 删除话题
 * @param topicId 话题ID
 */
export async function deleteTopic(topicId: string | number) {
  try {
    // 检查话题下是否有关联的帖子
    const postTopics = await ezClient.query({
      name: 'post_topics',
      args: {
        where: {
          topic_topics: { _eq: topicId }
        },
        limit: 1
      },
      fields: ['id']
    });
    
    if (postTopics && postTopics.length > 0) {
      return {
        success: false,
        message: '该话题下存在帖子，无法删除'
      };
    }
    
    // 删除话题
    const result = await ezClient.mutation({
      name: 'delete_topics',
      args: {
        where: {
          id: { _eq: topicId }
        }
      },
      fields: ['affected_rows']
    });
    
    if (result.affected_rows === 0) {
      return {
        success: false,
        message: '话题不存在或已被删除'
      };
    }
    
    return {
      success: true,
      message: '话题删除成功'
    };
  } catch (error) {
    console.error('删除话题失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除话题失败'
    };
  }
}
