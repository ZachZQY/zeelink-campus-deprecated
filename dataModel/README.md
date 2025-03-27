# PostgreSQL 数据库生成工具

这是一个用于生成 PostgreSQL 数据库结构的工具，基于 TypeScript 表定义文件自动生成完整的 SQL 脚本。

## 功能特点

- 自动从 `tables` 目录加载表定义文件
- 生成创建表、外键关系、索引和触发器的 SQL 语句
- 实现强大的校验逻辑，确保表定义的正确性
- 自动添加审计字段（created_at, updated_at）
- 支持关系定义（一对一、一对多）
- 支持索引定义
- 防止字段重复（如用户定义了 id, created_at, updated_at 等字段时不会重复添加）
- 自动生成 TypeScript 类型定义，支持 SQL 到 TypeScript 的类型映射

## 使用方法

### 安装依赖

确保已安装所需的依赖：

```bash
npm install
```

### 创建表定义

在 `tables` 目录下创建表定义文件。请参考 [表定义文件编写指南](./TABLE_DEFINITION_GUIDE.md) 了解详细说明。

### 生成 SQL

运行以下命令生成 SQL 文件：

```bash
# 使用npm脚本
npm run generate
# 或者
npm run generate:pg-sql

# 或者直接运行
node --loader ts-node/esm generate-pg-sql.ts
```

生成的 SQL 文件将保存在 `outputs/pg.sql` 中。

### 生成 TypeScript 类型

运行以下命令生成与数据表对应的 TypeScript 类型定义：

```bash
npm run generate:schema
# 或使用
npm run generate (同时生成SQL和类型)
```

生成的类型定义文件将保存在 `types/index.ts`，可以在项目中导入使用：

```typescript
// 导入特定表的类型
import { User, Posts } from '@/models/types';

// 或者使用工具类型获取表类型
import { TableType } from '@/models/types';
type UserRow = TableType<'user'>;
```

## TypeScript 类型映射

SQL类型与TypeScript类型的映射关系如下：

| PostgreSQL类型 | TypeScript类型 | 说明 |
|---------------|---------------|------|
| BIGSERIAL (主键) | `number \| string` | ID字段，兼容数字和字符串格式 |
| BIGINT | `number \| string \| null` | 64位整数，支持数字或字符串格式，外键时可为空 |
| TEXT | `string` | 无长度限制的文本类型 |
| JSONB | `Record<string, unknown>` | 二进制格式存储的JSON数据 |
| TIMESTAMPTZ | `number \| string` | 带时区的时间戳，可以是Unix整数或ISO字符串 |
| TIMETZ | `string` | 带时区的时间 |
| DECIMAL | `string \| number` | 精确小数，避免精度问题 |
| DATE | `string \| Date` | 日期类型 |

**注意**：Zion系统仅支持上述字段类型，与PostgreSQL原生支持的类型集合不同。

## 校验功能

本工具实现了强大的校验功能，在生成 SQL 前会验证以下问题：

1. **表名重复**：检测是否有多个表使用相同的表名
2. **字段类型无效**：确保所有字段类型都是有效的 PostgreSQL 类型
3. **关系类型无效**：确保关系类型符合单向原则（只允许 ONE_TO_MANY 和 ONE_TO_ONE）
4. **外键冲突**：检测是否有冲突的外键定义
5. **目标表缺失**：检测关系定义是否引用了不存在的表
6. **冗余关系**：检测是否存在重复的关系定义

如果发现任何问题，工具将显示详细的错误消息和修复建议，并中止 SQL 生成过程。

## 示例

`tables` 目录下包含几个示例表定义文件：

- `user.ts`：用户表
- `posts.ts`：帖子表
- `topics.ts`：主题表
- `site.ts`：站点表

查看这些文件可以了解表定义的正确格式和最佳实践。

## 开发说明

如需扩展或修改生成器功能，可以编辑 `generate-pg-sql.ts` 文件。主要逻辑包括：

- `loadAllTables()`: 加载表定义文件
- `validateTableDefinitions()`: 校验表定义
- `generateCreateTableSQL()`: 生成创建表的 SQL
- `generateForeignKeysSQL()`: 生成外键关系的 SQL
- `generateIndexesSQL()`: 生成索引的 SQL

## 注意事项

- 建议在执行生成的 SQL 脚本前，先仔细检查其内容
- 运行 SQL 脚本之前请确保已经备份数据库
- 对于生产环境，建议先在测试环境验证生成的 SQL 脚本
