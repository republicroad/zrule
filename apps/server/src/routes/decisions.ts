import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq, and, isNull, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { decisions } from "../db/schema/index.ts";

const createDecisionSchema = z.object({
  name: z.string().min(1).max(256),
  slug: z.string().min(1).max(256),
  description: z.string().nullable().optional(),
  graph: z.object({
    nodes: z.array(z.unknown()),
    edges: z.array(z.unknown()),
  }).optional().default({ nodes: [], edges: [] }),
});

const updateDecisionSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  slug: z.string().min(1).max(256).optional(),
  description: z.string().nullable().optional(),
  graph: z.object({
    nodes: z.array(z.unknown()),
    edges: z.array(z.unknown()),
  }).optional(),
});

const decisionsRouter = new Hono<{
  Variables: {
    user: { id: string } | null;
    session: { activeOrganizationId?: string } | null;
  };
}>();

decisionsRouter.get("/", async (c) => {
  const user = c.get("user");
  const session = c.get("session");
  if (!user || !session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const orgId = session.activeOrganizationId;
  if (!orgId) {
    return c.json({ error: "No active organization" }, 400);
  }

  const list = await db
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.organizationId, orgId),
        isNull(decisions.deletedAt),
      ),
    )
    .orderBy(sql`${decisions.updatedAt} desc`);

  return c.json(list);
});

decisionsRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const session = c.get("session");
  if (!user || !session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const orgId = session.activeOrganizationId;
  if (!orgId) {
    return c.json({ error: "No active organization" }, 400);
  }

  const id = c.req.param("id");
  const decision = await db
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.id, id),
        eq(decisions.organizationId, orgId),
        isNull(decisions.deletedAt),
      ),
    )
    .then((rows) => rows[0] ?? null);

  if (!decision) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(decision);
});

decisionsRouter.post("/", zValidator("json", createDecisionSchema), async (c) => {
  const user = c.get("user");
  const session = c.get("session");
  if (!user || !session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const orgId = session.activeOrganizationId;
  if (!orgId) {
    return c.json({ error: "No active organization" }, 400);
  }

  const body = c.req.valid("json");
  const decision = await db
    .insert(decisions)
    .values({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      graph: body.graph,
      organizationId: orgId,
      createdById: user.id,
    })
    .returning()
    .then((rows) => rows[0]);

  return c.json(decision, 201);
});

decisionsRouter.put("/:id", zValidator("json", updateDecisionSchema), async (c) => {
  const user = c.get("user");
  const session = c.get("session");
  if (!user || !session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const orgId = session.activeOrganizationId;
  if (!orgId) {
    return c.json({ error: "No active organization" }, 400);
  }

  const id = c.req.param("id");
  const body = c.req.valid("json");

  const existing = await db
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.id, id),
        eq(decisions.organizationId, orgId),
        isNull(decisions.deletedAt),
      ),
    )
    .then((rows) => rows[0] ?? null);

  if (!existing) {
    return c.json({ error: "Not found" }, 404);
  }

  const updated = await db
    .update(decisions)
    .set({
      ...body,
      version: existing.version + 1,
    })
    .where(eq(decisions.id, id))
    .returning()
    .then((rows) => rows[0]);

  return c.json(updated);
});

decisionsRouter.delete("/:id", async (c) => {
  const user = c.get("user");
  const session = c.get("session");
  if (!user || !session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const orgId = session.activeOrganizationId;
  if (!orgId) {
    return c.json({ error: "No active organization" }, 400);
  }

  const id = c.req.param("id");
  const existing = await db
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.id, id),
        eq(decisions.organizationId, orgId),
        isNull(decisions.deletedAt),
      ),
    )
    .then((rows) => rows[0] ?? null);

  if (!existing) {
    return c.json({ error: "Not found" }, 404);
  }

  await db
    .update(decisions)
    .set({ deletedAt: new Date() })
    .where(eq(decisions.id, id));

  return c.json({ success: true });
});

export default decisionsRouter;
