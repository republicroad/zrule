import type { MiddlewareHandler } from "hono";
import { auth } from "../auth/index.ts";

export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  c.set("activeOrganization", session?.session?.activeOrganizationId ?? null);
  await next();
};

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const user = c.get("user");
  const session = c.get("session");
  if (!user || !session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (!session.activeOrganizationId) {
    return c.json({ error: "No active organization" }, 400);
  }
  await next();
};
