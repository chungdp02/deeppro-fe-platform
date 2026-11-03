import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
const slides = [
  {
    image: "/images/official-medical.webp",
    title: "Y tế & Dược phẩm",
    text: "Đảm bảo an toàn thuốc và tuân thủ với việc theo dõi chuỗi cung ứng dược phẩm toàn diện.",
  },
  {
    image: "/images/v10-food-greenhouse-960.webp",
    title: "Thực phẩm & Nông nghiệp",
    text: "Theo dõi sản phẩm thực phẩm từ trang trại đến người tiêu dùng với sự minh bạch hoàn toàn và đảm bảo an toàn.",
  },
  {
    image: "/images/official-food.webp",
    title: "Minh bạch tuyệt đối",
    text: "Dữ liệu được lưu trữ trên blockchain không thể thay đổi, đảm bảo tính chính xác và minh bạch trong toàn bộ chuỗi cung ứng.",
  },
  {
    image: "/images/v10-supply-chain-warehouse-960.webp",
    title: "Quy trình linh hoạt",
    text: "Quy trình truy xuất được thiết kế riêng cho từng đối tác, ngành hàng, mặt hàng.",
  },
  {
    image: "/images/official-consumer.webp",
    title: "Hàng tiêu dùng",
    text: "Giám sát tính xác thực của sản phẩm và tính toàn vẹn của chuỗi cung ứng để bảo vệ người tiêu dùng.",
  },
]
export function SolutionCarousel() {
  const [paused, setPaused] = useState(false)
  return (
    <div
      className="solution-carousel"
      role="region"
      aria-label="Ứng dụng DeepTrace"
      data-paused={paused}
    >
      <div className="solution-carousel__controls">
        <p>Truy xuất nguồn gốc cho nhiều danh mục sản phẩm.</p>
        <Button
          variant="ghost"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
        >
          {paused ? "Phát chuyển động" : "Tạm dừng chuyển động"}
        </Button>
      </div>
      <div className="solution-carousel__viewport">
        <div className="solution-carousel__track">
          {[0, 1].map((copy) => (
            <div
              className="solution-carousel__group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              inert={copy === 1 ? true : undefined}
            >
              {slides.map((slide) => (
                <Card as="article" className="solution-slide" key={slide.title}>
                  <img
                    src={slide.image}
                    alt={copy === 0 ? slide.title : ""}
                    width="720"
                    height="900"
                    loading="lazy"
                  />
                  <div>
                    <h3>{slide.title}</h3>
                    <p>{slide.text}</p>
                    <a href="#industries">
                      Khám phá ngành hàng <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
