import type { User, Session } from "better-auth/types";

interface SessionWithOrg extends Session {
  activeOrganizationId?: string | null;
}

declare module "hono" {
  interface ContextVariableMap {
    user: User | null;
    session: SessionWithOrg | null;
    activeOrganization: string | null;
  }
}
