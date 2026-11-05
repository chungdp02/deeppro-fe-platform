import { useTranslation } from "react-i18next"
import { DOCUMENTS_URL } from "@/components/landing/navigation"
import { ArrowIcon } from "@/components/landing/ArrowIcon"
import { Reveal } from "@/components/landing/Reveal"

export function FAQSection() {
  const { t } = useTranslation()

  const questions = [
    {
      question: t("faq.items.0.q", "DeepTrace là nền tảng gì và phù hợp với ai?"),
      answer: t(
        "faq.items.0.a",
        "DeepTrace là nền tảng truy xuất nguồn gốc chuỗi cung ứng ứng dụng Blockchain, phù hợp với các hợp tác xã, doanh nghiệp sản xuất nông nghiệp, chế biến thực phẩm, dược phẩm và các thương hiệu xuất khẩu."
      ),
    },
    {
      question: t("faq.items.1.q", "Dữ liệu được lưu trên DeepTrace có an toàn không?"),
      answer: t(
        "faq.items.1.a",
        "Rất an toàn. Mọi dữ liệu sau khi ghi nhận đều được băm số và bảo vệ bởi cơ chế mật mã học của sổ cái phân tán, ngăn ngừa hoàn toàn nguy cơ sửa đổi hay giả mạo dữ liệu lịch sử."
      ),
    },
    {
      question: t("faq.items.2.q", "Người tiêu dùng có cần cài đặt ứng dụng mới để quét mã không?"),
      answer: t(
        "faq.items.2.a",
        "Không. Người tiêu dùng chỉ cần dùng camera điện thoại hoặc ứng dụng phổ biến như Zalo để quét mã QR và xem toàn bộ trang thông tin sản phẩm."
      ),
    },
    {
      question: t("faq.items.3.q", "DeepTrace có đáp ứng quy định Hộ chiếu số DPP của EU không?"),
      answer: t(
        "faq.items.3.a",
        "Có. Nền tảng được thiết kế sẵn sàng đáp ứng chuẩn Hộ chiếu số Sản phẩm (Digital Product Passport - DPP) và chuẩn định danh toàn cầu GS1 Digital Link."
      ),
    },
    {
      question: t("faq.items.4.q", "Chi phí và thời gian triển khai như thế nào?"),
      answer: t(
        "faq.items.4.a",
        "Thời gian triển khai từ 3-7 ngày tùy quy mô doanh nghiệp. Chúng tôi cung cấp các gói dịch vụ linh hoạt từ quy mô nhỏ đến doanh nghiệp lớn với chi phí tối ưu."
      ),
    },
    {
      question: t("faq.items.5.q", "Làm thế nào để bắt đầu sử dụng DeepTrace?"),
      answer: t(
        "faq.items.5.a",
        "Bạn có thể bấm nút 'Đăng ký tư vấn' hoặc liên hệ hotline để đội ngũ chuyên gia DeepTrace khảo sát quy trình và hỗ trợ tích hợp miễn phí giai đoạn đầu."
      ),
    },
  ]

  return (
    <section
      className="section faq-section"
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="faq-section__layout container">
        <Reveal className="faq-section__intro">
          <h2 id="faq-title">
            {t("faq.heading", "Hỏi đáp về DeepTrace.")}
          </h2>
          <p>
            {t(
              "faq.description",
              "Tìm hiểu thêm về quy trình truy xuất, ứng dụng của mã QR và cách doanh nghiệp bắt đầu với DeepTrace."
            )}
          </p>
          <a
            className="text-link"
            href={DOCUMENTS_URL}
            target="_blank"
            rel="noreferrer"
          >
            {t("footer.documentation", "Xem tài liệu DeepTrace")}
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
