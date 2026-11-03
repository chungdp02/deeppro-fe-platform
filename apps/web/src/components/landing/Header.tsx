import { useEffect, useRef, useState, type ComponentType } from "react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import {
  landingNavigation,
  PHONE_LINK,
  PRODUCT_LOGIN_URL,
} from "@/components/landing/navigation"
import { useTheme } from "@/components/theme-provider"

import type { MobileNavigationSheetProps } from "@/components/landing/MobileNavigationSheet"

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function ThemeToggle({ inMenu = false }: { inMenu?: boolean }) {
  const { setTheme } = useTheme()

  const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size={inMenu ? "default" : "icon"}
      className={inMenu ? "theme-toggle theme-toggle--menu" : "theme-toggle"}
      type="button"
      aria-label="Chuyển giữa giao diện sáng và tối"
      title="Chuyển giữa giao diện sáng và tối"
      onClick={toggleTheme}
    >
      <SunIcon className="theme-toggle__icon theme-toggle__icon--sun" />
      <MoonIcon className="theme-toggle__icon theme-toggle__icon--moon" />
      {inMenu ? (
        <span>Giao diện</span>
      ) : (
        <span className="visually-hidden">
          Chuyển giữa giao diện sáng và tối
        </span>
      )}
    </Button>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuLoadState, setMenuLoadState] = useState<
    "idle" | "loading" | "error"
  >("idle")
  const [MobileNavigationSheet, setMobileNavigationSheet] =
    useState<ComponentType<MobileNavigationSheetProps> | null>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const mobileSheetPromiseRef = useRef<Promise<void> | null>(null)

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
          <a className="brand" href="#top" aria-label="DeepTrace, về đầu trang">
            <img
              className="brand__logo brand__logo--light"
              src="/images/deeptrace-logo-light-320.webp"
              alt="DeepTrace"
              width="320"
              height="79"
              loading="lazy"
            />
            <img
              className="brand__logo brand__logo--dark"
              src="/images/deeptrace-logo-white-320.webp"
              alt="DeepTrace"
              width="320"
              height="74"
              loading="lazy"
            />
          </a>

          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {landingNavigation.map((item) => (
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
              Đăng nhập
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
              Đăng ký tư vấn
              <ArrowIcon />
            </a>
            <ThemeToggle />
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
                  ? "Đóng menu"
                  : "Hủy tải menu"
                : menuLoadState === "error"
                  ? "Thử tải menu lại"
                  : "Mở menu"
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
            <span />
            <span />
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
          themeControl={<ThemeToggle inMenu />}
        />
      )}
    </>
  )
}
