# 表定义文件编写指南

本文档提供了如何在`tables`目录下创建和编写表定义文件的详细说明。正确编写表定义文件对于生成有效的PostgreSQL数据库结构至关重要。

## 目录

1. [基本结构](#基本结构)
2. [字段定义](#字段定义)
3. [关系定义](#关系定义)
4. [索引定义](#索引定义)
5. [最佳实践](#最佳实践)
6. [常见错误与解决方案](#常见错误与解决方案)
7. [示例](#示例)

## 基本结构

每个表定义文件应该以ES模块格式导出一个包含表信息的对象。文件应以`.ts`或`.js`扩展名保存在`tables`目录下。

基本结构如下：

```typescript
// 表定义
export default {
  tableName: '表名',
  description: '表描述',
  fields: [
    // 字段定义
  ],
  relations: [
    // 关系定义（可选）
  ],
  indexes: [
    // 索引定义（可选）
  ]
};
```

每个表定义必须包含以下属性：
- `tableName`：表的名称（必需）
- `description`：表的描述（可选但推荐）
- `fields`：字段数组（必需）

以下属性是可选的：
- `relations`：表关系数组
- `indexes`：索引数组

## 字段定义

每个字段定义是一个包含以下属性的对象：

```javascript
{
  name: '字段名',
  type: '字段类型',
  primary: true|false,
  nullable: true|false,
  default: '默认值',
  unique: true|false,
  check: '检查条件',
  description: '字段描述'
}
```

### 必填属性

- `name`：字段名称
- `type`：字段数据类型
- `description`：字段描述（建议提供）

### 可选属性

- `primary`：是否为主键，默认为`false`
- `nullable`：是否允许为空，默认为`true`
- `default`：默认值
- `unique`：是否唯一，默认为`false`
- `check`：检查约束条件
- `enumValues`：枚举值数组（当字段类型是枚举时）
- `enumName`：枚举类型名称（当字段类型是枚举时）

### 支持的字段类型

以下是Zion系统支持的字段类型（注意：仅限这些类型）：

- `TEXT`：文本类型，无长度限制
- `JSONB`：二进制格式存储的JSON数据
- `TIMETZ`：带时区的时间
- `BIGINT`：64位整数
- `BIGSERIAL`：64位自增整数，通常用于主键
- `TIMESTAMPTZ`：带时区的时间戳
- `DECIMAL`：精确小数（可指定精度和小数位数）
- `DATE`：日期

**注意**：系统不支持其他PostgreSQL原生类型，如VARCHAR、CHAR、SMALLINT、JSON、UUID等。如需这些类型的功能，请使用上述支持的类型代替。

#### 特殊类型说明

- **时间戳类型**：`TIMESTAMPTZ` 在TypeScript类型中会被映射为 `number | string` 类型，可以是Unix时间戳整数或ISO日期字符串格式
- **BIGINT/BIGSERIAL 类型**：在TypeScript类型中会被映射为 `number | string` 联合类型，因为大整数在JavaScript中可能会超出安全整数范围
- **JSON/JSONB 类型**：在TypeScript类型中会被映射为 `Record<string, unknown>` 类型

### 自动生成的字段

系统会自动为每个表添加以下字段，无需在表定义中手动添加：

- `id`：如果未指定主键字段，系统会自动添加一个名为`id`的自增主键字段（类型为`BIGSERIAL`）
- `created_at`：创建时间，类型为`TIMESTAMPTZ`，默认值为`CURRENT_TIMESTAMP`
- `updated_at`：更新时间，类型为`TIMESTAMPTZ`，默认值为`CURRENT_TIMESTAMP`

**重要说明**：
1. 如果在表定义中自定义了上述任何字段，系统将使用您定义的字段，而不会重复添加
2. 如果您使用自定义名称的主键，请确保在字段定义中设置 `primary: true`

## 关系定义

关系定义是一个包含以下属性的对象：

```javascript
{
  targetTable: '目标表名',
  type: '关系类型',
  relationNameInCurrentTable: '当前表中的关系名',
  relationNameInTargetTable: '目标表中的关系名',
  description: '关系描述'
}
```

### 必填属性

- `targetTable`：关系指向的目标表名
- `type`：关系类型，只能是`ONE_TO_ONE`或`ONE_TO_MANY`
- `relationNameInTargetTable`：目标表中关系的名称（用于生成外键名）

### 可选属性

- `relationNameInCurrentTable`：当前表中关系的名称
- `description`：关系的描述

### 关系类型说明

根据单向原则，在表定义中只应使用以下两种关系类型：

1. **ONE_TO_MANY**：表示当前表与目标表的一对多关系。外键将被添加到目标表中。

   例如：如果`user`表与`posts`表是一对多关系，则在`user`表中定义：
   ```javascript
   {
     targetTable: 'posts',
     type: 'ONE_TO_MANY',
     relationNameInCurrentTable: 'posts',
     relationNameInTargetTable: 'author',
     description: '用户的帖子列表'
   }
   ```
   
   这将在`posts`表中创建一个名为`author_user`的外键字段，引用`user`表的`id`字段。

2. **ONE_TO_ONE**：表示当前表与目标表的一对一关系。外键将被添加到当前表中。

   例如：如果`user`表与`profile`表是一对一关系，则在`user`表中定义：
   ```javascript
   {
     targetTable: 'profile',
     type: 'ONE_TO_ONE',
     relationNameInCurrentTable: 'profile',
     relationNameInTargetTable: 'user',
     description: '用户的个人资料'
   }
   ```
   
   这将在`user`表中创建一个名为`user_profile`的外键字段，引用`profile`表的`id`字段。

### 避免错误的关系类型

请不要在表定义中使用以下关系类型：

- `MANY_TO_ONE`：这种关系应该在目标表中定义为`ONE_TO_MANY`
- `MANY_TO_MANY`：多对多关系应该通过中间表来实现

## 索引定义

索引定义是一个包含以下属性的对象：

```javascript
{
  name: '索引名称',
  fields: ['字段1', '字段2', ...],
  unique: true|false,
  method: '索引方法',
  where: '条件'
}
```

### 必填属性

- `name`：索引名称
- `fields`：索引字段数组

### 可选属性

- `unique`：是否为唯一索引，默认为`false`
- `method`：索引方法，默认为`btree`，可选值有`btree`、`hash`、`gist`、`gin`
- `where`：部分索引的条件

## 最佳实践

1. **命名规范**：
   - 表名使用小写字母和下划线，如`user_profile`
   - 字段名使用小写字母和下划线，如`first_name`
   - 索引名以`idx_`开头，如`idx_user_email`

2. **关系定义**：
   - 为每个关系提供清晰的`relationNameInTargetTable`和`relationNameInCurrentTable`
   - 确保关系名在目标表中是唯一的，避免外键冲突
   - 遵循单向原则，只使用`ONE_TO_MANY`和`ONE_TO_ONE`

3. **字段类型**：
   - 为字符串类型指定合适的长度限制，如`VARCHAR(100)`
   - 对于大文本使用`TEXT`类型
   - 对于货币相关字段考虑使用`NUMERIC(precision, scale)`

4. **索引**：
   - 为经常用于查询条件的字段创建索引
   - 为外键字段创建索引
   - 避免过度索引，这会影响写入性能

## 常见错误与解决方案

1. **重复表名**：
   - 错误：多个文件定义了相同的表名
   - 解决方案：确保每个表名在所有文件中都是唯一的

2. **无效字段类型**：
   - 错误：使用了不支持的字段类型
   - 解决方案：使用支持的PostgreSQL字段类型

3. **外键冲突**：
   - 错误：多个关系定义生成了相同的外键名
   - 解决方案：使用不同的`relationNameInTargetTable`

4. **不符合单向原则的关系类型**：
   - 错误：直接使用`MANY_TO_ONE`或`MANY_TO_MANY`
   - 解决方案：改为使用`ONE_TO_MANY`或创建中间表

5. **缺失目标表**：
   - 错误：关系定义引用了不存在的表
   - 解决方案：确保所有引用的表都已定义

## 示例

### 用户表（user.ts）

```typescript
export default {
  tableName: 'user',
  description: '用户信息表',
  fields: [
    { name: 'email', type: 'TEXT', nullable: false, unique: true, description: '用户邮箱' },
    { name: 'username', type: 'TEXT', nullable: false, description: '用户名' },
    { name: 'password', type: 'TEXT', nullable: false, description: '密码（加密存储）' },
    { name: 'full_name', type: 'TEXT', description: '全名' },
    { name: 'is_active', type: 'BIGINT', default: '1', description: '是否激活' },
    { name: 'last_login', type: 'TIMESTAMPTZ', description: '最后登录时间' }
  ],
  relations: [
    {
      targetTable: 'posts',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'posts',
      relationNameInTargetTable: 'author',
      description: '用户的帖子'
    },
    {
      targetTable: 'profile',
      type: 'ONE_TO_ONE',
      relationNameInCurrentTable: 'profile',
      relationNameInTargetTable: 'user',
      description: '用户的个人资料'
    }
  ],
  indexes: [
    { name: 'idx_user_email', fields: ['email'], unique: true },
    { name: 'idx_user_username', fields: ['username'] }
  ]
};
```

### 帖子表（posts.ts）

```typescript
export default {
  tableName: 'posts',
  description: '帖子信息表',
  fields: [
    { name: 'title', type: 'TEXT', nullable: false, description: '帖子标题' },
    { name: 'content', type: 'TEXT', description: '帖子内容' },
    { name: 'status', type: 'BIGINT', default: '0', description: '状态（草稿、已发布、已删除）' },
    { name: 'published_at', type: 'TIMESTAMPTZ', description: '发布时间' },
    { name: 'view_count', type: 'BIGINT', default: '0', description: '浏览次数' }
  ],
  relations: [
    {
      targetTable: 'comments',
      type: 'ONE_TO_MANY',
      relationNameInCurrentTable: 'comments',
      relationNameInTargetTable: 'post',
      description: '帖子的评论'
    }
  ],
  indexes: [
    { name: 'idx_posts_title', fields: ['title'] },
    { name: 'idx_posts_status', fields: ['status'] },
    { name: 'idx_posts_published_at', fields: ['published_at'] }
  ]
};
```

---

通过遵循本指南中的规则和最佳实践，您可以创建高质量的表定义文件，确保生成的PostgreSQL数据库结构符合预期，并避免常见错误。

如有其他问题，请参考项目中的示例文件或联系开发团队。
