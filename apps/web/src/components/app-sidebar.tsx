import * as React from "react"
import { useTranslation } from "react-i18next"
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
      titleKey: "nav.overview",
      url: "#tong-quan",
      icon: <LayoutDashboardIcon />,
    },
    {
      titleKey: "nav.company",
      url: "#cong-ty",
      icon: <Building2Icon />,
    },
    {
      titleKey: "nav.products",
      url: "#san-pham",
      icon: <PackageIcon />,
    },
    {
      titleKey: "nav.employees",
      url: "#nhan-vien",
      icon: <UsersIcon />,
    },
    {
      titleKey: "nav.guide",
      url: "#huong-dan",
      icon: <BookOpenIcon />,
    },
  ],
  navSecondary: [
    {
      titleKey: "nav.settings",
      url: "#cai-dat",
      icon: <Settings2Icon />,
    },
    {
      titleKey: "nav.help",
      url: "#tro-giup",
      icon: <CircleHelpIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-0 p-0">
        <a
          href="#tong-quan"
          aria-label={`DeepTrace - ${t("nav.overview")}`}
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
        <NavMain
          items={data.navMain.map(({ titleKey, ...item }) => ({
            ...item,
            title: t(titleKey),
          }))}
        />
        <NavSecondary
          items={data.navSecondary.map(({ titleKey, ...item }) => ({
            ...item,
            title: t(titleKey),
          }))}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ ...data.user, name: t("user.admin") }} />
      </SidebarFooter>
    </Sidebar>
  )
}
