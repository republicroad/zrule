import type { Context, MiddlewareHandler } from "hono";
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
