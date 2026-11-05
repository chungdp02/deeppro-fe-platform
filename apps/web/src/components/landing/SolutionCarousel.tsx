import { useTranslation } from "react-i18next"
import { Card } from "@workspace/ui/components/card"
import { ArrowIcon } from "@/components/landing/ArrowIcon"

export function SolutionCarousel() {
  const { t } = useTranslation()

  const slides = [
    {
      image: "/images/official-consumer.webp",
      title: t("solutions.slides.0.title", "Bảo vệ thương hiệu & Chống giả"),
      text: t(
        "solutions.slides.0.desc",
        "Mã định danh duy nhất (UID) cho từng sản phẩm giúp ngăn chặn hàng giả, chống tràn hàng và kiểm soát hệ thống phân phối."
      ),
      linkHref: "#features",
      linkLabel: t("solutions.slides.0.linkText", "Khám phá tính năng"),
    },
    {
      image: "/images/v10-supply-chain-warehouse-960.webp",
      title: t("solutions.slides.1.title", "Số hóa nhật ký & Vận hành chuỗi"),
      text: t(
        "solutions.slides.1.desc",
        "Ghi nhận tức thời dữ liệu canh tác, sản xuất và lưu kho bằng ứng dụng di động, giảm thiểu sai sót và tối ưu thời gian bàn giao."
      ),
      linkHref: "#how-it-works",
      linkLabel: t("solutions.slides.1.linkText", "Xem quy trình vận hành"),
    },
    {
      image: "/images/official-food.webp",
      title: t("solutions.slides.2.title", "Minh bạch hóa & Tạo dựng niềm tin"),
      text: t(
        "solutions.slides.2.desc",
        "Dữ liệu chuỗi cung ứng được bảo chứng bằng công nghệ Blockchain, cung cấp thông tin xác thực và củng cố sự an tâm của khách hàng."
      ),
      linkHref: "#product",
      linkLabel: t("solutions.slides.2.linkText", "Khám phá hộ chiếu số"),
    },
    {
      image: "/images/v10-barcode-delivery-720.webp",
      title: t("solutions.slides.3.title", "Kết nối khách hàng qua Zalo Mini App"),
      text: t(
        "solutions.slides.3.desc",
        "Tra cứu nguồn gốc tức thì không cần cài ứng dụng mới, tiếp cận hàng chục triệu người dùng Việt Nam thuận tiện và nhanh chóng."
      ),
      linkHref: "#product",
      linkLabel: t("solutions.slides.3.linkText", "Trải nghiệm tra cứu"),
    },
    {
      image: "/images/official-medical.webp",
      title: t("solutions.slides.4.title", "Chuẩn hóa dữ liệu GS1 & Xuất khẩu"),
      text: t(
        "solutions.slides.4.desc",
        "Cấu trúc dữ liệu tương thích tiêu chuẩn quốc tế GS1, TCVN 12850 và sẵn sàng cho Hộ chiếu số DPP theo xu hướng toàn cầu."
      ),
      linkHref: "#features",
      linkLabel: t("solutions.slides.4.linkText", "Xem chuẩn kỹ thuật"),
    },
  ]

  return (
    <div
      className="solution-carousel"
      role="region"
      aria-label={t("nav.solutions", "Ứng dụng DeepTrace")}
    >
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
                    <a href={slide.linkHref}>
                      {slide.linkLabel} <ArrowIcon diagonal size={14} />
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
