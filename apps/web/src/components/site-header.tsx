import { SidebarTrigger } from "@workspace/ui/components/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background px-4 lg:px-8">
      <SidebarTrigger
        aria-label="Mở rộng hoặc thu gọn thanh điều hướng"
        className="text-primary"
      />
    </header>
  )
}
