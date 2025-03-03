import { ezClient } from '../tools/ezclient';
import { Posts } from '@/dataModel/types';

/**
 * 帖子查询参数
 */
export interface PostQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  authorId?: string | number;
  siteId?: string | number;
  topicId?: string | number;
}

/**
 * 创建帖子参数
 */
export interface CreatePostParams {
  content: string;
  media_data?: Record<string, unknown>;
  author_user: string | number;
  site_site: string | number;
  topics?: (string | number)[];
}

/**
 * 获取帖子列表
 * @param params 查询参数
 */
export async function getPostList(params: PostQueryParams) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'created_at',
    sortOrder = 'desc',
    keyword,
    authorId,
    siteId,
    topicId
  } = params;

  try {
    // 构建查询条件
    const whereCondition: any = {};

    // 添加内容关键词搜索条件
    if (keyword) {
      whereCondition.content = { _ilike: `%${keyword}%` };
    }

    // 添加作者ID过滤
    if (authorId) {
      whereCondition.author_user = { _eq: authorId };
    }

    // 添加站点ID过滤
    if (siteId) {
      whereCondition.site_site = { _eq: siteId };
    }

    // 设置查询参数
    const args: any = {
      where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
      order_by: {
        [sortBy]: () => sortOrder // 使用函数避免引号
      }
    };

    // 构建关联字段
    const fields = [
      'id',
      'content',
      'media_data',
      'created_at',
      'updated_at',
      {
        name: 'author',
        fields: ['id', 'nickname']
      },
      {
        name: 'site',
        fields: ['id', 'name']
      }
    ];

    // 添加话题ID过滤
    if (topicId) {
      // 通过话题ID查询帖子需要使用关联条件
      args.where = {
        ...args.where,
        post_topics: {
          topic_topics: { _eq: topicId }
        }
      };

      // 添加话题关联字段
      fields.push({
        name: 'post_topics',
        fields: [
          'id',
          `topic{id name}`
        ]
      });
    }

    // 使用 ezClient 的 find 方法进行分页查询
    const result = await ezClient.find({
      name: 'posts',
      page_number: page,
      page_size: pageSize,
      args,
      fields,
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
    console.error('获取帖子列表失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取帖子列表失败'
    };
  }
}

/**
 * 根据ID获取帖子详情
 * @param postId 帖子ID
 */
export async function getPostById(postId: string | number) {
  try {
    const post = await ezClient.queryGetFirstOne({
      name: 'posts',
      args: {
        where: {
          id: { _eq: postId }
        }
      },
      fields: [
        'id',
        'content',
        'media_data',
        'created_at',
        'updated_at',
        {
          name: 'author',
          fields: ['id', 'nickname']
        },
        {
          name: 'site',
          fields: ['id', 'name']
        },
        {
          name: 'post_topics',
          fields: [
            'id',
            {
              name: 'topic',
              fields: ['id', 'name']
            }
          ]
        }
      ]
    });

    return {
      success: true,
      data: post
    };
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取帖子详情失败'
    };
  }
}

/**
 * 创建帖子
 * @param params 帖子参数
 */
export async function createPost(params: CreatePostParams) {
  const { content, media_data, author_user, site_site, topics = [] } = params;

  try {
    // 创建帖子记录
    const post = await ezClient.mutationGetFirstOne({
      name: 'insert_posts',
      args: {
        object: {
          content,
          media_data,
          author_user,
          site_site
        }
      },
      returning_fields: ['id', 'content', 'created_at']
    });

    // 如果有关联话题，创建帖子与话题的关联
    if (topics.length > 0 && post?.id) {
      // 构建关联对象数组
      const topicLinks = topics.map(topicId => ({
        post_posts: post.id,
        topic_topics: topicId
      }));

      // 创建关联关系
      await ezClient.mutation({
        name: 'insert_post_topics',
        args: {
          objects: topicLinks
        },
        fields: ['affected_rows']
      });
    }

    return {
      success: true,
      data: post,
      message: '帖子创建成功'
    };
  } catch (error) {
    console.error('创建帖子失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '创建帖子失败'
    };
  }
}

/**
 * 更新帖子
 * @param postId 帖子ID
 * @param data 更新数据
 * @param newTopics 新的话题ID列表（如果需要更新话题）
 */
export async function updatePost(
  postId: string | number,
  data: Partial<Posts>,
  newTopics?: (string | number)[]
) {
  try {
    // 不允许直接更新ID和时间戳字段
    const { id, created_at, updated_at, ...updateData } = data;

    // 更新帖子记录
    const result = await ezClient.mutation({
      name: 'update_posts',
      args: {
        where: {
          id: { _eq: postId }
        },
        _set: updateData
      },
      fields: [
        'affected_rows',
        {
          name: 'returning',
          fields: ['id', 'content', 'updated_at']
        }
      ]
    });

    if (!result?.returning?.[0]) {
      return {
        success: false,
        message: '帖子不存在或更新失败'
      };
    }

    // 如果提供了新的话题列表，更新帖子话题关联
    if (newTopics !== undefined && result.returning[0].id) {
      // 删除现有话题关联
      await ezClient.mutation({
        name: 'delete_post_topics',
        args: {
          where: {
            post_posts: { _eq: postId }
          }
        },
        fields: ['affected_rows']
      });

      // 添加新的话题关联
      if (newTopics.length > 0) {
        const topicLinks = newTopics.map(topicId => ({
          post_posts: postId,
          topic_topics: topicId
        }));

        await ezClient.mutation({
          name: 'insert_post_topics',
          args: {
            objects: topicLinks
          },
          fields: ['affected_rows']
        });
      }
    }

    return {
      success: true,
      data: result.returning[0],
      message: '帖子更新成功'
    };
  } catch (error) {
    console.error('更新帖子失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '更新帖子失败'
    };
  }
}

/**
 * 删除帖子
 * @param postId 帖子ID
 */
export async function deletePost(postId: string | number) {
  try {
    // 先删除帖子与话题的关联
    await ezClient.mutation({
      name: 'delete_post_topics',
      args: {
        where: {
          post_posts: { _eq: postId }
        }
      },
      fields: ['affected_rows']
    });

    // 删除帖子
    const result = await ezClient.mutation({
      name: 'delete_posts',
      args: {
        where: {
          id: { _eq: postId }
        }
      },
      fields: ['affected_rows']
    });

    if (result.affected_rows === 0) {
      return {
        success: false,
        message: '帖子不存在或已被删除'
      };
    }

    return {
      success: true,
      message: '帖子删除成功'
    };
  } catch (error) {
    console.error('删除帖子失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除帖子失败'
    };
  }
}
