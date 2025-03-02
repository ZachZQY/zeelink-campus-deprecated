# 知联校园（Zeelink Campus）技术文档

## 技术栈
- **前端框架**：Next.js (最新版)
- **UI组件库**：Material-UI (MUI)
- **状态管理**：React Context API + React Hooks
- **API通信**：ezcloudbase的ezClient (GraphQL)
- **后端服务**：Zion自动生成的GraphQL后端
- **云服务**：ezcloudbase

## 项目架构

### 前端架构
```
zeelink-campus/
├── public/              # 静态资源
├── src/
│   ├── components/      # 可复用组件
│   │   ├── common/      # 通用组件
│   │   ├── layout/      # 布局组件
│   │   ├── home/        # 首页相关组件
│   │   ├── community/   # 社区相关组件
│   │   ├── profile/     # 个人中心相关组件
│   │   └── post/        # 发帖相关组件
│   ├── graphql/         # GraphQL查询和变更
│   │   ├── queries/     # 查询定义
│   │   ├── mutations/   # 变更定义
│   │   └── fragments/   # 片段定义
│   ├── hooks/           # 自定义Hooks
│   ├── pages/           # 页面组件(Next.js路由)
│   │   ├── _app.tsx     # 应用入口
│   │   ├── index.tsx    # 首页
│   │   ├── login/       # 登录相关页面
│   │   ├── community/   # 社区相关页面
│   │   ├── profile/     # 个人中心相关页面
│   │   └── post/        # 发帖相关页面
│   ├── styles/          # 样式文件
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   └── contexts/        # React上下文
├── ez.config.json       # ezcloudbase配置
```

### GraphQL架构
使用ezcloudbase的ezClient与Zion生成的GraphQL API进行通信，主要包括：
- 查询：获取数据（站点列表、帖子、用户信息等）
- 变更：修改数据（登录、发帖、修改个人信息等）
- 订阅：实时更新（可选，用于消息通知等）

## 开发规范

### React开发规范
1. 使用函数式组件和React Hooks
2. 遵循TypeScript类型定义
3. 使用MUI组件库构建界面
4. 严格遵守React Hooks规则
5. 组件拆分原则：单一职责，高内聚低耦合

### GraphQL开发规范
1. 使用ezClient的查询和变更API
2. 为所有查询和变更创建TypeScript接口
3. 添加适当的加载状态和错误处理
4. 使用缓存策略优化性能

### 代码风格
1. 使用ESLint和Prettier保持代码风格一致
2. 遵循命名约定：
   - 组件：PascalCase
   - 函数和变量：camelCase
   - 常量：UPPER_CASE
3. 代码注释清晰简洁

## 数据流
1. 用户操作触发事件
2. 组件调用ezClient的查询或变更API
3. ezClient与GraphQL API通信
4. 处理响应数据并更新UI

## 性能优化
1. 使用Next.js的SSR/SSG优化首屏加载
2. 组件懒加载
3. ezClient缓存策略
4. 图片优化
