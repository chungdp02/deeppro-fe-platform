import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { setLanguage } from "@/i18n"

export function LanguageSwitcher({ inMenu = false }: { inMenu?: boolean }) {
  const { i18n, t } = useTranslation()
  const currentLang = (i18n.language || "vi").startsWith("en") ? "en" : "vi"
  const nextLang = currentLang === "vi" ? "en" : "vi"

  const toggleLanguage = () => {
    setLanguage(nextLang)
  }

  return (
    <Button
      variant="ghost"
      size={inMenu ? "default" : "sm"}
      className={
        inMenu
          ? "language-switcher language-switcher--menu"
          : "language-switcher"
      }
      type="button"
      aria-label={
        currentLang === "vi"
          ? t("nav.switchToEn", "Chuyển sang Tiếng Anh (English)")
          : t("nav.switchToVi", "Chuyển sang Tiếng Việt")
      }
      title={
        currentLang === "vi"
          ? "Switch to English"
          : "Chuyển sang Tiếng Việt"
      }
      onClick={toggleLanguage}
    >
      <Globe className="language-switcher__icon" size={16} aria-hidden="true" />
      <span className="language-switcher__badge" aria-hidden="true">
        {currentLang.toUpperCase()}
      </span>
      {inMenu && (
        <span className="language-switcher__label">
          {currentLang === "vi" ? "Tiếng Việt" : "English"}
        </span>
      )}
    </Button>
  )
}
