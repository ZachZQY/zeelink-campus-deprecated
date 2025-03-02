/**
 * 数据库表对应的TypeScript类型定义
 * 注意：此文件由生成器自动生成，请勿手动修改
 * 生成时间：2025-03-02T19:28:46.542Z
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

// 业务类型定义
export type ID = BIGSERIAL;
export type ForeignKey = BIGINT | null;

// 类型定义

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
  /** 外键：关联到 site 表 */
  site_site?: ForeignKey;

  /** 外键：关联到 user 表 */
  author_user?: ForeignKey;

  /** 帖子关联的话题 */
  post_topics?: PostTopics[];
  /** 引用自 site 表 */
  site?: Site | null;
  /** 引用自 user 表 */
  author?: User | null;
}


/**
 * 站点信息表
 */
export interface Site {
  /** 站点名称 */
  name?: TEXT | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 站点的帖子列表 */
  posts?: Posts[];
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
 * 用户信息表
 */
export interface User {
  /** 手机号码 */
  mobile?: TEXT | null;
  /** 密码（md5加密存储） */
  password?: TEXT | null;
  /** 昵称 */
  nickname?: TEXT | null;
  /** 唯一标识符 */
  id?: ID;
  /** 创建时间 */
  created_at?: TIMESTAMPTZ;
  /** 更新时间 */
  updated_at?: TIMESTAMPTZ;

  // 关联关系
  /** 用户发布的帖子 */
  posts?: Posts[];
}


// 导出类型
export type TableNames = 'post_topics' | 'posts' | 'site' | 'topics' | 'user';

/**
 * 获取指定表的类型
 * @example
 * type UserRow = TableType<'user'>;
 */
export type TableType<T extends TableNames> = 
  T extends 'post_topics' ? PostTopics :
  T extends 'posts' ? Posts :
  T extends 'site' ? Site :
  T extends 'topics' ? Topics :
  T extends 'user' ? User :
  never;
