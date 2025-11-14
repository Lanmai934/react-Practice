# React Admin（Vite + TypeScript）

本项目已集成 OpenAPI 同步后端接口与类型、Biome 代码质量工具、Husky 预提交钩子，以及基础的页签栏与生物验证组件。

## 快速开始
- 安装依赖：`npm i`
- 开发启动：`npm run dev`，本地预览 `http://localhost:5174/`
- 构建生产：`npm run build`
- 预览构建：`npm run preview`

## 环境与后端代理
- `vite.config.ts` 已配置开发代理：将以 `'/api'` 开头的请求代理到 `http://192.168.3.185:8080`
- 环境变量：
  - `.env.development`：`VITE_API_BASE_URL=/api`（开发通过代理）
  - `.env.production`：`VITE_API_BASE_URL=http://192.168.3.185:8080`（生产直连后端）
- OpenAPI 客户端初始化在 `src/api/config.ts` 并于 `src/main.tsx` 启动时调用，统一设置 `OpenAPI.BASE` 与鉴权 `TOKEN`

## OpenAPI 同步与客户端生成
已添加完整的脚本流水线用于拉取和生成前端客户端代码（`src/api/`）：

- 拉取最新规范：`npm run openapi:update`
  - 默认尝试这些地址：
    - `http://localhost:3000/api-docs`
    - `http://localhost:3000/api-docs.json`
    - `http://localhost:3000/v3/api-docs`
    - `http://localhost:3000/openapi.json`
  - 可覆盖地址：`OPENAPI_URL=<你的地址> npm run openapi:update`
- 修补缺失 $ref：`npm run openapi:patch`
  - 将无法解析的 `$ref` 替换为通用 `object`，保存为 `src/api/openapi-patched.json`
- 生成客户端：`npm run openapi:generate`
  - 基于修补后的规范，生成 `core/`、`models/`、`services/` 等，统一导出位于 `src/api/index.ts`
- 可选类型文件：`npm run openapi:types`（基于 `openapi.json` 生成 `src/api/types.ts`，遇到无法解析的 `$ref` 时可能失败）

生成后，可直接在代码中使用类型安全的服务方法：

```ts
import { UsersService } from '@/api'

const res = await UsersService.getApiUsers()
const users = res.data ?? []
```

如需设置请求头、令牌或 Cookie：编辑 `src/api/config.ts`，例如：

```ts
OpenAPI.TOKEN = async () => localStorage.getItem('token') ?? undefined
// OpenAPI.WITH_CREDENTIALS = true
// OpenAPI.CREDENTIALS = 'include'
```

## 页面接入示例
- `src/pages/UserManagement.tsx` 已改为真实调用 `UsersService.getApiUsers()`，并使用生成的 `User` 类型作为数据结构。
- 页签栏已移至 Header，当标签溢出时可水平滚动并显示切换箭头（Ant Design Tabs 支持）。
- `BiomCheck` 组件集成于 Header 右侧，演示 WebAuthn 生物校验（本地存储校验状态）。

## 代码质量与提交流程
- Biome：
  - 检查：`npm run biome:check`
  - 修复：`npm run biome:fix`
  - 格式化：`npm run biome:format`
- TypeScript 类型检查：`npm run typecheck`
- Husky 预提交钩子：自动运行 `biome:format` 与 `biome:check`，阻止不合规的提交；格式化后的变更会自动 `git add -A`

## 常见问题
- OpenAPI 文档无法直接生成：
  - 若后端规范存在缺失的 `$ref`（如 `#/components/schemas/LoginResponse`），请先执行 `npm run openapi:patch` 再 `npm run openapi:generate`
  - 优先建议修复后端规范以获得更完整的类型与服务方法
- 开发环境请求跨域：
  - 前端请使用 `'/api'` 前缀，代理会转发至后端 `http://192.168.3.185:8080`
  - 生产环境下由 `VITE_API_BASE_URL` 控制直连后端地址

## 项目结构（关键部分）
- `src/api/`：自动生成的 OpenAPI 客户端与模型
  - `core/OpenAPI.ts`：基础配置（`BASE`、`TOKEN`、`HEADERS` 等）
  - `services/*.ts`：按接口分组的服务方法
  - `models/*.ts`：类型定义
  - `config.ts`：项目自定义初始化（读取环境变量、令牌等）
- `src/pages/`：页面组件（`UserManagement.tsx` 已接入服务端数据）
- `vite.config.ts`：开发代理配置（`/api` -> `http://192.168.3.185:8080`）

## 开发建议
- 将业务页面逐步替换为调用 `src/api/services`，统一由生成的客户端进行请求与类型约束。
- 若需要只处理暂存文件以加速提交，可加入 `lint-staged` 并调整 Husky 钩子为仅检查暂存文件。
