import type { ReactNode, RefObject } from "react"
import { useTranslation } from "react-i18next"
import { X } from "lucide-react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import {
  PHONE_LINK,
  PRODUCT_LOGIN_URL,
} from "@/components/landing/navigation"

export type MobileNavigationSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  finalFocus: RefObject<HTMLButtonElement | null>
  languageControl?: ReactNode
  themeControl?: ReactNode
}

export function MobileNavigationSheet({
  open,
  onOpenChange,
  finalFocus,
  languageControl,
}: MobileNavigationSheetProps) {
  const { t } = useTranslation()

  const navItems = [
    { href: "#about", label: t("nav.about", "Về chúng tôi") },
    { href: "#solutions", label: t("nav.solutions", "Giải pháp") },
    { href: "#how-it-works", label: t("nav.howItWorks", "Quy trình") },
    { href: "#product", label: t("nav.product", "Hộ chiếu số") },
    { href: "#features", label: t("nav.features", "Tính năng") },
    { href: "#industries", label: t("nav.industries", "Lĩnh vực") },
    { href: "#faq", label: t("nav.faq", "Hỏi đáp") },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="mobile-menu"
        side="right"
        className="mobile-menu"
        overlayClassName="mobile-menu-backdrop"
        aria-modal="true"
        finalFocus={finalFocus}
      >
        <div className="mobile-menu__topbar">
          <SheetTitle className="visually-hidden">
            {t("nav.mobileNavTitle", "Điều hướng DeepTrace")}
          </SheetTitle>
          <SheetDescription className="visually-hidden">
            {t("nav.mobileNavDesc", "Các liên kết điều hướng và cài đặt giao diện trên di động.")}
          </SheetDescription>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu__close"
                type="button"
                aria-label={t("nav.menuClose", "Đóng menu")}
              >
                <X className="size-5" aria-hidden="true" />
              </Button>
            }
          />
        </div>
        <nav
          className="mobile-menu__nav"
          aria-label={t("nav.mobileNavTitle", "Điều hướng trên di động")}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              className="mobile-menu__link"
              href={item.href}
              onClick={() => onOpenChange(false)}
            >
              {item.label}
              <ArrowIcon diagonal />
            </a>
          ))}
          <a
            className="mobile-menu__link"
            href={PRODUCT_LOGIN_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => onOpenChange(false)}
          >
            {t("nav.loginPlatform", "Đăng nhập DeepTrace")}
            <ArrowIcon diagonal />
          </a>
          {languageControl}
          <a
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "button button--outline button--header mobile-menu__cta",
            })}
            href={PHONE_LINK}
            onClick={() => onOpenChange(false)}
          >
            {t("nav.consultationShort", "Nhận tư vấn")}
            <ArrowIcon />
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
