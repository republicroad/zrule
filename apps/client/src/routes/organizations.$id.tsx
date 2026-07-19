import { createRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useSession, organization } from "@/lib/auth-client";
import { rootRoute } from "./__root";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InviteMemberDialog } from "@/components/invite-member-dialog";
import { useEffect, useState } from "react";
import { Building2, Trash2, Users, ArrowLeft } from "lucide-react";
import { Frame, FramePanel } from "@/components/reui/frame";
import { Item, ItemMedia } from "@/components/ui/item";
import { Link } from "@tanstack/react-router";

interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "member";
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface OrgDetail {
  id: string;
  name: string;
  slug: string;
}

function OrganizationDetailPage() {
  const { id } = useParams({ from: "/organizations/$id" });
  const { data: session, isPending: sessionPending } = useSession();
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    if (!sessionPending && !session) {
      navigate({ to: "/login" });
    }
  }, [session, sessionPending, navigate]);

  useEffect(() => {
    async function loadData() {
      setLoadingMembers(true);
      const [orgResult, membersResult] = await Promise.all([
        organization.getFullOrganization({ query: { organizationId: id } }),
        organization.listMembers({ query: { organizationId: id } }),
      ]);
      if (orgResult.data) {
        setOrg(orgResult.data as unknown as OrgDetail);
      }
      if (membersResult.data) {
        setMembers((membersResult.data.members as Member[]) || []);
      }
      setLoadingMembers(false);
    }
    loadData();
  }, [id]);

  async function handleRemoveMember(memberId: string) {
    if (!confirm("确定要移除该成员吗？")) return;
    await organization.removeMember({
      memberIdOrEmail: memberId,
      organizationId: id,
    });
    setMembers(members.filter((m) => m.id !== memberId));
  }

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
        <div className="flex items-center gap-4">
          <Link to="/organizations">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {org?.name || "组织详情"}
            </h1>
            <p className="text-muted-foreground text-sm">{org?.slug}</p>
          </div>
          <InviteMemberDialog organizationId={id} onInvited={async () => {
            const { data } = await organization.listMembers({ query: { organizationId: id } });
            if (data) {
              setMembers((data.members as Member[]) || []);
            }
          }} />
        </div>

        <Frame>
          <FramePanel className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Item className="bg-muted/60 border-background flex size-11 shrink-0 items-center justify-center border-2 p-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.14)] dark:border">
                <ItemMedia variant="icon" className="size-auto">
                  <Users className="h-5 w-5" />
                </ItemMedia>
              </Item>
              <div>
                <h2 className="text-sm font-semibold">成员管理</h2>
                <p className="text-muted-foreground text-sm">管理组织中的成员和角色</p>
              </div>
            </div>

            {loadingMembers ? (
              <p className="text-muted-foreground text-sm">加载成员列表...</p>
            ) : members.length === 0 ? (
              <p className="text-muted-foreground text-sm">暂无成员</p>
            ) : (
              <div className="flex flex-col gap-2">
                {members.map((member) => (
                  <Frame key={member.id}>
                    <FramePanel className="flex items-center justify-between p-3 shadow-none! before:hidden">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted flex size-9 items-center justify-center rounded-full">
                          <span className="text-sm font-medium">
                            {(member.user?.name || member.user?.email || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.user?.name || "未知"}</p>
                          <p className="text-muted-foreground text-xs">{member.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                          {member.role === "owner" ? "所有者" : member.role === "admin" ? "管理员" : "成员"}
                        </Badge>
                        {member.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FramePanel>
                  </Frame>
                ))}
              </div>
            )}
          </FramePanel>
        </Frame>
      </div>
    </div>
  );
}

export const organizationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organizations/$id",
  component: OrganizationDetailPage,
});
