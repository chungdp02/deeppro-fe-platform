import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="[--sidebar-width-icon:4rem]! [--sidebar-width:13.5rem]!">
      <AppSidebar variant="sidebar" />
      <SidebarInset className="min-w-0 bg-muted">
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
