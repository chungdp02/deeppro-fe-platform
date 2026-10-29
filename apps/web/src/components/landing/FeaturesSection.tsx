import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { ParallaxImage } from "@/components/landing/ParallaxImage"
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
    <section className="section features-section" id="features">
      <div className="container feature-layout">
        <Reveal className="feature-story" variant="slide-right">
          <ParallaxImage
            src="/images/consumer-goods.jpeg"
            webpSrc="/images/consumer-goods.webp"
            alt="Các sản phẩm chăm sóc cá nhân được trưng bày tại cửa hàng"
            width="1200"
            height="800"
            speed={0.12}
          />
          <div className="feature-story__caption">
            <strong>
              Hành trình được tổ chức theo từng sản phẩm và từng lô.
            </strong>
          </div>
        </Reveal>

        <Reveal className="feature-copy" delay={100} variant="stagger-cards">
          <h2>Lợi thế từ Blockchain.</h2>
          <p className="feature-copy__intro">
            Công nghệ Blockchain mang lại những lợi thế độc đáo cho hệ thống truy xuất
            nguồn gốc DeepTrace, đảm bảo tính minh bạch và bảo mật tuyệt đối.
          </p>
          <div className="feature-list">
            {features.map((feature) => (
              <article className="feature-list__item" key={feature.title}>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
          <a className="text-link" href="#how-it-works">
            Xem quy trình từng bước
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
