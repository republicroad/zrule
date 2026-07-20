# ZRule — Work State

> Current project status. See [Architecture](ARCHITECTURE.md) for technical details, [Development](DEVELOPMENT.md) for setup.

## Completed

### Database & Schema
- [x] Drizzle schema with 8 tables: user, session, account, verification, organization, member, invitation, decisions
- [x] 8 foreign key constraints (CASCADE delete on org→decisions)
- [x] Migration `0000_fluffy_earthquake.sql` (20 total constraints)

### Backend
- [x] Hono server with dual runtime support (Bun + Node.js)
- [x] Server refactored: `app.ts` extracted from `index.ts` for in-process testing
- [x] Better Auth with organization plugin, `trustedOrigins`, CORS config
- [x] `sessionMiddleware` + `requireAuth` middleware
- [x] Protected decisions routes with `requireAuth` at router level
- [x] Decisions CRUD routes with Zod validation
- [x] API integration tests: 21 tests across 3 files, all passing

### Frontend - Auth & Layout
- [x] Better Auth React client with organization plugin
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
- [x] `DropdownMenuLabel` fix — wraps `GroupLabel` in `MenuPrimitive.Group`

### Frontend - Components
- [x] shadcn components installed (button, card, input, dialog, sidebar, etc.)
- [x] `CreateOrgDialog` — creates org + sets active
- [x] `InviteMemberDialog` — invites member by email with role selection

### Integration
- [x] Full registration → org create → set active → session verified
- [x] Full login → session check → cookie propagation
- [x] Sign-out clears session
- [x] All auth/org/decisions endpoints verified through Vite proxy
- [x] All 21 backend integration tests passing
- [x] TypeScript typecheck passing (server + client)

## In Progress

- (none)

## Next Steps

- [ ] Implement decisions CRUD UI in dashboard (list/create/edit/delete)
- [ ] Add decisions table/list view with real data from API
- [ ] Add error boundaries and loading states
- [ ] Clean up test data (flow-test@example.com)
- [ ] Add decision creation form with `slug` field (required by API)

## Key Technical Notes

- `.env` BOM was root cause of first-line env var parsing failure — see [Troubleshooting](TROUBLESHOOTING.md#1-env-第一行变量读不到bom-问题)
- shadcn components use `@base-ui/react` — `render` prop instead of `asChild`
- Better Auth CSRF requires `Origin` header matching `trustedOrigins`
- `workspace:*` only works for internal monorepo packages, NOT external deps
- Decisions API requires `activeOrganizationId` on session (set via `organization.setActive`)
- Decisions create requires `name`, `slug`, optional `description` and `graph`
