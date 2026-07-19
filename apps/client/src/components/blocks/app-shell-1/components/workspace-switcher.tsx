"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import { cn } from "@/lib/utils"
import { organization } from "@/lib/auth-client"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CheckIcon, MoreHorizontalIcon, PlusIcon, Building2Icon } from "lucide-react"

interface Org {
  id: string
  name: string
  slug: string
}

function getOrgInitials(name: string): string {
  return name.charAt(0).toUpperCase()
}

function OrgLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg",
        className
      )}
      aria-hidden="true"
    >
      <Building2Icon className="size-4" />
    </span>
  )
}

function SidebarLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center",
        className
      )}
    >
      <OrgLogo className="absolute top-1/2 left-1/2 origin-center -translate-x-1/2 -translate-y-1/2 scale-75" />
    </span>
  )
}

export function WorkspaceSwitcher() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [activeOrg, setActiveOrg] = useState<Org | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadOrgs() {
      const { data } = await organization.list()
      if (data) {
        setOrgs(data as Org[])
      }
    }
    async function loadActiveOrg() {
      const { data } = await organization.getFullOrganization()
      if (data) {
        setActiveOrg(data as unknown as Org)
      }
    }
    loadOrgs()
    loadActiveOrg()
  }, [])

  async function handleSwitchOrg(org: Org) {
    await organization.setActive({ organizationId: org.id })
    setActiveOrg(org)
    window.location.reload()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="h-9"
                aria-label="Switch organization"
              />
            }
          >
            <SidebarLogo className="transition-[margin] duration-300 ease-in-out in-data-[state=collapsed]:-ml-1" />
            <div className="truncate font-semibold">
              {activeOrg?.name || "选择组织"}
            </div>
            <MoreHorizontalIcon aria-hidden="true" className="ml-auto size-3.5 opacity-60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="start" sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>组织</DropdownMenuLabel>
              <DropdownMenuGroup>
                {orgs.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleSwitchOrg(org)}
                  >
                    <Avatar size="sm" className="size-6! shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground rounded-md text-sm">
                        {getOrgInitials(org.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">{org.name}</span>
                    {activeOrg?.id === org.id && (
                      <CheckIcon aria-hidden="true" className="ml-auto size-3.5" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/organizations" })}>
                <PlusIcon aria-hidden="true" className="mx-1 size-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">管理组织</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
