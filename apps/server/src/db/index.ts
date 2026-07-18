
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.ts";

const connectionString = process.env.DATABASE_URL;
console.log("Bun.env.DATABASE_URL:", Bun.env.DATABASE_URL);
console.log("process.env.DATABASE_URL:", connectionString);
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Make sure .env file is loaded.");
}
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
