// 用户表配置
export default {
  // 表基本信息
  tableName: 'user',
  description: '用户信息表',
  
  // 表字段（不包含id、created_at、updated_at）
  fields: [
    { name: 'mobile', type: 'TEXT', description: '手机号码' },
    { name: 'password', type: 'TEXT', description: '密码（md5加密存储）' },
    { name: 'nickname', type: 'TEXT', description: '昵称' }
  ],
  
  // 关系（当前表创建的关系）
  relations: [
    {
      targetTable: 'posts',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'posts',
      relationNameInTargetTable: 'author',
      description: '用户发布的帖子'
    }
  ]
};
