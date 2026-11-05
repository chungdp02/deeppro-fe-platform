import { useTranslation } from "react-i18next"
import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { PHONE_LINK, PRODUCT_LOGIN_URL } from "@/components/landing/navigation"
import { Reveal } from "@/components/landing/Reveal"

export function FinalCTASection() {
  const { t } = useTranslation()

  return (
    <section className="final-cta" id="contact" aria-labelledby="contact-title">
      <div className="final-cta__layout container">
        <Reveal className="final-cta__copy">
          <h2 id="contact-title">
            {t("finalCta.heading", "Sẵn sàng số hóa hành trình sản phẩm của bạn?")}
          </h2>
          <p>
            {t(
              "finalCta.description",
              "Kết nối cùng đội ngũ chuyên gia DeepTrace để xây dựng hệ thống truy xuất nguồn gốc minh bạch, đạt chuẩn quốc tế và nâng tầm giá trị thương hiệu."
            )}
          </p>
          <div className="final-cta__actions">
            <a
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "button button--light",
              })}
              href={PRODUCT_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t("finalCta.primaryBtn", "Đăng nhập nền tảng")}
              <ArrowIcon diagonal />
            </a>
            <a
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "button button--outline-light",
              })}
              href={PHONE_LINK}
            >
              {t("finalCta.secondaryBtn", "Liên hệ tư vấn triển khai")}
              <ArrowIcon />
            </a>
          </div>
        </Reveal>
        <Reveal className="final-cta__visual" delay={90}>
          <figure>
            <img
              src="/images/v10-supply-chain-warehouse-960.webp"
              srcSet="/images/v10-supply-chain-warehouse-480.webp 480w, /images/v10-supply-chain-warehouse-672.webp 672w, /images/v10-supply-chain-warehouse-960.webp 960w, /images/v10-supply-chain-warehouse.webp 1920w"
              sizes="(max-width: 980px) calc(100vw - 40px), 43vw"
              alt="Nhân viên trao đổi trong kho hàng"
              width="960"
              height="640"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
