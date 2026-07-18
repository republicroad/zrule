import { createRoute, useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { rootRoute } from "./__root";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

function DashboardPage() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: "/login" });
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{session.user.name || "N/A"}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Active organization: {session.session.activeOrganizationId || "None"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Decision management coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});
