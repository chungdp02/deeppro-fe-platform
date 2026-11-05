import { useTranslation } from "react-i18next"
import { SolutionCarousel } from "@/components/landing/SolutionCarousel"
import { Reveal } from "@/components/landing/Reveal"

export function PlatformValueSection() {
  const { t } = useTranslation()

  return (
    <section
      className="section value-section"
      id="solutions"
      aria-labelledby="value-title"
    >
      <div className="container">
        <Reveal className="value-section__intro">
          <h2 id="value-title">
            {t("solutions.heading", "Giá trị giải pháp cho doanh nghiệp.")}
          </h2>
          <p>
            {t(
              "solutions.description",
              "DeepTrace mang đến nền tảng số hóa chuỗi cung ứng toàn diện, bảo vệ uy tín thương hiệu, tối ưu hóa quy trình vận hành và kiến tạo niềm tin bền vững với người tiêu dùng."
            )}
          </p>
        </Reveal>
        <SolutionCarousel />
      </div>
    </section>
  )
}
