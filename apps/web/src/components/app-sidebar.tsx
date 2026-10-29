import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import deepTraceLogo from "@/assets/DeepTrace.png"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import {
    LayoutDashboardIcon,
  Building2Icon,
  PackageIcon,
  UsersIcon,
  BookOpenIcon,
  Settings2Icon,
  CircleHelpIcon,
} from "lucide-react";
const data = {
  user: {
    name: "ABC",
    email: "ABC@example.com",
    avatar: "",
  },
  navMain: [
    {
  title: "Tổng quan",
  url: "#tong-quan",
  icon: <LayoutDashboardIcon />,
},
    {
      title: "Công ty",
      url: "#cong-ty",
      icon: <Building2Icon />,
    },
    {
      title: "Sản phẩm",
      url: "#san-pham",
      icon: <PackageIcon />,
    },
    {
      title: "Nhân viên",
      url: "#nhan-vien",
      icon: <UsersIcon />,
    },
    {
      title: "Hướng dẫn",
      url: "#huong-dan",
      icon: <BookOpenIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Cài đặt",
      url: "#cai-dat",
      icon: <Settings2Icon />,
    },
    {
      title: "Trợ giúp",
      url: "#tro-giup",
      icon: <CircleHelpIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              
              <img  
                src={deepTraceLogo}               
               alt="DeepTrace" 
               className="h-8 w-auto max-w-full object-contain" 
               />
            </SidebarMenuButton>
          </SidebarMenuItem>                  

        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
