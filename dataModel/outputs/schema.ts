/**
 * 数据库表对应的TypeScript类型定义
 * 注意：此文件由生成器自动生成，请勿手动修改
 * 生成时间：2025-03-27T16:07:02.464Z
 */

// 通用类型定义 - SQL类型映射
// PostgreSQL数据类型对应的TypeScript类型
export type BIGSERIAL = number | string;
export type BIGINT = number | string;
export type TEXT = string;
export type JSONB = Record<string, unknown>;
export type TIMESTAMPTZ = number | string;
export type TIMETZ = string;
export type DECIMAL = string | number;
export type DATE = string | Date;
export type BOOLEAN = boolean;

// 业务类型定义
export type ID = BIGSERIAL;
export type ForeignKey = BIGINT | null;

// 类型定义

/**
 * 帖子评论表
 */
export interface PostComments {
  /** 内容 */
  content?: TEXT | null;
  /** 媒体数据（图片URL等） */
  media_data?: JSONB | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 外键：关联到 post_comments 表 */
  post_comment_post_comments?: ForeignKey;

  /** 外键：关联到 posts 表 */
  post_posts?: ForeignKey;

  /** 外键：关联到 users 表 */
  author_users?: ForeignKey;

  /** 帖子的回复 */
  post_comments?: PostComments[];
  /** 引用自 post_comments 表 */
  post_comment?: PostComments | null;
  /** 引用自 posts 表 */
  post?: Posts | null;
  /** 引用自 users 表 */
  author?: Users | null;
}


/**
 * 帖子和话题的关联表
 */
export interface PostTopics {
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 外键：关联到 posts 表 */
  post_posts?: ForeignKey;

  /** 外键：关联到 topics 表 */
  topic_topics?: ForeignKey;

  /** 引用自 posts 表 */
  post?: Posts | null;
  /** 引用自 topics 表 */
  topic?: Topics | null;
}


/**
 * 帖子信息表
 */
export interface Posts {
  /** 内容 */
  content?: TEXT | null;
  /** 媒体数据（图片URL等） */
  media_data?: JSONB | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 外键：关联到 sites 表 */
  site_sites?: ForeignKey;

  /** 外键：关联到 users 表 */
  author_users?: ForeignKey;

  /** 帖子关联的话题 */
  post_topics?: PostTopics[];
  /** 贴子下的评论 */
  post_comments?: PostComments[];
  /** 引用自 sites 表 */
  site?: Sites | null;
  /** 引用自 users 表 */
  author?: Users | null;
}


/**
 * 站点轮播图表
 */
export interface SiteBanners {
  /** 轮播图名称 */
  name?: TEXT | null;
  /** 轮播图图片 */
  image_url?: TEXT | null;
  /** 轮播图跳转链接 */
  link?: TEXT | null;
  /** 轮播图排序 */
  sort?: BIGINT | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 外键：关联到 sites 表 */
  site_sites?: ForeignKey;

  /** 引用自 sites 表 */
  site?: Sites | null;
}


/**
 * 站点快捷链接表
 */
export interface SiteQuicklinks {
  /** 名称 */
  name?: TEXT | null;
  /** 图标 */
  icon_url?: TEXT | null;
  /** 链接 */
  link?: TEXT | null;
  /** 排序 */
  sort?: BIGINT | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 外键：关联到 sites 表 */
  site_sites?: ForeignKey;

  /** 引用自 sites 表 */
  site?: Sites | null;
}


/**
 * 站点信息表
 */
export interface Sites {
  /** 站点名称 */
  name?: TEXT | null;
  /** 站点图标 */
  icon_url?: TEXT | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 站点的帖子列表 */
  posts?: Posts[];
  /** 站点的用户列表 */
  current_users?: Users[];
  /** 站点下的轮播图 */
  site_banners?: SiteBanners[];
  /** 站点下的快捷链接 */
  site_quicklinks?: SiteQuicklinks[];
}


/**
 * 话题信息表
 */
export interface Topics {
  /** 话题名称 */
  name?: TEXT | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 话题关联的帖子 */
  post_topics?: PostTopics[];
}


/**
 * 用户角色表
 */
export interface UserRoles {
  /** 角色名称：admin｜user */
  name?: TEXT | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 外键：关联到 users 表 */
  user_users?: ForeignKey;

  /** 引用自 users 表 */
  user?: Users | null;
}


/**
 * 用户信息表
 */
export interface Users {
  /** 手机号码 */
  mobile?: TEXT | null;
  /** 密码（md5加密存储） */
  password?: TEXT | null;
  /** 昵称 */
  nickname?: TEXT | null;
  /** 简介 */
  bio?: TEXT | null;
  /** 头像url */
  avatar_url?: TEXT | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 外键：关联到 sites 表 */
  current_site_sites?: ForeignKey;

  /** 用户发布的帖子 */
  posts?: Posts[];
  /** 用户发布的评论 */
  post_comments?: PostComments[];
  /** 用户拥有的角色 */
  roles?: UserRoles[];
  /** 引用自 sites 表 */
  current_site?: Sites | null;
}


// 导出类型
export type TableNames = 'post_comments' | 'post_topics' | 'posts' | 'site_banners' | 'site_quicklinks' | 'sites' | 'topics' | 'user_roles' | 'users';

/**
 * 获取指定表的类型
 * @example
 * type UserRow = TableType<'user'>;
 */
export type TableType<T extends TableNames> = 
  T extends 'post_comments' ? PostComments :
  T extends 'post_topics' ? PostTopics :
  T extends 'posts' ? Posts :
  T extends 'site_banners' ? SiteBanners :
  T extends 'site_quicklinks' ? SiteQuicklinks :
  T extends 'sites' ? Sites :
  T extends 'topics' ? Topics :
  T extends 'user_roles' ? UserRoles :
  T extends 'users' ? Users :
  never;
