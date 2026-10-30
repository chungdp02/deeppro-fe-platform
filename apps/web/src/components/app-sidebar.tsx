import * as React from "react"
import deepTraceLogo from "@/assets/DeepTrace.png"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@workspace/ui/components/sidebar"
import {
  LayoutDashboardIcon,
  Building2Icon,
  PackageIcon,
  UsersIcon,
  BookOpenIcon,
  Settings2Icon,
  CircleHelpIcon,
} from "lucide-react"
const data = {
  user: {
    name: "Quản trị viên",
    email: "abz.jsc@gmail.com",
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-0 p-0">
        <a
          href="#tong-quan"
          aria-label="DeepTrace - Tổng quan"
          className="flex h-16 items-center border-b border-sidebar-border/20 px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span className="relative block h-9 w-44 overflow-hidden group-data-[collapsible=icon]:w-9">
            <img
              src={deepTraceLogo}
              alt="DeepTrace"
              className="absolute -top-3.5 -left-2.5 h-16 w-auto max-w-none brightness-0 invert"
            />
          </span>
        </a>
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
