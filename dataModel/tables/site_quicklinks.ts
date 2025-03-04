export default {
  tableName: 'site_quicklinks',
  description: '站点快捷链接表',
  fields: [
    { name: 'name', type: 'TEXT', description: '名称' },
    { name: 'icon_url', type: 'TEXT', description: '图标' },
    { name: 'link', type: 'TEXT', description: '链接' },
    { name: 'sort', type: 'BIGINT', description: '排序' },
  ]
}