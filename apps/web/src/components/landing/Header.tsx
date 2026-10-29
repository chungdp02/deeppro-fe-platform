import { useEffect, useRef, useState } from "react"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { useTheme } from "@/components/theme-provider"

const PRODUCT_LOGIN_URL = "https://deeptrace.deepprotech.com/login?redirect=%2Fproduct"
const PHONE_LINK = "tel:+84926422522"

const navigation = [
  { href: "#solutions", label: "Giải pháp" },
  { href: "#product", label: "Sản phẩm" },
  { href: "#how-it-works", label: "Quy trình" },
  { href: "#industries", label: "Ngành hàng" },
]

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
    <button
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
        <span className="visually-hidden">Chuyển giữa giao diện sáng và tối</span>
      )}
    </button>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
        menuToggleRef.current?.focus()
      }
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [isMenuOpen])

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1121px)")
    const closeOnDesktop = () => { if (desktop.matches) setIsMenuOpen(false) }
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

  const closeMenu = () => {
    setIsMenuOpen(false)
    if (isMenuOpen) menuToggleRef.current?.focus({ preventScroll: true })
  }

  return (
    <header className={isScrolled ? "site-header is-scrolled" : "site-header"}
      onBlur={(event) => {
        if (isMenuOpen && !event.currentTarget.contains(event.relatedTarget)) setIsMenuOpen(false)
      }}>
      <div className="container site-header__inner">
        <a className="brand" href="#top" aria-label="DeepTrace, về đầu trang" onClick={closeMenu}>
          <img
            className="brand__logo brand__logo--light"
            src="/images/deeptrace-logo-light.png"
            alt="DeepTrace"
            width="170"
            height="40"
          />
          <img
            className="brand__logo brand__logo--dark"
            src="/images/deeptrace-logo-white.png"
            alt="DeepTrace"
            width="170"
            height="40"
          />
        </a>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <a className="desktop-nav__link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a
            className="site-header__login"
            href={PRODUCT_LOGIN_URL}
            target="_blank"
            rel="noreferrer"
          >
            Đăng nhập
            <ArrowIcon diagonal />
          </a>
          <a className="button button--header" href={PHONE_LINK}>
            Nhận tư vấn
            <ArrowIcon />
          </a>
          <ThemeToggle />
        </div>

        <button
          ref={menuToggleRef}
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        className={isMenuOpen ? "mobile-menu is-open" : "mobile-menu"}
        id="mobile-menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <nav className="mobile-menu__nav" aria-label="Điều hướng trên di động">
          {navigation.map((item) => (
            <a
              className="mobile-menu__link"
              href={item.href}
              key={item.href}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={closeMenu}
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
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            Đăng nhập DeepTrace
            <ArrowIcon diagonal />
          </a>
          <ThemeToggle inMenu />
          <a
            className="button button--header mobile-menu__cta"
            href={PHONE_LINK}
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            Nhận tư vấn
            <ArrowIcon />
          </a>
        </nav>
      </div>
    </header>
  )
}
