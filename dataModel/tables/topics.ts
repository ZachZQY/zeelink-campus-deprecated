// 话题表配置
export default {
  // 表基本信息
  tableName: 'topics',
  description: '话题信息表',

  // 表字段（不包含id、created_at、updated_at）
  fields: [
    { name: 'name', type: 'TEXT', description: '话题名称' }
  ],

  // 关系（当前表创建的关系）
  relations: [
    {
      targetTable: 'post_topics',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'post_topics',
      relationNameInTargetTable: 'topic',
      description: '话题关联的帖子'
    }
  ]
};
