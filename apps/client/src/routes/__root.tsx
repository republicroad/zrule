import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import { AppShell } from "@/components/blocks/app-shell-1/components/app-shell";

function AuthLayout() {
  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  );
}

function AuthenticatedLayout() {
  return (
    <TooltipProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </TooltipProvider>
  );
}

function RootLayout() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (session) {
    return <AuthenticatedLayout />;
  }

  return <AuthLayout />;
}

export const rootRoute = createRootRoute({
  component: RootLayout,
});
