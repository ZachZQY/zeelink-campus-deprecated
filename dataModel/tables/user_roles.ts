// 用户表配置
export default {
  // 表基本信息
  tableName: 'user_roles',
  description: '用户角色表',

  // 表字段（不包含id、created_at、updated_at）
  fields: [
    { name: 'name', type: 'TEXT', description: '角色名称：admin｜user' }
  ],

  // 关系（当前表创建的关系）
  relations: [
  ]
};
