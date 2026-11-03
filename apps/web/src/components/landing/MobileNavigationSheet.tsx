import type { ReactNode, RefObject } from "react"
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
  landingNavigation,
  PHONE_LINK,
  PRODUCT_LOGIN_URL,
} from "@/components/landing/navigation"

export type MobileNavigationSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  finalFocus: RefObject<HTMLButtonElement | null>
  themeControl: ReactNode
}

export function MobileNavigationSheet({
  open,
  onOpenChange,
  finalFocus,
  themeControl,
}: MobileNavigationSheetProps) {
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
            Điều hướng DeepTrace
          </SheetTitle>
          <SheetDescription className="visually-hidden">
            Các liên kết điều hướng và cài đặt giao diện trên di động.
          </SheetDescription>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu__close"
                type="button"
                aria-label="Đóng menu"
              >
                <span className="mobile-menu__close-icon" aria-hidden="true">
                  ×
                </span>
              </Button>
            }
          />
        </div>
        <nav className="mobile-menu__nav" aria-label="Điều hướng trên di động">
          {landingNavigation.map((item) => (
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
            Đăng nhập DeepTrace
            <ArrowIcon diagonal />
          </a>
          {themeControl}
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
            Nhận tư vấn
            <ArrowIcon />
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
