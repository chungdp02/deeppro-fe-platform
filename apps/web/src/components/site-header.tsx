import deepTraceLogo from "@/assets/DeepTrace.png"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 lg:px-6">
      <a href="/" aria-label="Trang chủ DeepTrace">
        <img
          src={deepTraceLogo}
          alt="DeepTrace"
          className="h-8 w-auto max-w-40 object-contain"
        />
      </a>

      <SidebarTrigger
        aria-label="Mở hoặc thu gọn thanh điều hướng"
        className="text-primary"
      />
    </header>
  )
}
