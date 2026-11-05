import { useTranslation } from "react-i18next"
import { Phone, Mail, MapPin, ArrowUp } from "lucide-react"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import {
  PHONE_LINK,
  PRODUCT_LOGIN_URL,
  DOCUMENTS_URL,
  PRIVACY_URL,
  TERMS_URL,
  COOKIE_URL,
} from "@/components/landing/navigation"

export function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { href: "#about", label: t("footer.aboutUs", "Về chúng tôi") },
    { href: "#solutions", label: t("footer.solutions", "Giải pháp nền tảng") },
    { href: "#how-it-works", label: t("footer.process", "Quy trình vận hành") },
    { href: "#product", label: t("footer.passport", "Hộ chiếu sản phẩm số") },
    { href: "#features", label: t("nav.features", "Tính năng nổi bật") },
    { href: "#industries", label: t("nav.industries", "Ngành hàng ứng dụng") },
  ]

  const supportLinks = [
    { href: DOCUMENTS_URL, label: t("footer.documentation", "Trung tâm trợ giúp"), external: true },
    { href: "#contact", label: t("finalCta.secondaryBtn", "Liên hệ tư vấn") },
    { href: "#faq", label: t("nav.faq", "Câu hỏi thường gặp") },
    { href: PRIVACY_URL, label: t("footer.privacy", "Chính sách bảo mật"), external: true },
    { href: TERMS_URL, label: t("footer.terms", "Điều khoản dịch vụ"), external: true },
  ]

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <a
              className="site-footer__logo"
              href="#top"
              aria-label={t("nav.brandAria", "DeepTrace, về đầu trang")}
            >
              <img
                src="/images/deeptrace-logo-white-320.webp"
                alt="DeepTrace"
                width="320"
                height="74"
                loading="lazy"
                decoding="async"
              />
            </a>
            <p>
              {t(
                "footer.desc",
                "Nền tảng truy xuất nguồn gốc ứng dụng công nghệ Blockchain, hỗ trợ minh bạch và an toàn cho chuỗi cung ứng từ nơi sản xuất đến người tiêu dùng."
              )}
            </p>
            <a
              className="site-footer__product-link"
              href={PRODUCT_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t("nav.loginPlatform", "Đăng nhập DeepTrace")}
              <ArrowIcon diagonal />
            </a>
          </div>

          <nav className="site-footer__column" aria-label={t("footer.quickLinks", "Liên kết nhanh")}>
            <h2>{t("footer.quickLinks", "LIÊN KẾT NHANH")}</h2>
            {quickLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </nav>

          <nav className="site-footer__column" aria-label={t("footer.support", "Hỗ trợ và tài liệu")}>
            <h2>{t("footer.support", "HỖ TRỢ")}</h2>
            {supportLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-footer__column site-footer__contact">
            <h2>{t("footer.contact", "LIÊN HỆ")}</h2>
            <a href={PHONE_LINK}>
              <Phone size={15} aria-hidden="true" />
              <span>+84 926 422 522</span>
            </a>
            <a href="mailto:contact@deepprotech.com">
              <Mail size={15} aria-hidden="true" />
              <span>contact@deepprotech.com</span>
            </a>
            <address>
              <MapPin size={15} aria-hidden="true" />
              <span>
                {t("footer.addressDetail", "T4.10 - Tầng 4 - Chung cư La Astoria 3, 383 đường Nguyễn Duy Trinh, Phường Bình Trưng Tây, TP. Thủ Đức, TPHCM")}
              </span>
            </address>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>{t("footer.copyright", "© 2026 Bản quyền thuộc về DeepTrace.")}</span>
          <div className="site-footer__legal">
            <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
              {t("footer.privacy", "Chính Sách Bảo Mật")}
            </a>
            <a href={TERMS_URL} target="_blank" rel="noreferrer">
              {t("footer.terms", "Điều Khoản Sử Dụng")}
            </a>
            <a href={COOKIE_URL} target="_blank" rel="noreferrer">
              Cookie Policy
            </a>
          </div>
          <a href="#top" className="site-footer__back-to-top">
            {t("footer.backToTop", "Về đầu trang")}
            <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
