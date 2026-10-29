import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { ParallaxImage } from "@/components/landing/ParallaxImage"
import { Reveal } from "@/components/landing/Reveal"

const PHONE_LINK = "tel:+84926422522"
const DOCUMENTS_URL = "https://deeptrace.deepprotech.com/documents"
const PRODUCT_LOGIN_URL =
  "https://deeptrace.deepprotech.com/login?redirect=%2Fproduct"
const PRIVACY_URL = "https://deeptrace.deepprotech.com/privacy"
const TERMS_URL = "https://deeptrace.deepprotech.com/terms"
const COOKIE_URL = "https://deeptrace.deepprotech.com/cookie-policy"

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

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="container contact-section__inner">
        <Reveal className="contact-section__copy" variant="zoom-in">
          <h2>Bắt đầu truy xuất nguồn gốc.</h2>
          <p>
            Tham gia nền tảng DeepTrace để đảm bảo sản phẩm an toàn, minh bạch
            từ nguồn gốc trang trại đến tận tay người tiêu dùng.
          </p>
          <div className="contact-section__actions">
            <a
              className="button button--light"
              href={PRODUCT_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              Bắt đầu truy xuất
              <ArrowIcon diagonal />
            </a>
            <a className="button button--outline-light" href={PHONE_LINK}>
              Nhận tư vấn
              <ArrowIcon />
            </a>
          </div>
        </Reveal>
        <Reveal className="contact-section__visual" delay={100} variant="glow-pulse">
          <ParallaxImage
            src="/images/vegetable-box.jpg"
            webpSrc="/images/vegetable-box.webp"
            alt="Rau củ tươi được thu hoạch tại vườn"
            width="1200"
            height="600"
            speed={0.12}
          />
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__main">
          {/* Cột 1: Thương hiệu */}
          <div className="site-footer__brand">
            <a
              className="site-footer__logo-panel"
              href="#top"
              aria-label="DeepTrace, về đầu trang"
            >
              <img
                src="/images/deeptrace-logo-white.png"
                alt="DeepTrace"
                width="170"
                height="40"
              />
            </a>
            <p>
              Nền tảng truy xuất nguồn gốc blockchain hàng đầu, đảm bảo minh bạch
              và an toàn cho mọi sản phẩm từ nguồn gốc đến người tiêu dùng.
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

          {/* Cột 2: LIÊN KẾT NHANH */}
          <div className="site-footer__column">
            <h2>LIÊN KẾT NHANH</h2>
            <nav aria-label="Liên kết nhanh">
              {quickLinks.map((item) => (
                <a href={item.href} key={item.label}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Cột 3: HỖ TRỢ */}
          <div className="site-footer__column">
            <h2>HỖ TRỢ</h2>
            <nav aria-label="Hỗ trợ và tài liệu">
              {supportLinks.map((item) => (
                <a
                  href={item.href}
                  key={item.label}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Cột 4: LIÊN HỆ */}
          <div className="site-footer__column site-footer__contact">
            <h2>LIÊN HỆ</h2>
            <div className="site-footer__contact-list">
              <a className="site-footer__contact-item" href={PHONE_LINK}>
                <span className="site-footer__contact-icon" aria-hidden="true">
                  <PhoneIcon />
                </span>
                <span className="site-footer__contact-text">+84 926 422 522</span>
              </a>

              <div className="site-footer__contact-item site-footer__contact-address">
                <span className="site-footer__contact-icon" aria-hidden="true">
                  <MapPinIcon />
                </span>
                <address className="site-footer__contact-text">
                  T4.10 - Tầng 4 - Chung cư La Astoria 3,
                  <br />
                  383 đường Nguyễn Duy Trinh,
                  <br />
                  Phường Bình Trưng Tây, TP. Thủ Đức, TPHCM
                </address>
              </div>

              <a
                className="site-footer__contact-item"
                href="mailto:contact@deepprotech.com"
              >
                <span className="site-footer__contact-icon" aria-hidden="true">
                  <MailIcon />
                </span>
                <span className="site-footer__contact-text">
                  contact@deepprotech.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Chân trang đáy */}
        <div className="site-footer__bottom">
          <span className="site-footer__copyright">
            © 2026 Bản quyền thuộc về DeepTrace.
          </span>

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
            <a className="site-footer__back-to-top" href="#top">
              Về đầu trang
              <ArrowIcon diagonal />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
