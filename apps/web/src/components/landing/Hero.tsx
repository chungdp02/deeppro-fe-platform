import { useTranslation } from "react-i18next"
import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { PRODUCT_LOGIN_URL } from "@/components/landing/navigation"

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__layout container">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            {t("hero.eyebrow", "DeepTrace · Truy xuất nguồn gốc Blockchain")}
          </p>
          <h1 id="hero-title">
            <span>{t("hero.titlePart1", "Truy xuất nguồn gốc.")}</span>
            <span>{t("hero.titlePart2", "Ứng dụng Blockchain.")}</span>
          </h1>
          <p className="hero__description">
            {t(
              "hero.description",
              "DeepTrace giúp doanh nghiệp ghi nhận và chia sẻ hành trình truy xuất nguồn gốc sản phẩm từ sản xuất đến người tiêu dùng. Dữ liệu chuẩn hóa theo GS1 và TCVN 12850, sẵn sàng kết nối Hộ chiếu số DPP."
            )}
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
              {t("hero.primaryCta", "Đăng nhập nền tảng")}
              <ArrowIcon diagonal />
            </a>
            <a className="text-link" href="#solutions">
              {t("hero.exploreSolutions", "Khám phá giải pháp")}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero__scope">
            {t(
              "hero.scope",
              "Nông sản sạch · Dược phẩm · Hàng tiêu dùng · Chuỗi cung ứng"
            )}
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
              alt={t("hero.imageAlt", "Người nông dân đang thu hoạch rau trong nhà kính")}
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
