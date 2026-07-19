# ZRule - Work State

## Project Overview

Full-stack decision rule engine built as a monorepo with Hono backend, React frontend, Better Auth, PostgreSQL, and Drizzle ORM.

- **Server:** `apps/server` — Hono + Bun
- **Client:** `apps/client` — React 19 + Vite 8.1.5 + TanStack Router
- **Shared:** `packages/shared`
- **Database:** PostgreSQL 17 in Podman (`zrule-postgres`)
- **ORM:** Drizzle ORM 0.40.1 + drizzle-kit 0.30.5
- **Auth:** Better Auth 1.6.23 with organization plugin
- **UI:** shadcn/ui (base-ui variants) + Tailwind CSS v4 + ReUI Pro blocks
- **Test Account:** `847960106@qq.com` / `Test1234!`

## Server URLs

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`
- Vite proxies `/api` → `localhost:3001`

## Completed

### Database & Schema
- [x] Drizzle schema with 8 tables: user, session, account, verification, organization, member, invitation, decisions
- [x] 8 foreign key constraints (CASCADE delete on org→decisions)
- [x] Migration `0000_fluffy_earthquake.sql` (20 total constraints)

### Backend
- [x] Hono server with dual runtime support (Bun + Node.js)
- [x] Server refactored: `app.ts` extracted from `index.ts` for in-process testing
- [x] Better Auth with organization plugin, `trustedOrigins`, CORS config
- [x] CORS/`CORS_ORIGINS` env var with comma-separated origins
- [x] `sessionMiddleware` + `requireAuth` middleware (`apps/server/src/middleware/auth.ts`)
- [x] Protected decisions routes with `requireAuth` at router level
- [x] Decisions CRUD routes with Zod validation (`apps/server/src/routes/decisions.ts`)
- [x] `.env` BOM fix documented (`docs/skills-env-bom.md`)
- [x] API integration tests: 21 tests across 3 files, all passing

### Frontend - Auth & Layout
- [x] Better Auth React client with organization plugin (`apps/client/src/lib/auth-client.ts`)
- [x] TanStack Router with code-based routing, index redirect
- [x] `__root.tsx` dual-mode layout: unauthenticated → simple Outlet, authenticated → AppShell
- [x] Login page — auth-1 style (grid background, password toggle, sonner toasts)
- [x] Register page — auth-1 style (auto-creates org on signup)
- [x] Dashboard page — dashboard-1 style (stat cards + quick actions)
- [x] Organizations list — settings-1 Frame/FramePanel card layout
- [x] Organization detail — settings panel style with member management

### Frontend - App Shell (ReUI Pro)
- [x] ReUI Pro blocks installed: auth-1, dashboard-1, settings-1, app-shell-1
- [x] `AppShell` component accepts children, renders sidebar layout
- [x] `OrgSwitcher` — lists real orgs, switches active org via `organization.setActive()`
- [x] `NavMain` — real nav items (仪表盘, 决策规则, 组织管理) with `Link` + `useLocation`
- [x] `NavUser` — real session data, initials avatar, theme toggle, signOut
- [x] `data.tsx` — ZRule nav items and types
- [x] `DropdownMenuLabel` fix — wraps `GroupLabel` in `MenuPrimitive.Group` to fix MenuGroupContext error

### Frontend - Components
- [x] shadcn components installed: button, card, input, label, separator, dialog, dropdown-menu, sidebar, sheet, avatar, breadcrumb, tooltip, skeleton, spinner, popover, progress, tabs, calendar, chart, field, input-group, item, textarea, badge, frame
- [x] `CreateOrgDialog` — creates org + sets active
- [x] `InviteMemberDialog` — invites member by email with role selection

### Integration
- [x] Full registration → org create → set active → session verified
- [x] Full login → session check → cookie propagation
- [x] Sign-out clears session
- [x] All auth/org/decisions endpoints verified through Vite proxy (port 5173)
- [x] All 21 backend integration tests passing
- [x] TypeScript typecheck passing (server + client)

## In Progress

- (none)

## Next Steps

- [ ] Implement decisions CRUD UI in dashboard (list/create/edit/delete)
- [ ] Add decisions table/list view with real data from API
- [ ] Add error boundaries and loading states
- [ ] Add logout button visibility in NavUser (already implemented, verify UI)
- [ ] Clean up test data (flow-test@example.com)
- [ ] Add decision creation form with `slug` field (required by API)

## Key Technical Notes

- `.env` BOM (UTF-8 Byte Order Mark `0xEF 0xBB 0xBF`) was root cause of first-line env var parsing failure — removed, documented in `docs/skills-env-bom.md`
- Bun auto-loads `.env` from working directory
- Dev script: `bun --watch src/index.ts` (server), `bun dev` (client)
- shadcn components use `@base-ui/react` — `render` prop instead of `asChild`
- Better Auth CSRF requires `Origin` header matching `trustedOrigins`
- `workspace:*` only works for internal monorepo packages, NOT external deps like better-auth
- Better Auth endpoints: `/api/auth/sign-in/email`, `/api/auth/sign-up/email`, `/api/auth/sign-out`, `/api/auth/get-session`
- Organization endpoints: `/api/auth/organization/{create,set-active,list,get-full-organization,list-members,invite-member,remove-member}`
- Decisions API requires `activeOrganizationId` on session (set via `organization.setActive`)
- Decisions create requires `name`, `slug`, optional `description` and `graph`

## Key Files

| File | Purpose |
|------|---------|
| `apps/server/.env` | Environment variables (no BOM) |
| `apps/server/src/app.ts` | Hono app (CORS, auth handler, routes) — extracted for testing |
| `apps/server/src/index.ts` | Server startup (imports app.ts) |
| `apps/server/src/auth/index.ts` | Better Auth config with organization plugin |
| `apps/server/src/db/index.ts` | PostgreSQL connection via `postgres` + drizzle |
| `apps/server/src/db/schema/auth.ts` | Auth tables |
| `apps/server/src/db/schema/decisions.ts` | Decisions table with FK refs |
| `apps/server/src/middleware/auth.ts` | `sessionMiddleware` + `requireAuth` |
| `apps/server/src/routes/decisions.ts` | CRUD routes for decisions |
| `apps/server/src/__tests__/helpers.ts` | Test helpers (auth, cookies, CSRF) |
| `apps/server/src/__tests__/auth.test.ts` | Auth API tests (5 tests) |
| `apps/server/src/__tests__/organization.test.ts` | Org API tests (5 tests) |
| `apps/server/src/__tests__/decisions.test.ts` | Decisions API tests (11 tests) |
| `apps/client/src/lib/auth-client.ts` | Better Auth React client with org exports |
| `apps/client/src/router.tsx` | Route tree with index redirect |
| `apps/client/src/main.tsx` | Entry point |
| `apps/client/src/routes/__root.tsx` | Dual-mode root layout (auth vs authenticated) |
| `apps/client/src/routes/login.tsx` | Login page (auth-1 style) |
| `apps/client/src/routes/register.tsx` | Register page (auth-1 style) |
| `apps/client/src/routes/dashboard.tsx` | Dashboard (dashboard-1 style) |
| `apps/client/src/routes/organizations.tsx` | Org list (settings-1 style) |
| `apps/client/src/routes/organizations.$id.tsx` | Org detail with member mgmt |
| `apps/client/src/components/ui/dropdown-menu.tsx` | Fixed DropdownMenuLabel (MenuGroupContext) |
| `apps/client/src/components/create-org-dialog.tsx` | Create org dialog |
| `apps/client/src/components/invite-member-dialog.tsx` | Invite member dialog |
| `apps/client/src/components/blocks/app-shell-1/` | Sidebar layout (OrgSwitcher, NavMain, NavUser) |
| `apps/client/src/components/blocks/auth-1/` | Login form with grid background |
| `apps/client/src/components/blocks/dashboard-1/` | Dashboard with chart cards |
| `apps/client/src/components/blocks/settings-1/` | Settings with service cards |
| `apps/client/components.json` | shadcn config with ReUI registry |
| `apps/client/vite.config.ts` | Vite config with `/api` proxy |
| `docs/work-state.md` | This file |
| `docs/debug-integration.md` | Integration debugging notes |
| `docs/skills-env-bom.md` | .env BOM issue documentation |
