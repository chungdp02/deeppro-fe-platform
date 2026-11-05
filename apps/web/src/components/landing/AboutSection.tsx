import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

export function AboutSection() {
  const { t } = useTranslation()

  const principles = [
    {
      title: t("about.principles.0.title", "Toàn vẹn dữ liệu"),
      description: t(
        "about.principles.0.desc",
        "Mỗi dữ liệu sau khi ghi nhận được bảo vệ bởi công nghệ sổ cái phân tán, chống sửa đổi trái phép."
      ),
    },
    {
      title: t("about.principles.1.title", "Chuẩn hóa quốc tế"),
      description: t(
        "about.principles.1.desc",
        "Tuân thủ nghiêm ngặt tiêu chuẩn GS1 và TCVN 12850, sẵn sàng liên kết Hộ chiếu số DPP."
      ),
    },
    {
      title: t("about.principles.2.title", "Tiếp cận dễ dàng"),
      description: t(
        "about.principles.2.desc",
        "Người tiêu dùng tra cứu tức thì qua mã QR trên bao bì hoặc ứng dụng mà không cần cài đặt phức tạp."
      ),
    },
  ]

  return (
    <section
      className="section about-section"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="about-section__layout container">
        <Reveal className="about-section__visual">
          <figure>
            <img
              src="/images/v10-supply-chain-warehouse-960.webp"
              srcSet="/images/v10-supply-chain-warehouse-480.webp 480w, /images/v10-supply-chain-warehouse-672.webp 672w, /images/v10-supply-chain-warehouse-960.webp 960w, /images/v10-supply-chain-warehouse.webp 1920w"
              sizes="(max-width: 980px) calc(100vw - 40px), 43vw"
              alt={t("about.photoCaption", "Hai nhân viên trao đổi bên các kệ hàng trong kho")}
              width="960"
              height="640"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              {t("about.photoCaption", "Mỗi ngành hàng có những điểm cần ghi nhận riêng.")}
            </figcaption>
          </figure>
        </Reveal>
        <Reveal className="about-section__copy" delay={90}>
          <h2 id="about-title">
            {t("about.heading", "Nền tảng truy xuất nguồn gốc minh bạch và tin cậy.")}
          </h2>
          <p>
            {t(
              "about.description",
              "DeepTrace cung cấp giải pháp ghi nhận dữ liệu chuỗi cung ứng theo thời gian thực. Bằng việc kết hợp công nghệ Blockchain và chuẩn định danh toàn cầu GS1, chúng tôi hỗ trợ doanh nghiệp minh bạch hóa nguồn gốc, bảo vệ giá trị thương hiệu và đáp ứng các tiêu chuẩn xuất khẩu khắt khe."
            )}
          </p>
          <a
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "button button--primary",
            })}
            href="#how-it-works"
          >
            {t("about.cta", "Khám phá hành trình sản phẩm")}
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
      <div className="about-section__principles container">
        {principles.map((principle) => (
          <Card as="article" className="about-principle" key={principle.title}>
            <CardHeader>
              <h3>{principle.title}</h3>
            </CardHeader>
            <CardContent>
              <p>{principle.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
