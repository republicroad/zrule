"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useNavigate } from "@tanstack/react-router"

import { cn } from "@/lib/utils"
import { useSession, signOut } from "@/lib/auth-client"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SunIcon, MoonIcon, MonitorIcon, UserIcon, SettingsIcon, LogOutIcon, MoreHorizontalIcon } from "lucide-react"

function getInitials(name: string | null | undefined, email: string): string {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }
  return email.charAt(0).toUpperCase()
}

function ThemeSegmentedToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (theme ?? "system") : "system"

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="bg-muted/60 inline-flex items-center gap-0.5 rounded-full p-0.5"
    >
      {[
        { value: "light", label: "Light", icon: <SunIcon className="size-3.5" aria-hidden="true" /> },
        { value: "dark", label: "Dark", icon: <MoonIcon className="size-3.5" aria-hidden="true" /> },
        { value: "system", label: "System", icon: <MonitorIcon className="size-3.5" aria-hidden="true" /> },
      ].map(({ value, label, icon }) => {
        const isActive = currentTheme === value
        return (
          <Button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            variant="ghost"
            size="icon-xs"
            onClick={() => setTheme(value)}
            className={cn(
              "rounded-full",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {icon}
          </Button>
        )
      })}
    </div>
  )
}

export function NavUser() {
  const { data: session } = useSession()
  const navigate = useNavigate()
  const { isMobile } = useSidebar()

  if (!session) return null

  const user = session.user
  const initials = getInitials(user.name, user.email)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="bg-background border-border h-auto shrink-0 border p-1.5 text-sm shadow-sm shadow-black/5 group-data-[collapsible=icon]:justify-center"
            render={<SidebarMenuButton size="lg" aria-label="Open user menu" />}
          >
            <Avatar className="size-6 transition-all duration-300 ease-in-out in-data-[state=collapsed]:size-7!">
              <AvatarFallback className="bg-primary text-primary-foreground rounded-md">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">{user.name || user.email}</span>
            </div>
            <MoreHorizontalIcon className="mr-1 ml-auto size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" aria-hidden="true" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={8}
            className="w-60"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2.5 py-2">
                <Avatar className="size-8 rounded-md">
                  <AvatarFallback className="bg-primary text-primary-foreground rounded-md">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="text-foreground text-sm font-semibold">
                    {user.name || "User"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon aria-hidden="true" />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon aria-hidden="true" />
                设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-default focus:bg-transparent!">
                <span aria-hidden="true" className="size-3.5" />
                主题
                <div className="ml-auto">
                  <ThemeSegmentedToggle />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => {
                await signOut()
                navigate({ to: "/login" })
              }}>
                <LogOutIcon aria-hidden="true" />
                退出登录
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
