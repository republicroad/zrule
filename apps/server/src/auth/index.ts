import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.ts";
import { organization } from "better-auth/plugins";
import * as schema from "../db/schema/index.ts";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: { enabled: true },
  plugins: [organization()],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim()),
});
