// 站点表配置
export default {
  // 表基本信息
  tableName: 'sites',
  description: '站点信息表',

  // 表字段（不包含id、created_at、updated_at）
  fields: [
    { name: 'name', type: 'TEXT', description: '站点名称' },
    { name: 'icon_url', type: 'TEXT', description: '站点图标' },
  ],

  // 关系（当前表创建的关系）
  relations: [
    {
      targetTable: 'posts',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'posts',
      relationNameInTargetTable: 'site',
      description: '站点的帖子列表'
    }, {
      targetTable: 'users',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'current_users',
      relationNameInTargetTable: 'current_site',
      description: '站点的用户列表'
    }, {
      targetTable: 'site_banners',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'site_banners',
      relationNameInTargetTable: 'site',
      description: '站点下的轮播图'
    }, {
      targetTable: 'site_quicklinks',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'site_quicklinks',
      relationNameInTargetTable: 'site',
      description: '站点下的快捷链接'
    }
  ]
};
