-- ======================================
-- 数据库结构SQL脚本
-- 生成时间: 2025-03-27T01:50:00.964Z
-- 生成工具: ZCM自动生成
-- 注意: 此文件是自动生成的，请勿手动修改
-- ======================================

BEGIN;

-- 设置时区为Asia/Shanghai
SET timezone = 'Asia/Shanghai';

-- ======================================
-- 枚举类型定义
-- ======================================

-- 帖子评论表
CREATE TABLE IF NOT EXISTS post_comments (
  id BIGSERIAL PRIMARY KEY,
  content TEXT -- 内容,
  media_data JSONB -- 媒体数据（图片URL等）,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE post_comments IS '帖子评论表';
COMMENT ON COLUMN post_comments.id IS '唯一标识符';
COMMENT ON COLUMN post_comments.content IS '内容';
COMMENT ON COLUMN post_comments.media_data IS '媒体数据（图片URL等）';
COMMENT ON COLUMN post_comments.created_at IS '创建时间';
COMMENT ON COLUMN post_comments.updated_at IS '更新时间';

-- 帖子和话题的关联表
CREATE TABLE IF NOT EXISTS post_topics (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE post_topics IS '帖子和话题的关联表';
COMMENT ON COLUMN post_topics.id IS '唯一标识符';
COMMENT ON COLUMN post_topics.created_at IS '创建时间';
COMMENT ON COLUMN post_topics.updated_at IS '更新时间';

-- 帖子信息表
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  content TEXT -- 内容,
  media_data JSONB -- 媒体数据（图片URL等）,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE posts IS '帖子信息表';
COMMENT ON COLUMN posts.id IS '唯一标识符';
COMMENT ON COLUMN posts.content IS '内容';
COMMENT ON COLUMN posts.media_data IS '媒体数据（图片URL等）';
COMMENT ON COLUMN posts.created_at IS '创建时间';
COMMENT ON COLUMN posts.updated_at IS '更新时间';

-- 站点轮播图表
CREATE TABLE IF NOT EXISTS site_banners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT -- 轮播图名称,
  image_url TEXT -- 轮播图图片,
  link TEXT -- 轮播图跳转链接,
  sort BIGINT -- 轮播图排序,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE site_banners IS '站点轮播图表';
COMMENT ON COLUMN site_banners.id IS '唯一标识符';
COMMENT ON COLUMN site_banners.name IS '轮播图名称';
COMMENT ON COLUMN site_banners.image_url IS '轮播图图片';
COMMENT ON COLUMN site_banners.link IS '轮播图跳转链接';
COMMENT ON COLUMN site_banners.sort IS '轮播图排序';
COMMENT ON COLUMN site_banners.created_at IS '创建时间';
COMMENT ON COLUMN site_banners.updated_at IS '更新时间';

-- 站点快捷链接表
CREATE TABLE IF NOT EXISTS site_quicklinks (
  id BIGSERIAL PRIMARY KEY,
  name TEXT -- 名称,
  icon_url TEXT -- 图标,
  link TEXT -- 链接,
  sort BIGINT -- 排序,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE site_quicklinks IS '站点快捷链接表';
COMMENT ON COLUMN site_quicklinks.id IS '唯一标识符';
COMMENT ON COLUMN site_quicklinks.name IS '名称';
COMMENT ON COLUMN site_quicklinks.icon_url IS '图标';
COMMENT ON COLUMN site_quicklinks.link IS '链接';
COMMENT ON COLUMN site_quicklinks.sort IS '排序';
COMMENT ON COLUMN site_quicklinks.created_at IS '创建时间';
COMMENT ON COLUMN site_quicklinks.updated_at IS '更新时间';

-- 站点信息表
CREATE TABLE IF NOT EXISTS sites (
  id BIGSERIAL PRIMARY KEY,
  name TEXT -- 站点名称,
  icon_url TEXT -- 站点图标,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE sites IS '站点信息表';
COMMENT ON COLUMN sites.id IS '唯一标识符';
COMMENT ON COLUMN sites.name IS '站点名称';
COMMENT ON COLUMN sites.icon_url IS '站点图标';
COMMENT ON COLUMN sites.created_at IS '创建时间';
COMMENT ON COLUMN sites.updated_at IS '更新时间';

-- 话题信息表
CREATE TABLE IF NOT EXISTS topics (
  id BIGSERIAL PRIMARY KEY,
  name TEXT -- 话题名称,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE topics IS '话题信息表';
COMMENT ON COLUMN topics.id IS '唯一标识符';
COMMENT ON COLUMN topics.name IS '话题名称';
COMMENT ON COLUMN topics.created_at IS '创建时间';
COMMENT ON COLUMN topics.updated_at IS '更新时间';

-- 用户角色表
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT -- 角色名称：admin｜user,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE user_roles IS '用户角色表';
COMMENT ON COLUMN user_roles.id IS '唯一标识符';
COMMENT ON COLUMN user_roles.name IS '角色名称：admin｜user';
COMMENT ON COLUMN user_roles.created_at IS '创建时间';
COMMENT ON COLUMN user_roles.updated_at IS '更新时间';

-- 用户信息表
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  mobile TEXT -- 手机号码,
  password TEXT -- 密码（md5加密存储）,
  nickname TEXT -- 昵称,
  bio TEXT -- 简介,
  avatar_url TEXT -- 头像url,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE users IS '用户信息表';
COMMENT ON COLUMN users.id IS '唯一标识符';
COMMENT ON COLUMN users.mobile IS '手机号码';
COMMENT ON COLUMN users.password IS '密码（md5加密存储）';
COMMENT ON COLUMN users.nickname IS '昵称';
COMMENT ON COLUMN users.bio IS '简介';
COMMENT ON COLUMN users.avatar_url IS '头像url';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';

-- 为post_comments表添加外键字段post_comment_post_comments，引用post_comments表
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS post_comment_post_comments BIGINT;
COMMENT ON COLUMN post_comments.post_comment_post_comments IS '外键：引用 post_comments 表';
ALTER TABLE post_comments ADD CONSTRAINT fk_post_comments_post_comment_post_comments FOREIGN KEY (post_comment_post_comments) REFERENCES post_comments(id) ON DELETE SET NULL;

-- 为post_topics表添加外键字段post_posts，引用posts表
ALTER TABLE post_topics ADD COLUMN IF NOT EXISTS post_posts BIGINT;
COMMENT ON COLUMN post_topics.post_posts IS '外键：引用 posts 表';
ALTER TABLE post_topics ADD CONSTRAINT fk_post_topics_post_posts FOREIGN KEY (post_posts) REFERENCES posts(id) ON DELETE SET NULL;

-- 为post_comments表添加外键字段post_posts，引用posts表
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS post_posts BIGINT;
COMMENT ON COLUMN post_comments.post_posts IS '外键：引用 posts 表';
ALTER TABLE post_comments ADD CONSTRAINT fk_post_comments_post_posts FOREIGN KEY (post_posts) REFERENCES posts(id) ON DELETE SET NULL;

-- 为posts表添加外键字段site_sites，引用sites表
ALTER TABLE posts ADD COLUMN IF NOT EXISTS site_sites BIGINT;
COMMENT ON COLUMN posts.site_sites IS '外键：引用 sites 表';
ALTER TABLE posts ADD CONSTRAINT fk_posts_site_sites FOREIGN KEY (site_sites) REFERENCES sites(id) ON DELETE SET NULL;

-- 为users表添加外键字段current_site_sites，引用sites表
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_site_sites BIGINT;
COMMENT ON COLUMN users.current_site_sites IS '外键：引用 sites 表';
ALTER TABLE users ADD CONSTRAINT fk_users_current_site_sites FOREIGN KEY (current_site_sites) REFERENCES sites(id) ON DELETE SET NULL;

-- 为site_banners表添加外键字段site_sites，引用sites表
ALTER TABLE site_banners ADD COLUMN IF NOT EXISTS site_sites BIGINT;
COMMENT ON COLUMN site_banners.site_sites IS '外键：引用 sites 表';
ALTER TABLE site_banners ADD CONSTRAINT fk_site_banners_site_sites FOREIGN KEY (site_sites) REFERENCES sites(id) ON DELETE SET NULL;

-- 为site_quicklinks表添加外键字段site_sites，引用sites表
ALTER TABLE site_quicklinks ADD COLUMN IF NOT EXISTS site_sites BIGINT;
COMMENT ON COLUMN site_quicklinks.site_sites IS '外键：引用 sites 表';
ALTER TABLE site_quicklinks ADD CONSTRAINT fk_site_quicklinks_site_sites FOREIGN KEY (site_sites) REFERENCES sites(id) ON DELETE SET NULL;

-- 为post_topics表添加外键字段topic_topics，引用topics表
ALTER TABLE post_topics ADD COLUMN IF NOT EXISTS topic_topics BIGINT;
COMMENT ON COLUMN post_topics.topic_topics IS '外键：引用 topics 表';
ALTER TABLE post_topics ADD CONSTRAINT fk_post_topics_topic_topics FOREIGN KEY (topic_topics) REFERENCES topics(id) ON DELETE SET NULL;

-- 为posts表添加外键字段author_users，引用users表
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_users BIGINT;
COMMENT ON COLUMN posts.author_users IS '外键：引用 users 表';
ALTER TABLE posts ADD CONSTRAINT fk_posts_author_users FOREIGN KEY (author_users) REFERENCES users(id) ON DELETE SET NULL;

-- 为post_comments表添加外键字段author_users，引用users表
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS author_users BIGINT;
COMMENT ON COLUMN post_comments.author_users IS '外键：引用 users 表';
ALTER TABLE post_comments ADD CONSTRAINT fk_post_comments_author_users FOREIGN KEY (author_users) REFERENCES users(id) ON DELETE SET NULL;

-- 为user_roles表添加外键字段user_users，引用users表
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS user_users BIGINT;
COMMENT ON COLUMN user_roles.user_users IS '外键：引用 users 表';
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_user_users FOREIGN KEY (user_users) REFERENCES users(id) ON DELETE SET NULL;

-- 为post_comments表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_post_comments_updated_at
ON post_comments (updated_at);

-- 为post_comments表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at
ON post_comments (created_at);

-- 为post_topics表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_post_topics_updated_at
ON post_topics (updated_at);

-- 为post_topics表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_post_topics_created_at
ON post_topics (created_at);

-- 为posts表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_posts_updated_at
ON posts (updated_at);

-- 为posts表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_posts_created_at
ON posts (created_at);

-- 为site_banners表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_site_banners_updated_at
ON site_banners (updated_at);

-- 为site_banners表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_site_banners_created_at
ON site_banners (created_at);

-- 为site_quicklinks表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_site_quicklinks_updated_at
ON site_quicklinks (updated_at);

-- 为site_quicklinks表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_site_quicklinks_created_at
ON site_quicklinks (created_at);

-- 为sites表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_sites_updated_at
ON sites (updated_at);

-- 为sites表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_sites_created_at
ON sites (created_at);

-- 为topics表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_topics_updated_at
ON topics (updated_at);

-- 为topics表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_topics_created_at
ON topics (created_at);

-- 为user_roles表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_user_roles_updated_at
ON user_roles (updated_at);

-- 为user_roles表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_user_roles_created_at
ON user_roles (created_at);

-- 为users表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_users_updated_at
ON users (updated_at);

-- 为users表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_users_created_at
ON users (created_at);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_post_comments_update_timestamp ON post_comments;
CREATE TRIGGER trg_post_comments_update_timestamp
BEFORE UPDATE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_post_topics_update_timestamp ON post_topics;
CREATE TRIGGER trg_post_topics_update_timestamp
BEFORE UPDATE ON post_topics
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_posts_update_timestamp ON posts;
CREATE TRIGGER trg_posts_update_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_site_banners_update_timestamp ON site_banners;
CREATE TRIGGER trg_site_banners_update_timestamp
BEFORE UPDATE ON site_banners
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_site_quicklinks_update_timestamp ON site_quicklinks;
CREATE TRIGGER trg_site_quicklinks_update_timestamp
BEFORE UPDATE ON site_quicklinks
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_sites_update_timestamp ON sites;
CREATE TRIGGER trg_sites_update_timestamp
BEFORE UPDATE ON sites
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_topics_update_timestamp ON topics;
CREATE TRIGGER trg_topics_update_timestamp
BEFORE UPDATE ON topics
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_user_roles_update_timestamp ON user_roles;
CREATE TRIGGER trg_user_roles_update_timestamp
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_users_update_timestamp ON users;
CREATE TRIGGER trg_users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE VIEW user_detail AS
SELECT 
  u.id, 
  u.username, 
  u.email, 
  u.created_at, 
  u.updated_at, 
  p.display_name, 
  p.avatar, 
  p.bio, 
  p.location 
FROM 
  "user" u 
  LEFT JOIN profile p ON u.id = p.user_id;

-- ======================================
-- 检查表是否存在，设置最后一次执行时间
-- ======================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'system_config') THEN
    INSERT INTO system_config (key, value, description) 
    VALUES ('LAST_DB_SYNC', NOW()::text, '最后一次数据库同步时间') 
    ON CONFLICT (key) DO UPDATE SET value = NOW()::text;
  END IF;
END;
$$;

COMMIT;

-- 执行完成
