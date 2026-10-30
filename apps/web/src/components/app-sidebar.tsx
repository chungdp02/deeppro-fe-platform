import * as React from "react"
import { useCurrentPage } from "@/hooks/use-current-page"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  const page = useCurrentPage()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="pt-3">
        {page === "#cong-ty" && (
          <div className="mx-3 border-b border-sidebar-border/30 px-1 pt-2 pb-4">
            <p className="text-[15px] leading-6 font-semibold text-sidebar-foreground">
              Công ty Cổ phần Thực phẩm ABZ
            </p>
          </div>
        )}
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
