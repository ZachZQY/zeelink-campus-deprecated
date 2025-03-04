// 用户表配置
export default {
  // 表基本信息
  tableName: 'users',
  description: '用户信息表',

  // 表字段（不包含id、created_at、updated_at）
  fields: [
    { name: 'mobile', type: 'TEXT', description: '手机号码' },
    { name: 'password', type: 'TEXT', description: '密码（md5加密存储）' },
    { name: 'nickname', type: 'TEXT', description: '昵称' },
    { name: 'bio', type: 'TEXT', description: '简介' },
    { name: 'avatar_url', type: 'TEXT', description: '头像url' }
  ],

  // 关系（当前表创建的关系）
  relations: [
    {
      targetTable: 'posts',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'posts',
      relationNameInTargetTable: 'author',
      description: '用户发布的帖子'
    }, {
      targetTable: 'post_comments',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'post_comments',
      relationNameInTargetTable: 'author',
      description: '用户发布的评论'
    }, {
      targetTable: 'user_roles',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'roles',
      relationNameInTargetTable: 'user',
      description: '用户拥有的角色'
    }
  ]
};
