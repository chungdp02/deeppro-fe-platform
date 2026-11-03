import { DOCUMENTS_URL } from "@/components/landing/navigation"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

const questions = [
  {
    question: "DeepTrace là gì?",
    answer:
      "DeepTrace là nền tảng truy xuất nguồn gốc ứng dụng blockchain, giúp ghi nhận và theo dõi sản phẩm từ nguồn gốc đến người dùng cuối.",
  },
  {
    question: "Quy trình truy xuất có giống nhau cho mọi sản phẩm không?",
    answer:
      "Không. Quy trình và thông tin cần ghi nhận được thiết lập theo sản phẩm và ngành hàng.",
  },
  {
    question: "Ai cập nhật các bước sản xuất?",
    answer:
      "Nhà sản xuất cập nhật hình ảnh và thông tin của từng bước bằng ứng dụng mobile của hệ thống.",
  },
  {
    question: "Nhà phân phối xác nhận nhận hàng thế nào?",
    answer:
      "Nhà phân phối dùng ứng dụng mobile để quét mã QR của lô và ghi nhận thông tin nhận hàng.",
  },
  {
    question: "Người dùng cuối tra cứu bằng cách nào?",
    answer:
      "Mã QR trên sản phẩm đưa người dùng đến Zalo Mini App để xem thông tin sản phẩm và hành trình được chia sẻ.",
  },
  {
    question: "Làm thế nào để bắt đầu?",
    answer:
      "Doanh nghiệp có thể liên hệ DEEP PRO để trao đổi về thông tin sản phẩm và quy trình, hoặc đăng nhập DeepTrace nếu đã có tài khoản.",
  },
]

export function FAQSection() {
  return (
    <section
      className="section faq-section"
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="faq-section__layout container">
        <Reveal className="faq-section__intro">
          <h2 id="faq-title">Hỏi đáp về DeepTrace.</h2>
          <p>
            Tìm hiểu thêm về quy trình truy xuất, ứng dụng của mã QR và cách
            doanh nghiệp bắt đầu với DeepTrace.
          </p>
          <a
            className="text-link"
            href={DOCUMENTS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Xem tài liệu DeepTrace
            <ArrowIcon diagonal />
          </a>
        </Reveal>
        <div className="faq-list">
          {questions.map((item, index) => (
            <Reveal
              className="faq-item-reveal"
              delay={index * 45}
              key={item.question}
            >
              <details className="faq-item">
                <summary>
                  <span>{item.question}</span>
                  <span className="faq-item__icon" aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
