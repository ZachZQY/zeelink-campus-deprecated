-- ======================================
-- 数据库结构SQL脚本
-- 生成时间: 2025-03-03T13:51:15.907Z
-- 生成工具: ZCM自动生成
-- 注意: 此文件是自动生成的，请勿手动修改
-- ======================================

BEGIN;

-- 设置时区为Asia/Shanghai
SET timezone = 'Asia/Shanghai';

-- ======================================
-- 枚举类型定义
-- ======================================

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

-- 站点信息表
CREATE TABLE IF NOT EXISTS site (
  id BIGSERIAL PRIMARY KEY,
  name TEXT -- 站点名称,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE site IS '站点信息表';
COMMENT ON COLUMN site.id IS '唯一标识符';
COMMENT ON COLUMN site.name IS '站点名称';
COMMENT ON COLUMN site.created_at IS '创建时间';
COMMENT ON COLUMN site.updated_at IS '更新时间';

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

-- 用户信息表
CREATE TABLE IF NOT EXISTS user (
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
COMMENT ON TABLE user IS '用户信息表';
COMMENT ON COLUMN user.id IS '唯一标识符';
COMMENT ON COLUMN user.mobile IS '手机号码';
COMMENT ON COLUMN user.password IS '密码（md5加密存储）';
COMMENT ON COLUMN user.nickname IS '昵称';
COMMENT ON COLUMN user.bio IS '简介';
COMMENT ON COLUMN user.avatar_url IS '头像url';
COMMENT ON COLUMN user.created_at IS '创建时间';
COMMENT ON COLUMN user.updated_at IS '更新时间';

-- 用户角色表
CREATE TABLE IF NOT EXISTS user_role (
  id BIGSERIAL PRIMARY KEY,
  name TEXT -- 角色名称：admin｜user,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 创建时间,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 添加表注释
COMMENT ON TABLE user_role IS '用户角色表';
COMMENT ON COLUMN user_role.id IS '唯一标识符';
COMMENT ON COLUMN user_role.name IS '角色名称：admin｜user';
COMMENT ON COLUMN user_role.created_at IS '创建时间';
COMMENT ON COLUMN user_role.updated_at IS '更新时间';

-- 为post_topics表添加外键字段post_posts，引用posts表
ALTER TABLE post_topics ADD COLUMN IF NOT EXISTS post_posts BIGINT;
COMMENT ON COLUMN post_topics.post_posts IS '外键：引用 posts 表';
ALTER TABLE post_topics ADD CONSTRAINT fk_post_topics_post_posts FOREIGN KEY (post_posts) REFERENCES posts(id) ON DELETE SET NULL;

-- 为posts表添加外键字段site_site，引用site表
ALTER TABLE posts ADD COLUMN IF NOT EXISTS site_site BIGINT;
COMMENT ON COLUMN posts.site_site IS '外键：引用 site 表';
ALTER TABLE posts ADD CONSTRAINT fk_posts_site_site FOREIGN KEY (site_site) REFERENCES site(id) ON DELETE SET NULL;

-- 为user表添加外键字段current_site_site，引用site表
ALTER TABLE user ADD COLUMN IF NOT EXISTS current_site_site BIGINT;
COMMENT ON COLUMN user.current_site_site IS '外键：引用 site 表';
ALTER TABLE user ADD CONSTRAINT fk_user_current_site_site FOREIGN KEY (current_site_site) REFERENCES site(id) ON DELETE SET NULL;

-- 为post_topics表添加外键字段topic_topics，引用topics表
ALTER TABLE post_topics ADD COLUMN IF NOT EXISTS topic_topics BIGINT;
COMMENT ON COLUMN post_topics.topic_topics IS '外键：引用 topics 表';
ALTER TABLE post_topics ADD CONSTRAINT fk_post_topics_topic_topics FOREIGN KEY (topic_topics) REFERENCES topics(id) ON DELETE SET NULL;

-- 为posts表添加外键字段author_user，引用user表
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_user BIGINT;
COMMENT ON COLUMN posts.author_user IS '外键：引用 user 表';
ALTER TABLE posts ADD CONSTRAINT fk_posts_author_user FOREIGN KEY (author_user) REFERENCES user(id) ON DELETE SET NULL;

-- 为user_role表添加外键字段user_user，引用user表
ALTER TABLE user_role ADD COLUMN IF NOT EXISTS user_user BIGINT;
COMMENT ON COLUMN user_role.user_user IS '外键：引用 user 表';
ALTER TABLE user_role ADD CONSTRAINT fk_user_role_user_user FOREIGN KEY (user_user) REFERENCES user(id) ON DELETE SET NULL;

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

-- 为site表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_site_updated_at
ON site (updated_at);

-- 为site表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_site_created_at
ON site (created_at);

-- 为topics表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_topics_updated_at
ON topics (updated_at);

-- 为topics表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_topics_created_at
ON topics (created_at);

-- 为user表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_user_updated_at
ON user (updated_at);

-- 为user表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_user_created_at
ON user (created_at);

-- 为user_role表的updated_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_user_role_updated_at
ON user_role (updated_at);

-- 为user_role表的created_at字段创建索引
CREATE INDEX IF NOT EXISTS idx_user_role_created_at
ON user_role (created_at);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

DROP TRIGGER IF EXISTS trg_site_update_timestamp ON site;
CREATE TRIGGER trg_site_update_timestamp
BEFORE UPDATE ON site
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_topics_update_timestamp ON topics;
CREATE TRIGGER trg_topics_update_timestamp
BEFORE UPDATE ON topics
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_user_update_timestamp ON user;
CREATE TRIGGER trg_user_update_timestamp
BEFORE UPDATE ON user
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_user_role_update_timestamp ON user_role;
CREATE TRIGGER trg_user_role_update_timestamp
BEFORE UPDATE ON user_role
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE VIEW user_posts_view AS
  SELECT u.id AS user_id, u.nickname, u.avatar, p.id AS post_id, p.content, p.created_at
  FROM "user" u
  JOIN posts p ON p.posts_user = u.id
  ORDER BY p.created_at DESC;

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
