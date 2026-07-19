import { useNavigate } from "@tanstack/react-router";
import { useSession, organization } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Building2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Org {
  id: string;
  name: string;
  slug: string;
}

export function OrgSwitcher() {
  const { data: session } = useSession();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [activeOrg, setActiveOrg] = useState<Org | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOrgs() {
      const { data } = await organization.list();
      if (data) {
        setOrgs(data as Org[]);
      }
    }
    async function loadActiveOrg() {
      const { data } = await organization.getFullOrganization();
      if (data) {
        setActiveOrg(data as unknown as Org);
      }
    }
    if (session) {
      loadOrgs();
      loadActiveOrg();
    }
  }, [session]);

  if (!session || orgs.length === 0) {
    return null;
  }

  async function handleSwitchOrg(orgId: string) {
    await organization.setActive({ organizationId: orgId });
    window.location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-2" />}>
        <Building2 className="h-4 w-4" />
        <span className="max-w-[150px] truncate">
          {activeOrg?.name || "选择组织"}
        </span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>组织</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {orgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitchOrg(org.id)}
            className={org.id === activeOrg?.id ? "bg-accent" : ""}
          >
            <span className="truncate">{org.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/organizations" })}>
          <Building2 className="mr-2 h-4 w-4" />
          管理组织
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
