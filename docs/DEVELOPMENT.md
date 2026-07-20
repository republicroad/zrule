# ZRule — Development Guide

## Prerequisites

- [Bun](https://bun.sh) (latest)
- [Podman](https://podman.io) (for PostgreSQL)
- Node.js 20+ (for some tooling)

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd zrule
bun install

# 2. Start PostgreSQL
podman compose up -d

# 3. Configure environment
cp apps/server/.env.example apps/server/.env
# Edit .env with your values (see Environment Variables below)

# 4. Generate auth schema & run migrations
cd apps/server
bunx --bun auth@latest generate
bun run db:generate
bun run db:migrate

# 5. Start dev servers (from root)
bun run dev
```

The API runs on `http://localhost:3001` and the React frontend on `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start both server and client concurrently |
| `bun run dev:server` | Start Hono server only |
| `bun run dev:client` | Start Vite dev server only |
| `bun run build` | Build both packages |
| `bun run typecheck` | Type-check all packages |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply migrations to database |
| `bun run db:push` | Push schema directly (dev only) |
| `bun run auth:sync` | Regenerate auth schema from config |

## Environment Variables

`apps/server/.env` (no BOM — see [Troubleshooting](TROUBLESHOOTING.md)):

```env
DATABASE_URL=postgresql://zrule:zrule@localhost:5432/zrule
BETTER_AUTH_SECRET=<random-secret-at-least-32-chars>
BETTER_AUTH_URL=http://localhost:3001
PORT=3001
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173
```

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | — | Secret for session encryption (min 32 chars) |
| `BETTER_AUTH_URL` | Yes | — | Base URL of the auth server |
| `PORT` | No | `3001` | Server port |
| `HOST` | No | `0.0.0.0` | Server bind address |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Comma-separated allowed origins |

## Vite Proxy

The frontend dev server proxies API requests to avoid CORS issues during development:

```
Client (localhost:5173) → /api/* → Server (localhost:3001)
```

Configured in `apps/client/vite.config.ts`:

```ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
    },
  },
},
```

## ReUI Pro Setup

ReUI Pro MCP is configured in `opencode.json`:

```bash
# Install ReUI skill (one-time)
curl -fsSL https://mcp.reui.io/install | bun -
```

License key is set in `apps/client/.env.local` and `components.json`.

## Test Credentials

| Field | Value |
|-------|-------|
| Email | `847960106@qq.com` |
| Password | `Test1234!` |

> **Warning**: These are development-only credentials. Never use in production.

## Proxy Configuration (for network-restricted environments)

### Ubuntu / macOS

```bash
export HTTPS_PROXY=https://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1
```

### PowerShell

```powershell
$env:HTTPS_PROXY="http://127.0.0.1:7890"
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:NO_PROXY="localhost,127.0.0.1"
```
