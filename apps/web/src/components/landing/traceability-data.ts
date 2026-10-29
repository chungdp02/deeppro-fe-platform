export type TraceStageIndex = 0 | 1 | 2 | 3
export type ActiveTraceStage = TraceStageIndex | null

export const traceStages = [
  {
    id: "origin",
    title: "Nguồn gốc",
    number: "",
    headline: "Hồ sơ nguồn gốc minh bạch.",
    description: "Thông tin doanh nghiệp, sản phẩm và quy trình được khai báo để thiết lập hồ sơ truy xuất.",
    record: "Dữ liệu đăng ký: Doanh nghiệp, mặt hàng và tiêu chuẩn quy trình.",
    link: "#solutions",
    linkLabel: "Tìm hiểu giải pháp",
    position: [-2.25, 1.35, 0.15] as [number, number, number],
  },
  {
    id: "production",
    title: "Sản xuất",
    number: "",
    headline: "Minh bạch từng công đoạn.",
    description: "Nhà sản xuất chụp ảnh và cập nhật thông tin từng bước qua ứng dụng mobile của hệ thống.",
    record: "Dữ liệu vận hành: Hình ảnh xác thực và nhật ký từng công đoạn.",
    link: "#features",
    linkLabel: "Xem cách ghi nhận",
    position: [-2.15, -1.35, 0.55] as [number, number, number],
  },
  {
    id: "distribution",
    title: "Phân phối",
    number: "",
    headline: "Bàn giao thông suốt.",
    description: "Nhà sản xuất hoàn tất hồ sơ lô. Nhà phân phối quét mã QR để ghi nhận việc nhận hàng.",
    record: "Dữ liệu chuỗi: Xác nhận bàn giao lô hàng và giao dịch lưu kho.",
    link: "#features",
    linkLabel: "Khám phá tính năng",
    position: [2.15, -1.35, 0.35] as [number, number, number],
  },
  {
    id: "traceability",
    title: "Tra cứu",
    number: "",
    headline: "Tra cứu nhanh chóng.",
    description: "Người dùng quét mã QR để xem thông tin sản phẩm được chia sẻ qua Zalo Mini App.",
    record: "Dữ liệu người dùng: Chứng thư số và toàn bộ hành trình đã đối soát.",
    link: "#product",
    linkLabel: "Xem hộ chiếu sản phẩm số",
    position: [2.25, 1.35, -0.1] as [number, number, number],
  },
] as const
