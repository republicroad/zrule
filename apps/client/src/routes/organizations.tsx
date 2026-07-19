import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSession, organization } from "@/lib/auth-client";
import { rootRoute } from "./__root";
import { Button } from "@/components/ui/button";
import { CreateOrgDialog } from "@/components/create-org-dialog";
import { useEffect, useState } from "react";
import { Building2, ArrowRight, Plus } from "lucide-react";
import { Frame, FramePanel } from "@/components/reui/frame";
import { cn } from "@/lib/utils";

interface Org {
  id: string;
  name: string;
  slug: string;
}

function OrganizationsPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionPending && !session) {
      navigate({ to: "/login" });
    }
  }, [session, sessionPending, navigate]);

  async function loadOrgs() {
    setLoading(true);
    const { data } = await organization.list();
    setOrgs((data as Org[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    if (session) {
      loadOrgs();
    }
  }, [session]);

  if (sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-svh w-full items-start justify-center p-8 md:p-16">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">组织管理</h1>
            <p className="text-muted-foreground text-sm">
              管理你的组织和成员
            </p>
          </div>
          <CreateOrgDialog onCreated={() => loadOrgs()} />
        </div>

        {loading ? (
          <p className="text-muted-foreground">加载中...</p>
        ) : orgs.length === 0 ? (
          <Frame>
            <FramePanel className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">你还没有组织</p>
              <CreateOrgDialog onCreated={() => loadOrgs()} />
            </FramePanel>
          </Frame>
        ) : (
          <div className="grid gap-3 @2xl:grid-cols-2">
            {orgs.map((org) => (
              <Frame key={org.id}>
                <FramePanel className="relative flex flex-col p-0 shadow-none! before:hidden">
                  <div className="flex flex-col gap-3">
                    <div className="bg-muted/60 border-background flex size-11 shrink-0 items-center justify-center border-2 p-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.14)] dark:border">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold">{org.name}</h2>
                    </div>

                    <p className="text-muted-foreground text-sm">{org.slug}</p>

                    <Link to="/organizations/$id" params={{ id: org.id }}>
                      <Button variant="outline" className="w-full justify-between">
                        管理组织
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </FramePanel>
              </Frame>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const organizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organizations",
  component: OrganizationsPage,
});
