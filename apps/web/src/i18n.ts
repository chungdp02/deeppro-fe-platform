import i18n from "i18next"
import { initReactI18next } from "react-i18next"

export type AppLanguage = "vi" | "en"

const resources = {
  vi: {
    translation: {
      language: "Ngôn ngữ",
      nav: {
        overview: "Tổng quan",
        company: "Công ty",
        products: "Sản phẩm",
        employees: "Nhân viên",
        guide: "Hướng dẫn",
        settings: "Cài đặt",
        help: "Trợ giúp",
      },
      user: { admin: "Quản trị viên" },
      validation: {
        productNameRequired: "Vui lòng nhập tên sản phẩm.",
        productCategoryRequired: "Vui lòng chọn loại sản phẩm.",
        productOriginRequired: "Vui lòng nhập xuất xứ.",
        productGtinInvalid: "GTIN cần gồm 8, 12, 13 hoặc 14 chữ số.",
      },
      page: {
        notFound: "Không tìm thấy trang",
        backToOverview: "Về Tổng quan",
        overview: {
          eyebrow: "KHÔNG GIAN DOANH NGHIỆP",
          title: "Tổng quan hoạt động",
          description:
            "Theo dõi sản phẩm, lô hàng và hoạt động truy xuất của doanh nghiệp.",
          companyDescription:
            "Quản lý thông tin minh bạch, kết nối chuỗi cung ứng.",
          companyProfile: "Hồ sơ doanh nghiệp",
        },
        company: {
          title: "Thông tin doanh nghiệp",
          description: "Quản lý thông tin và hồ sơ pháp lý của doanh nghiệp.",
        },
        products: {
          eyebrow: "QUẢN LÝ DANH MỤC",
          title: "Sản phẩm",
          description:
            "Quản lý thông tin và mã truy xuất sản phẩm của doanh nghiệp.",
          add: "Thêm sản phẩm",
          edit: "Sửa sản phẩm",
          save: "Lưu sản phẩm",
          cancel: "Hủy",
          name: "Tên sản phẩm",
          origin: "Xuất xứ",
          weight: "Quy cách (ví dụ: 500ml)",
          category: "Loại sản phẩm",
          group: "Nhóm sản phẩm",
          main: "Sản phẩm chính",
          sub: "Sản phẩm thầu phụ",
          total: "Tổng sản phẩm",
          gtin: "GTIN",
          actions: "Thao tác",
          number: "STT",
          weightColumn: "Quy cách",
          search: "Tìm tên sản phẩm hoặc GTIN...",
          searchLabel: "Tìm sản phẩm",
          all: "Tất cả sản phẩm",
          food: "Thực phẩm bổ sung",
          agriculture: "Nông sản",
          sort: "Sắp xếp sản phẩm",
          newest: "Mới nhất",
          nameSort: "Tên A → Z",
          clearFilters: "Xóa bộ lọc",
          noResults: "Không tìm thấy sản phẩm",
          noResultsHint: "Thử thay đổi bộ lọc hoặc thêm sản phẩm mới.",
          loading: "Đang tải sản phẩm...",
          retry: "Thử lại",
          editLabel: "Sửa {{name}}",
          deleteLabel: "Xóa {{name}}",
          temporary:
            "Thay đổi được lưu tạm trong phiên sử dụng; tải lại trang sẽ khôi phục dữ liệu mẫu.",
          added: "Đã thêm sản phẩm.",
          updated: "Đã cập nhật sản phẩm.",
          deleted: "Đã xóa sản phẩm.",
          deleteConfirm: "Xóa sản phẩm?",
          deleteQuestion: "Bạn muốn xóa “{{name}}” khỏi danh sách?",
          delete: "Xóa sản phẩm",
          duplicateGtin: "GTIN đã được sử dụng bởi sản phẩm khác.",
          demo: {
            title: "Thử nghiệm fetch + Zod",
            description:
              "Nguồn: products.json → fetch tải dữ liệu → Zod kiểm tra → bảng hiển thị.",
            loading: "Trạng thái: đang tải",
            failed: "Trạng thái: tải hoặc kiểm tra thất bại",
            success: "Trạng thái: đã kiểm tra {{count}} sản phẩm",
            reload: "Tải lại JSON",
            invalid: "Thử dữ liệu sai",
            accepted: "Zod đã chấp nhận dữ liệu.",
            rejected:
              'Zod đã từ chối: group = "sai-nhom", trong khi chỉ chấp nhận "main" hoặc "sub".',
          },
        },
        employees: { title: "Nhân viên" },
        guide: {
          title: "Hướng dẫn sử dụng",
          description:
            "Làm quen với không gian quản lý doanh nghiệp DeepTrace.",
        },
        help: {
          title: "Trợ giúp",
          description:
            "Tìm câu trả lời và hướng dẫn cho các thao tác thường dùng.",
        },
        settings: {
          title: "Cài đặt",
          description:
            "Điều chỉnh cách hiển thị không gian làm việc trên thiết bị của bạn.",
          appearance: "Giao diện",
          appliedLocally: "Lựa chọn được áp dụng cho thiết bị hiện tại.",
          displayMode: "Chế độ hiển thị",
          light: "Sáng",
          dark: "Tối",
          system: "Theo thiết bị",
          save: "Lưu cài đặt",
          saved: "Đã lưu giao diện.",
          workspaceInfo: "Thông tin không gian làm việc",
          company: "Doanh nghiệp",
          timeZone: "Múi giờ",
        },
      },
    },
  },
  en: {
    translation: {
      language: "Language",
      nav: {
        overview: "Overview",
        company: "Company",
        products: "Products",
        employees: "Employees",
        guide: "Guide",
        settings: "Settings",
        help: "Help",
      },
      user: { admin: "Administrator" },
      validation: {
        productNameRequired: "Enter a product name.",
        productCategoryRequired: "Select a product category.",
        productOriginRequired: "Enter the country of origin.",
        productGtinInvalid: "GTIN must contain 8, 12, 13, or 14 digits.",
      },
      page: {
        notFound: "Page not found",
        backToOverview: "Back to Overview",
        overview: {
          eyebrow: "BUSINESS WORKSPACE",
          title: "Activity overview",
          description:
            "Track your company's products, batches, and traceability activity.",
          companyDescription:
            "Manage transparent information and connect the supply chain.",
          companyProfile: "Company profile",
        },
        company: {
          title: "Company information",
          description: "Manage company and legal information.",
        },
        products: {
          eyebrow: "CATALOG MANAGEMENT",
          title: "Products",
          description: "Manage company products and traceability codes.",
          add: "Add product",
          edit: "Edit product",
          save: "Save product",
          cancel: "Cancel",
          name: "Product name",
          origin: "Origin",
          weight: "Size (for example, 500ml)",
          category: "Product category",
          group: "Product group",
          main: "Main products",
          sub: "Subcontracted products",
          total: "Total products",
          gtin: "GTIN",
          actions: "Actions",
          number: "No.",
          weightColumn: "Size",
          search: "Search by product name or GTIN...",
          searchLabel: "Search products",
          all: "All products",
          food: "Food supplements",
          agriculture: "Agricultural products",
          sort: "Sort products",
          newest: "Newest",
          nameSort: "Name A → Z",
          clearFilters: "Clear filters",
          noResults: "No products found",
          noResultsHint: "Change the filters or add a new product.",
          loading: "Loading products...",
          retry: "Retry",
          editLabel: "Edit {{name}}",
          deleteLabel: "Delete {{name}}",
          temporary:
            "Changes are kept for this session; reloading restores sample data.",
          added: "Product added.",
          updated: "Product updated.",
          deleted: "Product deleted.",
          deleteConfirm: "Delete product?",
          deleteQuestion: "Delete “{{name}}” from the list?",
          delete: "Delete product",
          duplicateGtin: "This GTIN is already used by another product.",
          demo: {
            title: "fetch + Zod demo",
            description:
              "Source: products.json → fetch loads data → Zod validates → table displays.",
            loading: "Status: loading",
            failed: "Status: loading or validation failed",
            success: "Status: {{count}} products validated",
            reload: "Reload JSON",
            invalid: "Try invalid data",
            accepted: "Zod accepted the data.",
            rejected:
              'Zod rejected group = "sai-nhom"; only "main" or "sub" are allowed.',
          },
        },
        employees: { title: "Employees" },
        guide: {
          title: "User guide",
          description: "Get familiar with the DeepTrace business workspace.",
        },
        help: {
          title: "Help",
          description: "Find answers and guidance for common tasks.",
        },
        settings: {
          title: "Settings",
          description: "Adjust how the workspace appears on your device.",
          appearance: "Appearance",
          appliedLocally: "Your choice applies to this device.",
          displayMode: "Display mode",
          light: "Light",
          dark: "Dark",
          system: "System",
          save: "Save settings",
          saved: "Appearance saved.",
          workspaceInfo: "Workspace information",
          company: "Company",
          timeZone: "Time zone",
        },
      },
    },
  },
} as const

const savedLanguage = window.localStorage.getItem("deeppro-language")
const initialLanguage: AppLanguage = savedLanguage === "en" ? "en" : "vi"

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "vi",
  interpolation: { escapeValue: false },
})

document.documentElement.lang = initialLanguage

export async function changeAppLanguage(language: AppLanguage) {
  await i18n.changeLanguage(language)
  window.localStorage.setItem("deeppro-language", language)
  document.documentElement.lang = language
}

export default i18n
