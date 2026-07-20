# ZRule — 故障排除

## 常见问题

### 1. `.env` 第一行变量读不到（BOM 问题）

**症状：** `process.env.DATABASE_URL` 为 `undefined`，但 `.env` 文件中确实有该变量。

**根因：** `.env` 文件含有 UTF-8 BOM（`0xEF 0xBB 0xBF`），导致第一行键名被解析为 `\uFEFFDATABASE_URL`，Bun/Node 无法正确读取。

**检测：**
```powershell
Get-Content "path\to\.env" -Raw | Format-Hex | Select-Object -First 5
```

BOM 存在：`00000000  EF BB BF 44 41 54 ...`（以 `EF` 开头）
正常文件：`00000000  44 41 54 41 42 41 ...`（以 `D` 开头）

**修复：**
```powershell
$path = "path\to\.env"
$content = [System.IO.File]::ReadAllBytes($path)
if ($content.Length -ge 3 -and $content[0] -eq 0xEF -and $content[1] -eq 0xBB -and $content[2] -eq 0xBF) {
    $content = $content[2..($content.Length-1)]
    [System.IO.File]::WriteAllBytes($path, $content)
    Write-Host "BOM removed."
} else {
    Write-Host "No BOM found."
}
```

**预防：** 始终将 `.env` 保存为 **UTF-8 无 BOM**。
- VS Code：状态栏点击编码 → "Save with Encoding" → "UTF-8"
- Notepad++：Encoding → "Encode in UTF-8"（不是 "UTF-8-BOM"）

### 2. Better Auth `Invalid origin` 错误

**症状：** `POST /api/auth/sign-up/email` 返回 `Invalid origin: http://localhost:5173`

**修复：** 在 `apps/server/src/auth/index.ts` 添加 `trustedOrigins`：
```ts
export const auth = betterAuth({
  // ...
  trustedOrigins: ["http://localhost:5173"],
});
```

### 3. HTTP 500 空响应体

**症状：** `POST /api/auth/sign-up/email` 返回 500 且无响应体。

**修复：** 在 auth handler 添加错误日志：
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

### 4. `BETTER_AUTH_SECRET` 使用占位符

**症状：** `.env` 中 `BETTER_AUTH_SECRET` 为 `change-me-to-a-random-string-at-least-32-chars`

**修复：** 更新为有效密钥：
```bash
# 生成随机密钥
openssl rand -base64 32
```

### 5. CSRF — `Missing or null Origin` 错误

**症状：** `POST /api/auth/organization/set-active` 返回 `Missing or null Origin`

**原因：** Better Auth 要求 `set-active` 等写操作请求携带 `Origin` 头，且值必须匹配 `trustedOrigins`。

**修复：** 浏览器自动携带 `Origin`，无需额外处理。API 测试时需手动添加：
```bash
curl -X POST http://localhost:5173/api/auth/organization/set-active \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"organizationId":"..."}'
```

### 6. `workspace:*` 仅适用于内部包

**症状：** `bun install` 后外部依赖（如 `better-auth`）无法解析。

**原因：** `workspace:*` 协议只适用于 monorepo 内部包，外部依赖必须使用具体版本号。

### 7. shadcn/ui 组件 `asChild` 不工作

**症状：** 使用 shadcn 组件时报 `MenuGroupContext` 错误。

**原因：** 项目使用 `@base-ui/react` 变体，`asChild` 已替换为 `render` prop。

**修复：**
```tsx
// 错误
<DialogTrigger asChild><Button /></DialogTrigger>

// 正确
<DialogTrigger render={<Button />}>Click me</DialogTrigger>
```

## 前后端联调技巧

### 通过 Vite 代理测试 API

```bash
# 健康检查
curl http://localhost:5173/api/health

# 登录（自动携带 Cookie）
curl -X POST http://localhost:5173/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"847960106@qq.com","password":"Test1234!"}' \
  -c cookies.txt

# 使用 Cookie 访问受保护接口
curl http://localhost:5173/api/auth/get-session -b cookies.txt
```

### 完整流程验证（注册 → 建组织 → 设活跃 → 查决策）

```bash
# 1. 注册
curl -X POST http://localhost:5173/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test1234!"}' \
  -c cookies.txt

# 2. 获取组织列表
curl http://localhost:5173/api/auth/organization/list -b cookies.txt

# 3. 设为活跃组织（需 Origin 头）
curl -X POST http://localhost:5173/api/auth/organization/set-active \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"organizationId":"<org-id>"}' \
  -b cookies.txt -c cookies.txt

# 4. 查询决策列表（需活跃组织）
curl http://localhost:5173/api/decisions -b cookies.txt
```

### Bun 自动加载 `.env`

Bun 会自动从工作目录加载 `.env` 文件，无需额外配置 `dotenv`。
