import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

function RootLayout() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
          <Link to="/" className="text-lg font-semibold">
            ZRule
          </Link>
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {session.user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-screen-xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export const rootRoute = createRootRoute({
  component: RootLayout,
});
