import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth/index.ts";
import { sessionMiddleware } from "./middleware/auth.ts";
import decisionsRouter from "./routes/decisions.ts";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.use("/api/*", sessionMiddleware);

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.route("/api/decisions", decisionsRouter);

const port = Number(process.env.PORT ?? 3001);

serve(
  { fetch: app.fetch, port },
  (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
  },
);
