// 帖子表配置
export default {
  // 表基本信息
  tableName: 'posts',
  description: '帖子信息表',

  // 表字段（不包含id、created_at、updated_at）
  fields: [
    { name: 'content', type: 'TEXT', description: '内容' },
    { name: 'media_data', type: 'JSONB', description: '媒体数据（图片URL等）' }
  ],

  // 当前表创建的关系（一对一或者一对多）
  relations: [
    {
      targetTable: 'post_topics',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'post_topics',
      relationNameInTargetTable: 'post',
      description: '帖子关联的话题'
    }, {
      targetTable: 'post_comments',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'post_comments',
      relationNameInTargetTable: 'post',
      description: '贴子下的评论'
    }
  ]
};
