# ZRule — Open-Source Rule Engine

A self-hosted decision rule engine with a visual JDM (JSON Decision Model) editor, multi-tenant organizations, and robust authentication. Inspired by [GoRules BRMS](https://editor.gorules.io/) — fully open-source.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) |
| Backend | [Hono](https://hono.dev) + [Drizzle ORM](https://orm.drizzle.team) |
| Database | PostgreSQL |
| Auth | [Better Auth](https://better-auth.com) (email/password + Organization) |
| Frontend | React 19 + Vite + [TanStack Router](https://tanstack.com/router) |
| Rule Editor | [@gorules/jdm-editor](https://github.com/gorules/jdm-editor) |
| Styling | Tailwind CSS + shadcn/ui + ReUI Pro |

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd zrule
bun install

# 2. Start PostgreSQL
podman compose up -d

# 3. Configure environment
cp apps/server/.env.example apps/server/.env
# Edit .env with your values

# 4. Generate auth schema & run migrations
cd apps/server
bunx --bun auth@latest generate
bun run db:generate
bun run db:migrate

# 5. Start dev servers (from root)
bun run dev
```

API: `http://localhost:3001` · Frontend: `http://localhost:5173`

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start both server and client |
| `bun run dev:server` | Start Hono server only |
| `bun run dev:client` | Start Vite dev server only |
| `bun run build` | Build both packages |
| `bun run typecheck` | Type-check all packages |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply migrations to database |

## Documentation

| Doc | Description |
|-----|-------------|
| [Architecture](docs/ARCHITECTURE.md) | Tech stack, project structure, data model, key patterns |
| [Development](docs/DEVELOPMENT.md) | Environment setup, env vars, running, proxy config |
| [API Reference](docs/API.md) | Complete API endpoint documentation |
| [PRD](docs/PRD.md) | Product requirements and roadmap |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and debugging tips (中文) |
| [Work State](docs/work-state.md) | Current project status and next steps |

## License

MIT
