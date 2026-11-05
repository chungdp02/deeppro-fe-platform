import { type ReactNode } from "react"
import { NavLink, useLocation } from "react-router"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

type NavItem = {
  title: string
  url: string
  icon?: ReactNode
}

export function NavMain({ items }: { items: NavItem[] }) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                className="h-10 text-[15px] [&_svg]:size-[18px]"
                tooltip={item.title}
                isActive={pathname === item.url}
                render={<NavLink to={item.url} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
