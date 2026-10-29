import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { ParallaxImage } from "@/components/landing/ParallaxImage"
import { Reveal } from "@/components/landing/Reveal"

const principles = [
  {
    title: "Thông tin mạch lạc",
    description: "Tổ chức dữ liệu sản phẩm theo từng chặng trong chuỗi cung ứng.",
  },
  {
    title: "Hành trình dễ theo dõi",
    description: "Giúp doanh nghiệp ghi nhận các mốc liên quan đến sản phẩm.",
  },
  {
    title: "Tra cứu thuận tiện",
    description: "Kết nối mã QR với thông tin hành trình dành cho người dùng.",
  },
]

export function SolutionsSection() {
  return (
    <section className="section solutions-section" id="solutions">
      <div className="container solutions-section__layout">
        <Reveal className="solutions-section__visual" variant="wave-float">
          <figure>
            <ParallaxImage
              src="/images/medical-product.png"
              webpSrc="/images/medical-product.webp"
              alt="Các sản phẩm dược phẩm và vật tư y tế"
              width="434"
              height="272"
              speed={0.14}
            />
            <figcaption>
              <strong>Mỗi ngành hàng có những điểm cần ghi nhận riêng.</strong>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="solutions-section__intro" delay={100} variant="slide-right">
          <h2>Mỗi chặng đều có ý nghĩa.</h2>
          <p>
            Từ nguồn gốc đến điểm bán, sản phẩm đi qua nhiều người và nhiều
            quy trình. DeepTrace kết nối thông tin doanh nghiệp khai báo với
            các bước sản xuất, bàn giao và tra cứu của người dùng.
          </p>
          <div className="principle-list">
            {principles.map((item) => (
              <article className="principle-list__item" key={item.title}>
                <div className="principle-list__copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
          <a className="text-link" href="#product">
            Khám phá hành trình sản phẩm
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
