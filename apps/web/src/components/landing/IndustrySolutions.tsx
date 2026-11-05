import { useTranslation } from "react-i18next"
import { Check } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/ui/components/card"
import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

export function IndustrySolutions() {
  const { t } = useTranslation()

  const industries = [
    {
      title: t("industries.items.0.title", "Y tế & Dược phẩm"),
      tagline: t("industries.items.0.tagline", "Chuỗi cung ứng lạnh & chuẩn dược thư"),
      description: t(
        "industries.items.0.desc",
        "Đảm bảo an toàn thuốc và tuân thủ quy định với việc theo dõi chuỗi cung ứng dược phẩm toàn diện."
      ),
      specs: [
        t("industries.items.0.specs.0", "Mã GS1 DataMatrix chuẩn y tế"),
        t("industries.items.0.specs.1", "Giám sát điều kiện chuỗi lạnh"),
        t("industries.items.0.specs.2", "Niêm phong chống giả theo lô"),
      ],
      image: "/images/v10-pharma-warehouse-960.webp",
      srcSet:
        "/images/v10-pharma-warehouse-480.webp 480w, /images/v10-pharma-warehouse-672.webp 672w, /images/v10-pharma-warehouse-960.webp 960w, /images/v10-pharma-warehouse.webp 1920w",
      alt: "Kho hàng với các dãy kệ lưu trữ và xe nâng",
      width: 960,
      height: 640,
    },
    {
      title: t("industries.items.1.title", "Thực phẩm & Nông nghiệp"),
      tagline: t("industries.items.1.tagline", "Minh bạch từ nông trại đến bàn ăn"),
      description: t(
        "industries.items.1.desc",
        "Theo dõi sản phẩm thực phẩm từ trang trại đến người tiêu dùng với sự minh bạch hoàn toàn và đảm bảo an toàn."
      ),
      specs: [
        t("industries.items.1.specs.0", "Nhật ký canh tác số VietGAP"),
        t("industries.items.1.specs.1", "Định danh mã vùng trồng & ao nuôi"),
        t("industries.items.1.specs.2", "Chứng nhận xuất xứ & an toàn thực phẩm"),
      ],
      image: "/images/v10-food-greenhouse-960.webp",
      srcSet:
        "/images/v10-food-greenhouse-480.webp 480w, /images/v10-food-greenhouse-672.webp 672w, /images/v10-food-greenhouse-960.webp 960w, /images/v10-food-greenhouse.webp 1920w",
      alt: "Rau xanh đang được trồng trong nhà kính",
      width: 960,
      height: 720,
    },
    {
      title: t("industries.items.2.title", "Hàng tiêu dùng"),
      tagline: t("industries.items.2.tagline", "Bảo vệ thương hiệu & hệ thống phân phối"),
      description: t(
        "industries.items.2.desc",
        "Giám sát tính xác thực của sản phẩm và tính toàn vẹn của chuỗi cung ứng để bảo vệ người tiêu dùng."
      ),
      specs: [
        t("industries.items.2.specs.0", "Mã định danh duy nhất (UID) từng sản phẩm"),
        t("industries.items.2.specs.1", "Kích hoạt bảo hành & tem chống giả số"),
        t("industries.items.2.specs.2", "Kiểm soát tràn hàng & kênh đại lý"),
      ],
      image: "/images/v10-consumer-goods-720.webp",
      srcSet:
        "/images/v10-consumer-goods-360.webp 360w, /images/v10-consumer-goods-640.webp 640w, /images/v10-consumer-goods-720.webp 720w, /images/v10-consumer-goods.webp 933w",
      alt: "Các mặt hàng tiêu dùng được bày trên kệ cửa hàng",
      width: 720,
      height: 1080,
    },
  ]

  return (
    <section className="section industries-section" id="industries" aria-labelledby="industries-title">
      <div className="container">
        <Reveal className="section-heading industries-section__heading">
          <div>
            <h2 id="industries-title">
              {t("industries.heading", "Đa dạng ngành hàng ứng dụng.")}
            </h2>
          </div>
          <p>
            {t(
              "industries.description",
              "DeepTrace được thiết kế đáp ứng các yêu cầu kiểm soát đặc thù của từng lĩnh vực, từ dược phẩm nghiêm ngặt, nông sản tươi sống đến hàng tiêu dùng đại trà."
            )}
          </p>
        </Reveal>

        <div className="industries-section__grid">
          {industries.map((industry, index) => (
            <Reveal key={industry.title} delay={index * 70}>
              <Card as="article" className="industry-card">
                <figure className="industry-card__image">
                  <img
                    src={industry.image}
                    srcSet={industry.srcSet}
                    sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 980px) 46vw, 30vw"
                    alt={industry.alt}
                    width={industry.width}
                    height={industry.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <CardHeader className="industry-card__header">
                  <h3>{industry.title}</h3>
                </CardHeader>
                <CardContent className="industry-card__content">
                  <p className="industry-card__tagline">{industry.tagline}</p>
                  <p>{industry.description}</p>
                  <ul className="industry-card__specs">
                    {industry.specs.map((spec) => (
                      <li key={spec}>
                        <Check size={14} className="spec-icon" aria-hidden="true" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "industry-card__link",
                    })}
                    href="#product"
                  >
                    {t("industries.viewDetails", "Xem chi tiết giải pháp")}
                    <ArrowIcon />
                  </a>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
