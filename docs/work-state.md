# ZRule - Work State

## Project Overview

Full-stack decision rule engine built as a monorepo with Hono backend, React frontend, Better Auth, PostgreSQL, and Drizzle ORM.

- **Server:** `apps/server` — Hono + Bun
- **Client:** `apps/client` — React 19 + Vite + TanStack Router
- **Shared:** `packages/shared`
- **Database:** PostgreSQL 17 in Podman (`zrule-postgres`)
- **ORM:** Drizzle ORM 0.40.1 + drizzle-kit 0.30.5
- **Auth:** Better Auth 1.6.23 with organization plugin
- **UI:** shadcn/ui + Tailwind CSS v4 + ReUI registry

## Test Credentials

- **Email:** `847960106@qq.com`
- **Password:** `Test1234!`

## Server URLs

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`
- Vite proxies `/api` → `localhost:3001`

## Completed

- [x] Database migration: Drizzle schema with `decisions` table FKs to `organization` and `user` (CASCADE delete)
- [x] Created migration `0000_fluffy_earthquake.sql` (8 tables, 8 FK constraints, 20 total)
- [x] Installed shadcn/ui: tailwindcss, @tailwindcss/vite, class-variance-authority, clsx, tailwind-merge
- [x] Created auth client at `src/lib/auth-client.ts` using `better-auth/react`
- [x] Created routes: `__root.tsx`, `login.tsx`, `register.tsx`, `dashboard.tsx` using `createRootRoute`/`createRoute`
- [x] Created `src/router.tsx` with index redirect, TanStack Router `Register` module augmentation
- [x] Wired up `src/main.tsx` with `QueryClientProvider` + `RouterProvider`
- [x] Added shadcn components: button, card, input, label, separator
- [x] Registered ReUI registry in `components.json`
- [x] Added `trustedOrigins: ["http://localhost:5173"]` to Better Auth config
- [x] Added try-catch error logging to auth handler in `src/index.ts`
- [x] Upgraded better-auth to 1.6.23 on both server and client
- [x] Upgraded Vite to 8.1.5
- [x] Removed UTF-8 BOM from `apps/server/.env`
- [x] Full registration + login + session verified working via API and Vite proxy
- [x] Created `docs/debug-integration.md`
- [x] Removed `preload.ts` (was at `apps/server/tmp/preload.ts`)

## In Progress

- (none)

## Next Steps

- [ ] Add protected routes on backend (JWT/session middleware validation)
- [ ] Implement decisions CRUD UI in dashboard
- [ ] Add organization management features
- [ ] Add logout functionality
- [ ] Add error boundaries and loading states
- [ ] Set up proper error handling and validation (Zod)
- [ ] Write tests for auth and decisions flows

## Key Technical Notes

- `.env` BOM (UTF-8 Byte Order Mark `0xEF 0xBB 0xBF`) was root cause of first-line env var parsing failure — removed via byte manipulation
- Bun auto-loads `.env` from working directory
- Dev script is `bun --watch src/index.ts`

## Key Files

| File | Purpose |
|------|---------|
| `apps/server/.env` | Environment variables |
| `apps/server/src/index.ts` | Hono server entry, auth handler, CORS, session middleware |
| `apps/server/src/auth/index.ts` | Better Auth config with `trustedOrigins`, `organization()`, drizzleAdapter |
| `apps/server/src/db/index.ts` | PostgreSQL connection via `postgres` + drizzle |
| `apps/server/src/db/schema/auth.ts` | Auth tables |
| `apps/server/src/db/schema/decisions.ts` | Decisions table with FK refs |
| `apps/server/src/middleware/auth.ts` | Session middleware |
| `apps/server/src/routes/decisions.ts` | CRUD routes for decisions |
| `apps/client/src/lib/auth-client.ts` | Better Auth React client |
| `apps/client/src/routes/` | Login, register, dashboard, root layouts |
| `apps/client/src/router.tsx` | Route tree |
| `apps/client/src/main.tsx` | Entry point |
| `apps/client/vite.config.ts` | Vite config with proxy |
| `apps/client/components.json` | shadcn config with ReUI registry |
