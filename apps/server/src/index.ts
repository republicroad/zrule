import { app } from "./app.ts";

const port = Number(process.env.PORT ?? 3001);
const hostname = process.env.HOST ?? "0.0.0.0";

if (typeof globalThis.Bun !== "undefined") {
  const server = Bun.serve({
    fetch: app.fetch,
    port,
    hostname,
  });
  console.log(`Server running on http://${server.hostname}:${server.port}`);
} else {
  const { serve } = await import("@hono/node-server");
  serve(
    { fetch: app.fetch, port, hostname },
    (info) => {
      console.log(`Server running on http://${info.address}:${info.port}`);
    },
  );
}
