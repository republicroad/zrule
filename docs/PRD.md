# ZRule — Product Requirements Document

## Product Overview

ZRule is an **open-source, self-hosted decision rule engine** with a visual JDM (JSON Decision Model) editor, multi-tenant organizations, and robust authentication. Inspired by [GoRules BRMS](https://editor.gorules.io/).

## Core Features

### 1. Visual Rule Engine
- Drag-and-drop decision graph canvas
- Decision tables (spreadsheet-style, hit policies, unary operators)
- Expression nodes (ZEN expression language)
- Function nodes (custom JS, Monaco editor, TypeScript checking, built-in libs: dayjs, big.js, zod)
- Switch nodes (conditional branching)
- JSON output in portable JDM format
- Version history on every save

### 2. Authentication & Authorization
- Email/password sign up and sign in
- Multi-tenant organizations (team-level isolation of decision models)
- Role-based access: owner, admin, member per organization
- Secure HTTP-only cookie sessions
- API endpoints scoped to user's organization memberships

### 3. API

See [API Reference](API.md) for complete endpoint documentation.

## Implementation Roadmap

### Phase 1 — Scaffold & Database ✅
- [x] Initialize Bun workspaces (server + client)
- [x] Podman Compose for PostgreSQL
- [x] Drizzle configuration and PostgreSQL client
- [x] Decision models schema (id, name, slug, org_id, graph JSONB, version, timestamps)

### Phase 2 — Authentication (Better Auth) ✅
- [x] Better Auth with Drizzle adapter (`provider: "pg"`)
- [x] Auth schema generation via CLI (user, session, account, verification, organization, member, invitation tables)
- [x] `emailAndPassword` plugin
- [x] `organization` plugin for multi-tenancy
- [x] Mount auth handler on `/api/auth/*`
- [x] CORS configuration
- [x] Session middleware (user, session, activeOrganization in Hono context)

### Phase 3 — Rule Engine API ✅
- [x] Decision CRUD routes scoped to organization memberships
- [x] JDM graph stored as JSONB in PostgreSQL
- [x] Version tracking via `version` column
- [x] Zod validation for request bodies

### Phase 4 — React Frontend 🔄
- [x] Vite + React + TanStack Router scaffolding
- [x] Tailwind CSS + shadcn/ui setup
- [x] Login/signup pages (Better Auth React client)
- [x] Organization switcher and management page
- [ ] Decision list dashboard with TanStack Query
- [ ] Decision editor page with `@gorules/jdm-editor`

### Phase 5 — Polish
- [ ] Loading states, error boundaries, toast notifications
- [ ] `@hono/zod-validator` for request validation
- [ ] Optional: ZEN Engine WASM for in-browser simulation

## Non-Functional Requirements

- **Self-hosted**: deployable via Podman Compose
- **Open-source**: MIT license
- **Multi-tenant**: data isolation per organization
- **Type-safe end-to-end**: TypeScript, Drizzle ORM, Zod validation
