import { type ReactNode } from "react"
import { HouseIcon, GitBranchIcon, Building2Icon, SettingsIcon, UsersIcon, BookOpenIcon, CopyIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react"

// ── Types ──

export type NavChild = {
  id: string
  label: string
  href?: string
  isActive?: boolean
}

export type NavItem = {
  id: string
  label: string
  icon: ReactNode
  badge?: string | number
  isActive?: boolean
  href?: string
  children?: NavChild[]
}

export type SecondaryItem = {
  id: string
  label: string
  icon: ReactNode
  href?: string
}

export type Workspace = {
  id: string
  name: string
  slug?: string
  imageUrl?: string
  avatarClassName?: string
}

// ── Nav Main ──

export const NAV_MAIN: NavItem[] = [
  {
    id: "dashboard",
    label: "仪表盘",
    icon: <HouseIcon aria-hidden="true" />,
    href: "/dashboard",
  },
  {
    id: "decisions",
    label: "决策规则",
    icon: <GitBranchIcon aria-hidden="true" />,
    href: "/dashboard",
  },
  {
    id: "organizations",
    label: "组织管理",
    icon: <Building2Icon aria-hidden="true" />,
    href: "/organizations",
  },
]

// ── Nav Secondary ──

export const NAV_SECONDARY: SecondaryItem[] = [
  {
    id: "settings",
    label: "设置",
    icon: <SettingsIcon aria-hidden="true" />,
    href: "/organizations",
  },
  {
    id: "docs",
    label: "文档",
    icon: <BookOpenIcon aria-hidden="true" />,
  },
]

// ── Item Actions (legacy, kept for type compatibility) ──

export type ItemAction = {
  id: string
  label: string
  icon: ReactNode
  destructive?: boolean
}

export const ITEM_ACTIONS: ItemAction[] = [
  { id: "copy", label: "Copy", icon: <CopyIcon aria-hidden="true" /> },
  { id: "open", label: "Open in new tab", icon: <ExternalLinkIcon aria-hidden="true" /> },
  { id: "delete", label: "Delete", icon: <Trash2Icon aria-hidden="true" />, destructive: true },
]

// ── Pinned Resources (legacy, kept for type compatibility) ──

export type PinnedResource = {
  id: string
  name: string
  color: string
  env?: string
}

export const PINNED_RESOURCES: PinnedResource[] = []
