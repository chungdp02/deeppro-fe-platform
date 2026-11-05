import { DEMO_PRODUCTS } from "./demo-data"
import type { LookupResult } from "../types"

/**
 * Tra cứu thông tin sản phẩm và dữ liệu hành trình truy xuất.
 * Hiện tại hoạt động ở DEMO MODE với các dữ liệu mẫu đã được cấu trúc.
 * Khi có live API endpoint trong tương lai, adapter này có thể chuyển hướng gọi HTTP client.
 */
export async function lookupProduct(rawCode: string): Promise<LookupResult> {
  const code = rawCode.trim().toUpperCase()

  // Mô phỏng độ trễ mạng thực tế để kích hoạt loading state
  await new Promise((resolve) => setTimeout(resolve, 200))

  if (!code) {
    return {
      success: false,
      errorCode: "EMPTY_CODE",
      errorMessage: "Vui lòng nhập mã định danh hoặc quét mã QR sản phẩm.",
    }
  }

  // Kiểm tra định dạng cơ bản: chấp nhận chữ cái, số, dấu gạch nối, gạch dưới
  const isValidFormat = /^[A-Z0-9\-_]{3,32}$/.test(code)
  if (!isValidFormat) {
    return {
      success: false,
      errorCode: "INVALID_FORMAT",
      errorMessage:
        "Định dạng mã không hợp lệ. Mã chỉ nên bao gồm chữ, số và dấu gạch nối (Ví dụ: VN-AGRI-0824).",
    }
  }

  const product = DEMO_PRODUCTS[code]

  if (!product) {
    return {
      success: false,
      errorCode: "NOT_FOUND",
      errorMessage: `Không tìm thấy thông tin cho mã "${code}". Vui lòng thử một trong các mã mẫu được cung cấp bên dưới.`,
    }
  }

  return {
    success: true,
    data: product,
  }
}
