// 站点表配置
export default {
  // 表基本信息
  tableName: 'site',
  description: '站点信息表',

  // 表字段（不包含id、created_at、updated_at）
  fields: [
    { name: 'name', type: 'TEXT', description: '站点名称' }
  ],

  // 关系（当前表创建的关系）
  relations: [
    {
      targetTable: 'posts',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'posts',
      relationNameInTargetTable: 'site',
      description: '站点的帖子列表'
    }
  ]
};
