# ZRule 前后端联调调试文档

## 环境信息

| 项目 | 值 |
|---|---|
| 运行时 | Bun 1.3.14 (Windows) |
| 后端框架 | Hono + @hono/node-server |
| 前端框架 | React 19 + Vite 8.1.5 + TanStack Router |
| 数据库 | PostgreSQL 17 (Podman 容器 `zrule-postgres`) |
| ORM | Drizzle ORM 0.40.1 |
| 认证库 | Better Auth 1.6.23 |
| UI 组件 | shadcn/ui + Tailwind CSS v4 |

## 服务地址

| 服务 | 地址 | 端口 |
|---|---|---|
| 后端 API | `http://localhost:3001` | 3001 |
| 前端 Dev Server | `http://localhost:5173` | 5173 |
| PostgreSQL | `localhost:5432` | 5432 |

## 启动命令

```bash
# 从项目根目录启动前后端
bun run dev

# 单独启动后端
bun run dev:server

# 单独启动前端
bun run dev:client
```

## 环境变量

`apps/server/.env`:

```env
DATABASE_URL=postgresql://zrule:zrule@localhost:5432/zrule
BETTER_AUTH_SECRET=zrule-dev-secret-key-2026-very-long-and-secure
BETTER_AUTH_URL=http://localhost:3001
PORT=3001
```

## 测试账号

| 字段 | 值 |
|---|---|
| 邮箱 | `847960106@qq.com` |
| 密码 | `Test1234!` |
| 用户名 | ZRule User |
| 用户 ID | `QjrBucCvUOMwK5tsSmPt7QdZDmzzA0Ie` |

## API 端点

### 认证相关 (Better Auth)

| 方法 | 端点 | 说明 |
|---|---|---|
| POST | `/api/auth/sign-up/email` | 邮箱注册 |
| POST | `/api/auth/sign-in/email` | 邮箱登录 |
| POST | `/api/auth/sign-out` | 登出 |
| GET | `/api/auth/get-session` | 获取当前 Session |
| POST | `/api/auth/send-verification-email` | 发送验证邮件 |
| POST | `/api/auth/forget-password` | 忘记密码 |
| POST | `/api/auth/reset-password` | 重置密码 |

### 业务相关

| 方法 | 端点 | 说明 |
|---|---|---|
| GET | `/api/health` | 健康检查 |
| GET | `/api/decisions/` | 获取决策列表 |
| GET | `/api/decisions/:id` | 获取单个决策 |
| POST | `/api/decisions/` | 创建决策 |
| PUT | `/api/decisions/:id` | 更新决策 |
| DELETE | `/api/decisions/:id` | 软删除决策 |

## 联调测试记录

### 1. 注册测试 (API 直连)

```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"ZRule User","email":"847960106@qq.com","password":"Test1234!"}'
```

**响应: 200 OK**

```json
{
  "token": "n6WVrAxrNdIfoKJKdGoz3hm6N3rI5atF",
  "user": {
    "name": "ZRule User",
    "email": "847960106@qq.com",
    "emailVerified": false,
    "image": null,
    "createdAt": "2026-07-17T12:35:28.292Z",
    "updatedAt": "2026-07-17T12:35:28.292Z",
    "id": "QjrBucCvUOMwK5tsSmPt7QdZDmzzA0Ie"
  }
}
```

### 2. 登录测试 (API 直连)

```bash
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"847960106@qq.com","password":"Test1234!"}' \
  -c cookies.txt
```

**响应: 200 OK**

```json
{
  "redirect": false,
  "token": "wxkdKLHLUSfMSEcGim44mFNMEXB560TE",
  "user": {
    "name": "ZRule User",
    "email": "847960106@qq.com",
    "id": "QjrBucCvUOMwK5tsSmPt7QdZDmzzA0Ie"
  }
}
```

### 3. Session 验证测试

```bash
curl http://localhost:3001/api/auth/get-session -b cookies.txt
```

**响应: 200 OK**

