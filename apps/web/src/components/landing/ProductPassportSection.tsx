import { DOCUMENTS_URL } from "@/components/landing/navigation"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

const timeline = [
  {
    step: "01",
    title: "Khai báo nguồn gốc & Giống",
    detail: "Được khai báo theo quy trình chuẩn",
    time: "15/10/2026",
  },
  {
    step: "02",
    title: "Các bước canh tác & Sản xuất",
    detail: "Được cập nhật bằng hình ảnh thực tế",
    time: "22/10/2026",
  },
  {
    step: "03",
    title: "Bàn giao & Phân phối theo lô",
    detail: "Được xác nhận trong ứng dụng",
    time: "24/10/2026",
  },
]

export function ProductPassportSection() {
  return (
    <section
      className="section passport-section"
      id="product"
      aria-labelledby="passport-title"
    >
      <div className="passport-section__layout container">
        <Reveal className="passport-section__copy">
          <h2 id="passport-title">Từng thông tin đúng lúc.</h2>
          <p>
            Doanh nghiệp thiết lập quy trình theo từng sản phẩm. Các bước được
            ghi nhận xuyên suốt để người dùng có thể xem thông tin đã chia sẻ
            qua mã QR.
          </p>
          <a
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "button button--outline",
            })}
            href={DOCUMENTS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Tìm hiểu cách bắt đầu
            <ArrowIcon diagonal />
          </a>
        </Reveal>

        <Reveal className="passport-section__demo" delay={100}>
          <Card
            as="article"
            className="passport-demo"
            data-ui="product-passport"
          >
            <div className="passport-demo__chrome">
              <span aria-hidden="true">● ● ●</span>
              <span>DeepTrace / Hộ chiếu sản phẩm</span>
              <span>Minh họa</span>
            </div>
            <CardHeader className="passport-demo__header">
              <div>
                <p className="passport-demo__brand">DeepTrace Passport</p>
                <h3>Hộ chiếu sản phẩm số</h3>
              </div>
              <Badge variant="secondary" className="passport-demo__badge">
                Chuẩn VietGAP
              </Badge>
            </CardHeader>
            <CardContent className="passport-demo__content">
              <figure className="passport-demo__photo">
                <img
                  src="/images/v10-food-greenhouse-192.webp"
                  srcSet="/images/v10-food-greenhouse-192.webp 192w, /images/v10-food-greenhouse-480.webp 480w, /images/v10-food-greenhouse-960.webp 960w"
                  sizes="104px"
                  alt="Rau củ hữu cơ chuẩn xuất khẩu đạt chuẩn VietGAP"
                  width="192"
                  height="144"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <strong>Rau củ hữu cơ chuẩn xuất khẩu</strong>
                  <span>Lô #VN-AGRI-0824 · GTIN: 8936012345678</span>
                </figcaption>
              </figure>
              <p className="passport-demo__note">
                Quy trình được thiết lập theo khai báo của doanh nghiệp.
              </p>
              <div className="passport-demo__timeline-heading">
                <h4>Các mốc truy xuất</h4>
                <Badge variant="outline" className="passport-demo__live">
                  Mẫu dữ liệu
                </Badge>
              </div>
              <dl className="passport-demo__fields">
                {timeline.map((item) => (
                  <div className="passport-demo__field" key={item.step}>
                    <dt>
                      {item.step} · {item.title}
                    </dt>
                    <dd>
                      {item.detail} ({item.time})
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="passport-demo__footer">
                <p>
                  Dữ liệu chuẩn hóa theo tiêu chuẩn GS1 và kết nối Hộ chiếu số
                  DPP.
                </p>
                <span className="passport-demo__block-tag">
                  Dữ liệu minh họa
                </span>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
