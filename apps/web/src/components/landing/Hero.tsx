import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { PRODUCT_LOGIN_URL } from "@/components/landing/navigation"

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__layout container">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            DeepTrace · Truy xuất nguồn gốc Blockchain
          </p>
          <h1 id="hero-title">
            <span>Truy xuất nguồn gốc.</span>
            <span>Ứng dụng Blockchain.</span>
          </h1>
          <p className="hero__description">
            Theo dõi sản phẩm của bạn từ trang trại đến tay người tiêu dùng với
            nền tảng truy xuất nguồn gốc toàn diện ứng dụng công nghệ
            Blockchain.
          </p>
          <div className="hero__actions">
            <a
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "button button--primary",
              })}
              href={PRODUCT_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              Bắt đầu truy xuất
              <ArrowIcon diagonal />
            </a>
            <a className="text-link" href="#solutions">
              Khám phá giải pháp
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero__scope">
            Chuỗi cung ứng Dược phẩm <span aria-hidden="true">·</span> Nông sản
            thực phẩm <span aria-hidden="true">·</span> Hàng tiêu dùng minh
            bạch.
          </p>
        </div>
        <figure className="hero__visual">
          <picture>
            <source
              media="(max-width: 980px)"
              srcSet="/images/v10-hero-harvest-mobile-480.webp 480w, /images/v10-hero-harvest-mobile-672.webp 672w, /images/v10-hero-harvest-mobile-960.webp 960w"
              sizes="calc(100vw - 40px)"
              type="image/webp"
            />
            <img
              src="/images/v10-hero-harvest-960.webp"
              srcSet="/images/v10-hero-harvest-480.webp 480w, /images/v10-hero-harvest-960.webp 960w, /images/v10-hero-harvest-1440.webp 1440w, /images/v10-hero-harvest.webp 1920w"
              sizes="52vw"
              alt="Người nông dân đang thu hoạch rau trong nhà kính"
              width="1440"
              height="960"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </figure>
      </div>
    </section>
  )
}
