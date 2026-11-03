import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { buttonVariants } from "@workspace/ui/components/button"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

const principles = [
  {
    title: "Thông tin mạch lạc",
    description:
      "Tổ chức dữ liệu sản phẩm theo từng chặng trong chuỗi cung ứng.",
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

export function AboutSection() {
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
              alt="Hai nhân viên trao đổi bên các kệ hàng trong kho"
              width="960"
              height="640"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Mỗi ngành hàng có những điểm cần ghi nhận riêng.
            </figcaption>
          </figure>
        </Reveal>
        <Reveal className="about-section__copy" delay={90}>
          <h2 id="about-title">Mỗi chặng đều có ý nghĩa.</h2>
          <p>
            Từ nguồn gốc đến điểm bán, sản phẩm đi qua nhiều người và nhiều quy
            trình. DeepTrace kết nối thông tin doanh nghiệp khai báo với các
            bước sản xuất, bàn giao và tra cứu của người dùng.
          </p>
          <a
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "button button--primary",
            })}
            href="#how-it-works"
          >
            Khám phá hành trình sản phẩm
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
