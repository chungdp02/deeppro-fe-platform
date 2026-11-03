import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

const features = [
  {
    title: "Minh bạch tuyệt đối",
    description:
      "Dữ liệu được lưu trữ trên blockchain không thể thay đổi, đảm bảo tính chính xác và minh bạch hoàn toàn trong toàn bộ chuỗi cung ứng.",
  },
  {
    title: "Xác thực và chống giả",
    description:
      "Sử dụng thuật toán mã hóa và cơ chế xác thực ứng dụng công nghệ Blockchain để đảm bảo tính xác thực của sản phẩm.",
  },
  {
    title: "Bảo mật cao cấp",
    description:
      "Mã hóa mạnh mẽ và cơ chế đồng thuận phân tán bảo vệ dữ liệu khỏi các cuộc tấn công và thao túng bất hợp pháp.",
  },
  {
    title: "Tuân thủ GS1 & TCVN 12850",
    description:
      "Đáp ứng tiêu chuẩn quốc tế GS1 và tiêu chuẩn Việt Nam 12850 về truy xuất nguồn gốc các ngành hàng, hỗ trợ quy trình đạt chuẩn.",
  },
  {
    title: "Xây dựng lòng tin",
    description:
      "Tăng cường niềm tin của người tiêu dùng thông qua khả năng xác minh nguồn gốc và chất lượng sản phẩm một cách độc lập.",
  },
  {
    title: "Quy trình linh hoạt",
    description:
      "Quy trình truy xuất được thiết kế riêng cho từng đối tác, ngành hàng, mặt hàng, đảm bảo tính đa dạng và tương thích cao.",
  },
]

export function FeaturesSection() {
  return (
    <section
      className="section features-section"
      id="features"
      aria-labelledby="features-title"
    >
      <div className="container">
        <Reveal className="section-heading features-section__heading">
          <div>
            <h2 id="features-title">Lợi thế từ Blockchain.</h2>
          </div>
          <p>
            Công nghệ Blockchain mang lại những lợi thế độc đáo cho hệ thống
            truy xuất nguồn gốc DeepTrace, đảm bảo tính minh bạch và bảo mật
            tuyệt đối.
          </p>
        </Reveal>

        <div className="features-section__layout">
          <Reveal className="features-section__visual">
            <figure>
              <img
                src="/images/v10-barcode-delivery-720.webp"
                srcSet="/images/v10-barcode-delivery-360.webp 360w, /images/v10-barcode-delivery-640.webp 640w, /images/v10-barcode-delivery-720.webp 720w, /images/v10-barcode-delivery.webp 1000w"
                sizes="(max-width: 980px) calc(100vw - 40px), 40vw"
                alt="Nhân viên giao nhận dùng điện thoại quét nhãn trên một gói hàng"
                width="720"
                height="1080"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                Hành trình được tổ chức theo từng sản phẩm và từng lô.
              </figcaption>
            </figure>
          </Reveal>
          <div className="features-section__list">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 45}>
                <details className="feature-row" open={index === 0}>
                  <summary>
                    <h3>{feature.title}</h3>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{feature.description}</p>
                </details>
              </Reveal>
            ))}
            <a className="text-link" href="#how-it-works">
              Xem quy trình từng bước
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
