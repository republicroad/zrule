# ZRule — API Reference

Base URL: `http://localhost:3001` (direct) or `http://localhost:5173` (via Vite proxy)

## Authentication

Better Auth endpoints handle all auth operations. The client uses cookie-based sessions.

### Sign Up

```
POST /api/auth/sign-up/email
```

**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "emailVerified": false,
    "image": null,
    "createdAt": "2026-07-17T12:35:28.292Z",
    "updatedAt": "2026-07-17T12:35:28.292Z"
  }
}
```

### Sign In

```
POST /api/auth/sign-in/email
```

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "redirect": false,
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

Sets `better-auth.session_token` cookie.

### Sign Out

```
POST /api/auth/sign-out
```

**Response (200):**
```json
{ "success": true }
```

### Get Session

```
GET /api/auth/get-session
```

**Headers:**
- `Cookie: better-auth.session_token=<token>` (set automatically by sign-in)

**Response (200):**
```json
{
  "session": {
    "id": "string",
    "userId": "string",
    "token": "string",
    "expiresAt": "2026-07-24T12:35:44.751Z",
    "activeOrganizationId": "string | null",
    "createdAt": "2026-07-17T12:35:28.292Z",
    "updatedAt": "2026-07-17T12:35:28.292Z"
  },
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

**Response (no session):** `null`

## Organization Management

All organization endpoints require authentication (session cookie). The `set-active` endpoint requires the `Origin` header matching `trustedOrigins` (CSRF protection).

### Create Organization

```
POST /api/auth/organization/create
```

**Request:**
```json
{
  "name": "string",
  "slug": "string"
}
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "logo": null,
  "createdAt": "2026-07-18T15:25:52.991Z",
  "members": [...]
}
```

### Set Active Organization

```
POST /api/auth/organization/set-active
```

**Headers:** `Origin: http://localhost:5173` (required)

**Request:**
```json
{
  "organizationId": "string"
}
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string"
}
```

### List Organizations

```
GET /api/auth/organization/list
```

**Response (200):** Array of organization objects.

### Get Full Organization

```
GET /api/auth/organization/get-full-organization
```

**Response (200):** Organization with nested `members` and `invitations`.

### List Members

```
GET /api/auth/organization/list-members
```

**Response (200):**
```json
{
  "members": [
    {
      "id": "string",
      "userId": "string",
      "organizationId": "string",
      "role": "owner",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ],
  "total": 1
}
```

### Invite Member

```
POST /api/auth/organization/invite-member
```

**Request:**
```json
{
  "email": "string",
  "role": "member" | "admin",
  "organizationId": "string"
}
```

### Remove Member

```
POST /api/auth/organization/remove-member
```

**Request:**
```json
{
  "memberIdOrEmail": "string",
  "organizationId": "string"
}
```

## Decisions

All decisions endpoints require authentication and an active organization (`requireAuth` middleware).

### List Decisions

```
GET /api/decisions
```

**Response (200):** Array of decision objects, sorted by `updatedAt` descending.

### Get Decision

```
GET /api/decisions/:id
```

**Response (200):** Single decision object.

**Response (404):** `{ "error": "Not found" }`

### Create Decision

```
POST /api/decisions
```

**Request:**
```json
{
  "name": "string (required)",
  "slug": "string (required)",
  "description": "string | null (optional)",
  "graph": {
    "nodes": [],
    "edges": []
  }
}
```

**Response (201):** Created decision object.

### Update Decision

```
PUT /api/decisions/:id
```

**Request:** Any subset of `name`, `slug`, `description`, `graph`. The `version` field is auto-incremented.

**Response (200):** Updated decision object.

**Response (404):** `{ "error": "Not found" }`

### Delete Decision (Soft)

```
DELETE /api/decisions/:id
```

**Response (200):** `{ "success": true }`

**Response (404):** `{ "error": "Not found" }`

## Health Check

```
GET /api/health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-07-17T12:36:02.652Z"
}
```

## Error Responses

| Status | Body | Common Cause |
|--------|------|-------------|
| 400 | `{ "error": "No active organization" }` | Missing `organization.setActive()` call |
| 401 | `{ "error": "Unauthorized" }` | No session cookie or invalid token |
| 404 | `{ "error": "Not found" }` | Decision ID doesn't exist or belongs to another org |
| 422 | `{ "message": "...", "code": "..." }` | Validation error (missing required fields) |
| 500 | `{ "error": "Internal auth error" }` | Server-side error (check logs) |

## Client-Side Auth API

The React client (`apps/client/src/lib/auth-client.ts`) exports:

```ts
import { signIn, signUp, signOut, useSession, organization } from "@/lib/auth-client";

// Sign in
await signIn.email({ email, password });

// Sign up
await signUp.email({ name, email, password });

// Sign out
await signOut();

// Current session (reactive)
const { data: session, isPending } = useSession();

// Organization operations
await organization.create({ name, slug });
await organization.setActive({ organizationId });
await organization.list();
await organization.getFullOrganization();
await organization.listMembers();
await organization.inviteMember({ email, role, organizationId });
await organization.removeMember({ memberIdOrEmail, organizationId });
```
