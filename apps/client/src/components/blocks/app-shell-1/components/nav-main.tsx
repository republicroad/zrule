"use client"

import { useState } from "react"
import { Link, useLocation } from "@tanstack/react-router"

import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NAV_MAIN, NAV_SECONDARY, type NavItem, type SecondaryItem } from "./data"
import { ChevronRightIcon } from "lucide-react"

function NavItemComponent({ item }: { item: NavItem }) {
  const location = useLocation()
  const isActive = item.href ? location.pathname === item.href : false

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.label}
        isActive={isActive}
        render={item.href ? <Link to={item.href} /> : undefined}
      >
        {item.icon}
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SecondaryItemComponent({ item }: { item: SecondaryItem }) {
  const location = useLocation()
  const isActive = item.href ? location.pathname === item.href : false

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.label}
        isActive={isActive}
        render={item.href ? <Link to={item.href} /> : undefined}
      >
        {item.icon}
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavMain() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>导航</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1!">
            {NAV_MAIN.map((item) => (
              <NavItemComponent key={item.id} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>其他</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1!">
            {NAV_SECONDARY.map((item) => (
              <SecondaryItemComponent key={item.id} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
