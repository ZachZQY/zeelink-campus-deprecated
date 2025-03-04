export default {
  tableName: 'site_banners',
  description: '站点轮播图表',
  fields: [
    { name: 'name', type: 'TEXT', description: '轮播图名称' },
    { name: 'image_url', type: 'TEXT', description: '轮播图图片' },
    { name: 'link', type: 'TEXT', description: '轮播图跳转链接' },
    { name: 'sort', type: 'BIGINT', description: '轮播图排序' },
  ]
}