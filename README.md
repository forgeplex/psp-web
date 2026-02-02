# PSP Web

> Payment Service Provider 前端 Monorepo

PSP 是一个支付服务管理平台，包含运营后台、商户门户、代理商门户和收银台四个前端应用。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.x |
| 构建 | Vite 6 + Turborepo |
| 状态管理 | Zustand + TanStack Query |
| UI 组件 | Ant Design 5.x |
| 路由 | TanStack Router（类型安全、文件路由） |
| 表单 | React Hook Form + Zod |
| Monorepo | Turborepo + pnpm workspaces |

## 项目结构

```
psp-web/
├── apps/
│   ├── admin/          # Admin 运营后台 (port 3000)     ← P0 核心
│   ├── merchant/       # Merchant 商户门户 (port 3001)
│   ├── agent/          # Agent 代理商门户 (port 3002)
│   └── checkout/       # Checkout 收银台 (port 3003)
├── packages/
│   ├── ui/             # 共享 UI 组件（基于 Ant Design 封装）
│   ├── api/            # API Client + 类型定义 + React Query hooks
│   └── shared/         # Design Tokens、工具函数、常量
├── turbo.json          # Turborepo pipeline 配置
├── pnpm-workspace.yaml # pnpm workspace 配置
├── tsconfig.json       # 根 TypeScript 配置
└── package.json        # 根 package.json
```

## 开发环境搭建

### 前置要求

- Node.js >= 20 (推荐使用 `.nvmrc` 中指定的版本)
- pnpm >= 10

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/forgeplex/psp-web.git
cd psp-web

# 安装依赖
pnpm install

# 启动所有应用
pnpm dev

# 或只启动 Admin 后台
pnpm dev:admin
```

### 各 App 启动命令

| 命令 | 说明 | 端口 |
|------|------|------|
| `pnpm dev` | 启动所有应用 | - |
| `pnpm dev:admin` | Admin 运营后台 | 3000 |
| `pnpm dev:merchant` | Merchant 商户门户 | 3001 |
| `pnpm dev:agent` | Agent 代理商门户 | 3002 |
| `pnpm dev:checkout` | Checkout 收银台 | 3003 |

### 其他命令

```bash
# 构建所有项目
pnpm build

# 只构建 Admin
pnpm build:admin

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm typecheck

# 清理构建产物
pnpm clean
```

## 包说明

### `@psp/shared`

共享基础设施：

- **Design Tokens** — 色彩系统、字体、间距、Ant Design 主题配置
- **工具函数** — `formatCurrency()`, `formatDate()`, `cn()`
- **常量** — API endpoints、状态映射、支付方式

### `@psp/ui`

基于 Ant Design 5.x 封装的业务组件：

- `AppLayout` — 整体布局框架（Header + Sidebar + Content）
- `PageHeader` — 页面标题 + 面包屑 + 操作按钮
- `StatusBadge` — 交易状态标签（成功/处理中/失败/已退款）
- `KpiCard` — KPI 指标卡片
- `DataTable` — 数据表格（分页/排序/选择）
- `FilterBar` — 筛选条
- `DetailDrawer` — 详情抽屉
- `ConfirmDialog` — 危险操作确认弹窗

### `@psp/api`

API 通信层：

- Axios 实例（interceptors, auth token, 401 处理）
- TanStack Query hooks wrapper（`useApiQuery`, `useApiList`, `useApiCreate` 等）
- 类型定义（后续从 OpenAPI 自动生成）

## Admin 后台模块

| 模块 | 路由 | 说明 |
|------|------|------|
| Dashboard | `/` | 运营概览、KPI、趋势图 |
| 商户管理 | `/merchants` | 商户列表、详情、审核 |
| 交易中心 | `/transactions` | 交易查询、详情、退款 |
| 结算 & 资金 | `/settlements` | 结算管理、资金流水 |
| 通道 & 路由 | `/channels` | 支付通道、路由规则 |
| 费率管理 | `/rates` | 费率配置 |
| 风控中心 | `/risk` | 风控规则、拦截记录 |
| 代理商管理 | `/agents` | 代理商列表、分润 |
| 数据分析 | `/analytics` | 报表、数据导出 |
| 通知 & 集成 | `/notifications` | 通知管理、Webhook |
| 系统管理 | `/settings` | 用户、角色、审计日志 |
| 监控告警 | `/monitoring` | 系统监控、告警规则 |

## 贡献指南

1. 从 `main` 分支创建 feature 分支：`feature/xxx`
2. 开发完成后确保 `pnpm build` 通过
3. 提交 PR，关联对应 Issue
4. Code Review 通过后合并

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat(admin): 添加商户列表页面
fix(ui): 修复 StatusBadge 颜色显示
chore(shared): 更新 Design Tokens
```

## License

Private

## 版本信息页面

所有 apps 都提供 `/version` 页面，显示当前部署的 Git commit hash 和构建时间，方便部署后校验版本。

### 访问方式

- Admin: `https://admin.example.com/version`
- Merchant: `https://merchant.example.com/version`
- Agent: `https://agent.example.com/version`
- Checkout: `https://checkout.example.com/version`

### 构建时环境变量

CI/CD 构建时需要传入以下环境变量：

| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_GIT_COMMIT` | Git commit hash | `a1b2c3d4e5f6...` |
| `VITE_BUILD_TIME` | 构建时间 | `2026-02-02 12:00:00` |

构建命令示例：

```bash
VITE_GIT_COMMIT=$(git rev-parse HEAD) \
VITE_BUILD_TIME=$(date '+%Y-%m-%d %H:%M:%S') \
pnpm build
```

本地开发时不设置这些变量，页面会显示 "development"。
