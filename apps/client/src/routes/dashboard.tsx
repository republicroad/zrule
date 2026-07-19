import { createRoute, useNavigate } from "@tanstack/react-router";
import { useSession, organization } from "@/lib/auth-client";
import { rootRoute } from "./__root";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Building2, GitBranch, Users, ArrowRight, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface OrgDetail {
  id: string;
  name: string;
  slug: string;
}

interface Stats {
  orgCount: number;
  memberCount: number;
}

function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [activeOrg, setActiveOrg] = useState<OrgDetail | null>(null);
  const [stats, setStats] = useState<Stats>({ orgCount: 0, memberCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: "/login" });
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    async function loadData() {
      const [orgResult, membersResult, orgsResult] = await Promise.all([
        organization.getFullOrganization(),
        organization.listMembers(),
        organization.list(),
      ]);

      if (orgResult.data) {
        setActiveOrg(orgResult.data as unknown as OrgDetail);
      }
      if (membersResult.data) {
        setStats((prev) => ({
          ...prev,
          memberCount: (membersResult.data.members as any[])?.length || 0,
        }));
      }
      if (orgsResult.data) {
        setStats((prev) => ({
          ...prev,
          orgCount: (orgsResult.data as any[])?.length || 0,
        }));
      }
    }
    if (session) {
      loadData();
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="text-foreground @container mx-auto flex w-full max-w-7xl flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">仪表盘</h1>
          <p className="text-muted-foreground text-sm">
            欢迎回来, {session.user.name || session.user.email}
          </p>
        </div>
      </div>

      <section aria-label="统计概览" className="grid gap-3 @2xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">当前组织</CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrg?.name || "无"}</div>
            <p className="text-muted-foreground text-xs">
              {activeOrg?.slug || "未设置"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">组织数量</CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orgCount}</div>
            <p className="text-muted-foreground text-xs">已创建的组织</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成员数量</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.memberCount}</div>
            <p className="text-muted-foreground text-xs">当前组织成员</p>
          </CardContent>
        </Card>
      </section>

      <section aria-label="快速操作" className="grid gap-3 @5xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              决策规则
            </CardTitle>
            <CardDescription>
              管理和创建您的决策规则
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              决策规则管理功能即将上线
            </p>
            <Button variant="outline" className="w-full" disabled>
              <Plus className="mr-2 h-4 w-4" />
              创建决策规则
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              组织管理
            </CardTitle>
            <CardDescription>
              管理组织成员和设置
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeOrg ? (
              <Link to="/organizations/$id" params={{ id: activeOrg.id }}>
                <Button variant="outline" className="w-full justify-between">
                  管理 {activeOrg.name}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/organizations">
                <Button variant="outline" className="w-full justify-between">
                  创建组织
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});
