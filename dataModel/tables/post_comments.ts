// 帖子表配置
export default {
  // 表基本信息
  tableName: 'post_comments',
  description: '帖子评论表',

  // 表字段（不包含id、created_at、updated_at）
  fields: [
    { name: 'content', type: 'TEXT', description: '内容' },
    { name: 'media_data', type: 'JSONB', description: '媒体数据（图片URL等）' }
  ],

  // 当前表创建的关系（一对一或者一对多）
  relations: [
    {
      targetTable: 'post_comments',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'post_comments',
      relationNameInTargetTable: 'post_comment',
      description: '帖子的回复'
    }
  ]
};