```json
{
  "session": {
    "expiresAt": "2026-07-24T12:35:44.751Z",
    "token": "wxkdKLHLUSfMSEcGim44mFNMEXB560TE",
    "userId": "QjrBucCvUOMwK5tsSmPt7QdZDmzzA0Ie",
    "activeOrganizationId": null,
    "id": "G5LNm88Uoea941VhJ8QS4FtmzaBy3pX8"
  },
  "user": {
    "name": "ZRule User",
    "email": "847960106@qq.com",
    "id": "QjrBucCvUOMwK5tsSmPt7QdZDmzzA0Ie"
  }
}
```

### 3. Vite 代理健康检查

```bash
curl http://localhost:5173/api/health
```

**响应: 200 OK**

```json
{
  "status": "ok",
  "timestamp": "2026-07-17T12:36:02.652Z"
}
```

### 4. 注册测试 (经 Vite 代理)

```bash
curl -X POST http://localhost:5173/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"Proxy Test","email":"proxy_test@example.com","password":"Test1234!"}'
```

**响应: 200 OK** — 代理链路正常

## 测试结果汇总

| 测试项 | 端点 | 结果 |
|---|---|---|
| 注册 (API 直连) | `POST /api/auth/sign-up/email` | 200 OK |
| 登录 (API 直连) | `POST /api/auth/sign-in/email` | 200 OK |
| Session 验证 | `GET /api/auth/get-session` | 200 OK |
| Vite 代理健康检查 | `GET /api/health` (via :5173) | 200 OK |
| 注册 (经 Vite 代理) | `POST /api/auth/sign-up/email` (via :5173) | 200 OK |

## 已知问题与修复记录

### 1. Better Auth `Invalid origin` 错误

**问题:** `POST /api/auth/sign-up/email` 返回 `Invalid origin: http://localhost:5173`

**修复:** 在 `apps/server/src/auth/index.ts` 添加 `trustedOrigins`:

```ts
export const auth = betterAuth({
  // ...
  trustedOrigins: ["http://localhost:5173"],
});
```

### 2. HTTP 500 空响应体

**问题:** `POST /api/auth/sign-up/email` 返回 500 且无响应体

**修复:** 在 `apps/server/src/index.ts` 添加错误日志:

```ts
app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  try {
    return await auth.handler(c.req.raw);
  } catch (err) {
    console.error("[Auth Error]", err);
    return c.json({ error: "Internal auth error" }, 500);
  }
});
```

### 3. `process.env.DATABASE_URL` 无法获取

**问题:** `apps/server/src/db/index.ts` 第 5 行 `process.env.DATABASE_URL` 为 `undefined`

**根因:** `.env` 文件含有 UTF-8 BOM（`0xEF 0xBB 0xBF`），导致第一行 `DATABASE_URL` 键名被解析为 `\uFEFFDATABASE_URL`，Bun 无法正确读取

**修复:** 移除 `.env` 文件的 BOM 头（UTF-8 without BOM）

### 4. `BETTER_AUTH_SECRET` 使用占位符

**问题:** `.env` 中 `BETTER_AUTH_SECRET` 为 `change-me-to-a-random-string-at-least-32-chars`

**修复:** 更新为有效密钥 `zrule-dev-secret-key-2026-very-long-and-secure`

## 前端路由结构

| 路径 | 页面 | 说明 |
|---|---|---|
| `/` | — | 根据登录状态重定向到 `/dashboard` 或 `/login` |
| `/login` | LoginPage | 登录表单（shadcn Card + Input + Button） |
| `/register` | RegisterPage | 注册表单 |
| `/dashboard` | DashboardPage | 受保护页面（需登录） |

## 前端技术栈

| 技术 | 用途 |
|---|---|
| React 19 | UI 框架 |
| TanStack Router | 路由管理（代码路由模式） |
| TanStack Query | 数据请求缓存 |
| Better Auth (React) | 认证客户端（useSession、signIn、signOut） |
| shadcn/ui | UI 组件（Button、Input、Card、Label、Separator） |
| Tailwind CSS v4 | 样式框架 |
| Vite 8.1.5 | 构建工具 + API 代理 |
