import type { User, Session } from "better-auth/types";

declare module "hono" {
  interface ContextVariableMap {
    user: User | null;
    session: Session | null;
    activeOrganization: string | null;
  }
}
