import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { PHONE_LINK, PRODUCT_LOGIN_URL } from "@/components/landing/navigation"
import { Reveal } from "@/components/landing/Reveal"

export function FinalCTASection() {
  return (
    <section className="final-cta" id="contact" aria-labelledby="contact-title">
      <div className="final-cta__layout container">
        <Reveal className="final-cta__copy">
          <h2 id="contact-title">Bắt đầu truy xuất nguồn gốc.</h2>
          <p>
            Tham gia nền tảng DeepTrace để đảm bảo sản phẩm an toàn, minh bạch
            từ nguồn gốc trang trại đến tận tay người tiêu dùng.
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
              Đăng nhập DeepTrace
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
              Nhận tư vấn
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
