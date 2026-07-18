import { defineConfig } from "drizzle-kit";
console.log("Bun.env.DATABASE_URL:", Bun.env.DATABASE_URL);
console.log("process.env.DATABASE_URL:", process.env.DATABASE_URL);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
