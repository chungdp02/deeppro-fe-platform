import { useEffect, useRef, useState, type ComponentType } from "react"
import { useTranslation } from "react-i18next"
import { Menu, X } from "lucide-react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import {
  PHONE_LINK,
  PRODUCT_LOGIN_URL,
} from "@/components/landing/navigation"
import { LanguageSwitcher } from "./LanguageSwitcher"
import type { MobileNavigationSheetProps } from "@/components/landing/MobileNavigationSheet"

export function Header() {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuLoadState, setMenuLoadState] = useState<
    "idle" | "loading" | "error"
  >("idle")
  const [MobileNavigationSheet, setMobileNavigationSheet] =
    useState<ComponentType<MobileNavigationSheetProps> | null>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const mobileSheetPromiseRef = useRef<Promise<void> | null>(null)

  const navItems = [
    { href: "#about", label: t("nav.about", "Về chúng tôi") },
    { href: "#solutions", label: t("nav.solutions", "Giải pháp") },
    { href: "#how-it-works", label: t("nav.howItWorks", "Quy trình") },
    { href: "#product", label: t("nav.product", "Hộ chiếu số") },
    { href: "#features", label: t("nav.features", "Tính năng") },
    { href: "#industries", label: t("nav.industries", "Lĩnh vực") },
    { href: "#faq", label: t("nav.faq", "Hỏi đáp") },
  ]

  const loadMobileNavigation = () => {
    if (MobileNavigationSheet || mobileSheetPromiseRef.current) return

    setMenuLoadState("loading")
    mobileSheetPromiseRef.current = import("./MobileNavigationSheet")
      .then((module) => {
        setMobileNavigationSheet(() => module.MobileNavigationSheet)
        setMenuLoadState("idle")
      })
      .catch((error: unknown) => {
        console.error("DeepTrace mobile navigation could not load", error)
        mobileSheetPromiseRef.current = null
        setMenuLoadState("error")
        setIsMenuOpen(false)
      })
  }

  const toggleMobileMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
      return
    }

    setIsMenuOpen(true)
    if (!MobileNavigationSheet) loadMobileNavigation()
  }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1121px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMenuOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  useEffect(() => {
    let ticking = false
    const updateHeaderState = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nextValue = window.scrollY > 24
          setIsScrolled((currentValue) =>
            currentValue === nextValue ? currentValue : nextValue
          )
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", updateHeaderState, { passive: true })
    return () => window.removeEventListener("scroll", updateHeaderState)
  }, [])

  return (
    <>
      <header
        className={isScrolled ? "site-header is-scrolled" : "site-header"}
      >
        <div className="site-header__inner container">
          <a
            className="brand"
            href="#top"
            aria-label={t("nav.brandAria", "DeepTrace, về đầu trang")}
          >
            <img
              className="brand__logo brand__logo--dark"
              src="/images/deeptrace-logo-white-320.webp"
              alt="DeepTrace"
              width="320"
              height="74"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </a>

          <nav
            className="desktop-nav"
            aria-label={t("nav.mobileNavTitle", "Điều hướng chính")}
          >
            {navItems.map((item) => (
              <a className="desktop-nav__link" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <a
              className={buttonVariants({
                size: "lg",
                className: "site-header__login button--login",
              })}
              href={PRODUCT_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t("nav.login", "Đăng nhập")}
              <ArrowIcon diagonal />
            </a>
            <a
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "button button--outline button--header",
              })}
              href={PHONE_LINK}
            >
              {t("nav.consultation", "Đăng ký tư vấn")}
              <ArrowIcon />
            </a>
            <LanguageSwitcher />
          </div>

          <Button
            ref={menuToggleRef}
            variant="ghost"
            size="icon"
            className="menu-toggle"
            type="button"
            aria-label={
              isMenuOpen
                ? MobileNavigationSheet
                  ? t("nav.menuClose", "Đóng menu")
                  : t("nav.menuCancel", "Hủy tải menu")
                : menuLoadState === "error"
                  ? t("nav.menuRetry", "Thử tải menu lại")
                  : t("nav.menuOpen", "Mở menu")
            }
            aria-expanded={isMenuOpen && Boolean(MobileNavigationSheet)}
            aria-controls={
              isMenuOpen && MobileNavigationSheet ? "mobile-menu" : undefined
            }
            aria-busy={menuLoadState === "loading" ? "true" : undefined}
            aria-describedby={
              menuLoadState !== "idle" ? "mobile-menu-status" : undefined
            }
            onClick={toggleMobileMenu}
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
          <span
            id="mobile-menu-status"
            className="visually-hidden"
            role="status"
            aria-live="polite"
          >
            {menuLoadState === "loading" && isMenuOpen
              ? "Đang tải menu điều hướng. Nhấn nút lần nữa để hủy."
              : menuLoadState === "error"
                ? "Không thể tải menu điều hướng. Hãy thử lại."
                : ""}
          </span>
        </div>
      </header>
      {MobileNavigationSheet && (
        <MobileNavigationSheet
          open={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          finalFocus={menuToggleRef}
          languageControl={<LanguageSwitcher inMenu />}
        />
      )}
    </>
  )
}
