import DashboardPage from "./app/dashboard/page"
import CompanyPage from "./app/dashboard/company_page"
import { useCurrentPage } from "./hooks/use-current-page"
import { AppSidebar } from "./components/app-sidebar"
import { SiteHeader } from "./components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

const pendingPages: Record<string, string> = {
  "#san-pham": "Sản phẩm",
  "#nhan-vien": "Nhân viên",
  "#huong-dan": "Hướng dẫn",
  "#cai-dat": "Cài đặt",
  "#tro-giup": "Trợ giúp",
}

export function App() {
  const page = useCurrentPage()
  if (page === "#tong-quan") return <DashboardPage />
  if (page === "#cong-ty") return <CompanyPage />

  return (
    <SidebarProvider className="flex-col [--sidebar-width:13.5rem]!">
      <SiteHeader />
      <div className="flex min-h-0 flex-1">
        <AppSidebar
          variant="sidebar"
          className="top-16 h-[calc(100svh-4rem)]"
        />
        <SidebarInset className="min-w-0 bg-muted">
          <main className="p-4 md:p-8">
            <h1 className="text-2xl font-semibold">
              {pendingPages[page] ?? "Không tìm thấy trang"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {pendingPages[page]
                ? "Chức năng này đang được phát triển."
                : "Vui lòng chọn một mục trong thanh điều hướng."}
            </p>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
