import { pgTable, text, uuid, jsonb, integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const decisions = pgTable("decisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
  graph: jsonb("graph").notNull().default({ nodes: [], edges: [] }),
  version: integer("version").notNull().default(1),
  organizationId: text("organization_id").notNull(),
  createdById: text("created_by_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
