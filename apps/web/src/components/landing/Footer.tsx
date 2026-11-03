import { ArrowIcon } from "@/components/landing/ArrowIcon"
import {
  PHONE_LINK,
  PRODUCT_LOGIN_URL,
  DOCUMENTS_URL,
  PRIVACY_URL,
  TERMS_URL,
  COOKIE_URL,
} from "@/components/landing/navigation"

const quickLinks = [
  { href: "#solutions", label: "Về chúng tôi" },
  { href: "#features", label: "Dịch vụ & Tính năng" },
  { href: "#solutions", label: "Giải pháp truy xuất" },
  { href: "#how-it-works", label: "Quy trình vận hành" },
  { href: "#industries", label: "Ngành hàng ứng dụng" },
]

const supportLinks = [
  { href: DOCUMENTS_URL, label: "Trung tâm trợ giúp", external: true },
  { href: "#contact", label: "Liên hệ tư vấn" },
  { href: "#faq", label: "Câu hỏi thường gặp" },
  { href: PRIVACY_URL, label: "Chính sách bảo mật", external: true },
  { href: TERMS_URL, label: "Điều khoản dịch vụ", external: true },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <a
              className="site-footer__logo"
              href="#top"
              aria-label="DeepTrace, về đầu trang"
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
              Nền tảng truy xuất nguồn gốc blockchain hàng đầu, đảm bảo minh
              bạch và an toàn cho mọi sản phẩm từ nguồn gốc đến người tiêu dùng.
            </p>
            <a
              className="site-footer__product-link"
              href={PRODUCT_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              Đăng nhập DeepTrace
              <ArrowIcon diagonal />
            </a>
          </div>

          <nav className="site-footer__column" aria-label="Liên kết nhanh">
            <h2>LIÊN KẾT NHANH</h2>
            {quickLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </nav>

          <nav className="site-footer__column" aria-label="Hỗ trợ và tài liệu">
            <h2>HỖ TRỢ</h2>
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
            <h2>LIÊN HỆ</h2>
            <a href={PHONE_LINK}>+84 926 422 522</a>
            <a href="mailto:contact@deepprotech.com">contact@deepprotech.com</a>
            <address>
              T4.10 - Tầng 4 - Chung cư La Astoria 3,
              <br />
              383 đường Nguyễn Duy Trinh,
              <br />
              Phường Bình Trưng Tây, TP. Thủ Đức, TPHCM
            </address>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 Bản quyền thuộc về DeepTrace.</span>
          <div className="site-footer__legal">
            <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
              Chính Sách Bảo Mật
            </a>
            <a href={TERMS_URL} target="_blank" rel="noreferrer">
              Điều Khoản Sử Dụng
            </a>
            <a href={COOKIE_URL} target="_blank" rel="noreferrer">
              Cookie Policy
            </a>
          </div>
          <a href="#top" className="site-footer__back-to-top">
            Về đầu trang
            <ArrowIcon diagonal />
          </a>
        </div>
      </div>
    </footer>
  )
}
