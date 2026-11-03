import { SolutionCarousel } from "@/components/landing/SolutionCarousel"
import { Reveal } from "@/components/landing/Reveal"

export function PlatformValueSection() {
  return (
    <section
      className="section value-section"
      id="solutions"
      aria-labelledby="value-title"
    >
      <div className="container">
        <Reveal className="value-section__intro">
          <h2 id="value-title">Theo dõi nhiều danh mục sản phẩm.</h2>
          <p>
            Nền tảng hỗ trợ các ngành công nghiệp khác nhau bằng giải pháp truy
            xuất nguồn gốc chuyên biệt, quy trình đạt tiêu chuẩn được thiết kế
            riêng cho từng ngành hàng.
          </p>
        </Reveal>
        <SolutionCarousel />
      </div>
    </section>
  )
}
