import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/ui/components/card"
import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

const industries = [
  {
    title: "Y tế & Dược phẩm",
    tagline: "Chuỗi cung ứng lạnh & chuẩn dược thư",
    description:
      "Đảm bảo an toàn thuốc và tuân thủ quy định với việc theo dõi chuỗi cung ứng dược phẩm toàn diện.",
    specs: [
      "Mã GS1 DataMatrix chuẩn y tế",
      "Giám sát nhiệt độ chuỗi lạnh",
      "Niêm phong chống giả theo lô",
    ],
    image: "/images/v10-pharma-warehouse-960.webp",
    srcSet:
      "/images/v10-pharma-warehouse-480.webp 480w, /images/v10-pharma-warehouse-672.webp 672w, /images/v10-pharma-warehouse-960.webp 960w, /images/v10-pharma-warehouse.webp 1920w",
    alt: "Kho hàng với các dãy kệ lưu trữ và xe nâng",
    width: 960,
    height: 640,
  },
  {
    title: "Thực phẩm & Nông nghiệp",
    tagline: "Minh bạch từ nông trại đến bàn ăn",
    description:
      "Theo dõi sản phẩm thực phẩm từ trang trại đến người tiêu dùng với sự minh bạch hoàn toàn và đảm bảo an toàn.",
    specs: [
      "Nhật ký canh tác số VietGAP",
      "Định danh mã vùng trồng & ao nuôi",
      "Chứng nhận xuất xứ & an toàn thực phẩm",
    ],
    image: "/images/v10-food-greenhouse-960.webp",
    srcSet:
      "/images/v10-food-greenhouse-480.webp 480w, /images/v10-food-greenhouse-672.webp 672w, /images/v10-food-greenhouse-960.webp 960w, /images/v10-food-greenhouse.webp 1920w",
    alt: "Rau xanh đang được trồng trong nhà kính",
    width: 960,
    height: 720,
  },
  {
    title: "Hàng tiêu dùng",
    tagline: "Bảo vệ thương hiệu & hệ thống phân phối",
    description:
      "Giám sát tính xác thực của sản phẩm và tính toàn vẹn của chuỗi cung ứng để bảo vệ người tiêu dùng.",
    specs: [
      "Mã định danh duy nhất (UID) từng sản phẩm",
      "Kích hoạt bảo hành & tem chống giả số",
      "Kiểm soát tràn hàng & kênh đại lý",
    ],
    image: "/images/v10-consumer-goods-720.webp",
    srcSet:
      "/images/v10-consumer-goods-360.webp 360w, /images/v10-consumer-goods-640.webp 640w, /images/v10-consumer-goods-720.webp 720w, /images/v10-consumer-goods.webp 933w",
    alt: "Các mặt hàng tiêu dùng được bày trên kệ cửa hàng",
    width: 720,
    height: 1080,
  },
]

export function IndustrySolutions() {
  return (
    <section className="section industries-section" id="industries" aria-labelledby="industries-title">
      <div className="container">
        <Reveal className="section-heading industries-section__heading">
          <div>
            <h2 id="industries-title">Đa dạng ngành hàng.</h2>
          </div>
          <p>
            Nền tảng toàn diện của chúng tôi hỗ trợ các ngành công nghiệp khác
            nhau bằng giải pháp truy xuất nguồn gốc chuyên biệt, quy trình đạt
            tiêu chuẩn được thiết kế riêng cho từng ngành hàng.
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
                        <svg
                          className="industry-card__spec-icon"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M3.5 8.5L6.5 11.5L12.5 4.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    className={buttonVariants({
                      variant: "link",
                      size: "default",
                      className: "industry-card__link",
                    })}
                    href="#contact"
                  >
                    Trao đổi về quy trình
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
