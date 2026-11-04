import { useTranslation } from "react-i18next"
import { changeAppLanguage } from "@/i18n"
import { Button } from "@workspace/ui/components/button"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

export function SiteHeader() {
  const { t, i18n } = useTranslation()
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 lg:px-8">
      <SidebarTrigger
        aria-label="Mở rộng hoặc thu gọn thanh điều hướng"
        className="text-primary"
      />
      <div className="flex items-center gap-1" aria-label={t("language")}>
        <Button
          type="button"
          size="sm"
          variant={i18n.language === "vi" ? "secondary" : "ghost"}
          aria-label="Tiếng Việt"
          aria-pressed={i18n.language === "vi"}
          onClick={() => void changeAppLanguage("vi")}
        >
          VI
        </Button>
        <Button
          type="button"
          size="sm"
          variant={i18n.language === "en" ? "secondary" : "ghost"}
          aria-label="English"
          aria-pressed={i18n.language === "en"}
          onClick={() => void changeAppLanguage("en")}
        >
          EN
        </Button>
      </div>
    </header>
  )
}
