import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth/index.ts";
import { sessionMiddleware } from "./middleware/auth.ts";
import decisionsRouter from "./routes/decisions.ts";

const app = new Hono();

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  "/api/*",
  cors({
    origin: corsOrigins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  try {
    return await auth.handler(c.req.raw);
  } catch (err) {
    console.error("[Auth Error]", err);
    return c.json({ error: "Internal auth error" }, 500);
  }
});

app.use("/api/*", sessionMiddleware);

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.route("/api/decisions", decisionsRouter);

export { app };
