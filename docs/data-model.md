# 知联校园（Zeelink Campus）数据模型设计

## 数据实体关系图
```
+-------------+      +-------------+      +--------------+
|    user     |<---->|    posts    |<---->|    topics    |
+-------------+      +-------------+      +--------------+
                          |                    |
                          v                    v
                    +-------------+      +--------------+
                    |  post_topics|      |     site     |
                    +-------------+      +--------------+
```

## Zion关联规则说明
在Zion平台中，当选择一张表对目标表建立关系时，会自动在目标表生成关联字段。关联字段生成规则为：`目标表中的关系名称_当前表`。例如：
- 在posts表中有`user_user`字段，表示posts表与user表建立了关系，且在user表中的关系名称为"user"
- 在posts表中有`site_site`字段，表示posts表与site表建立了关系，且在site表中的关系名称为"site"

## 数据模型详细设计（基于zion平台实际创建的表）

### user（用户）
```typescript
interface User {
  id: string;            // 唯一标识符
  mobile: string;        // 手机号
  nickname: string;      // 用户昵称
  password: string;      // 密码（加密存储）
  created_at: Date;      // 创建时间
  updated_at: Date;      // 更新时间
}
```

### site（站点）
```typescript
interface Site {
  id: string;            // 唯一标识符
  site_name: string;     // 站点名称
  site_logo: string;     // 站点Logo URL
  created_at: Date;      // 创建时间
}
```

### posts（帖子）
```typescript
interface Posts {
  id: string;            // 唯一标识符
  content: string;       // 内容
  media_data: string[];  // 媒体数据（图片URL等）
  comment_count: number; // 评论数
  recommend: boolean;    // 是否被推荐
  created_at: Date;      // 创建时间
  updated_at: Date;      // 更新时间
  user_user: string;     // 关联用户ID
  site_site: string;     // 关联站点ID
}
```

### topics（话题）
```typescript
interface Topics {
  id: string;            // 唯一标识符
  topic_name: string;    // 话题名称
  site_site: string;     // 关联站点ID
  created_at: Date;      // 创建时间
}
```

### post_topics（帖子-话题关联）
```typescript
interface PostTopics {
  id: string;            // 唯一标识符
  post_posts: string;     // 关联帖子ID
  topic_topics: string;   // 关联话题ID
  created_at: Date;      // 创建时间
  updated_at: Date;      // 更新时间
}
```

