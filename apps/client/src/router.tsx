import { createRouter, createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import { loginRoute } from "./routes/login";
import { registerRoute } from "./routes/register";
import { dashboardRoute } from "./routes/dashboard";
import { organizationsRoute } from "./routes/organizations";
import { organizationDetailRoute } from "./routes/organizations.$id";
import { authClient } from "./lib/auth-client";

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/login" });
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  organizationsRoute,
  organizationDetailRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
