import { useState, type FormEvent } from "react"
import {
  BookOpenIcon,
  QrCodeIcon,
  PackageIcon,
  UsersIcon,
  ArrowUpRightIcon,
  SearchIcon,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"

const faqs = [
  {
    question: "Làm thế nào để thêm sản phẩm?",
    answer:
      "Vào Sản phẩm, chọn Thêm sản phẩm, nhập tên, xuất xứ và các thông tin bổ sung rồi chọn Lưu sản phẩm. GTIN nếu nhập cần có 8, 12, 13 hoặc 14 chữ số và không trùng sản phẩm khác.",
  },
  {
    question: "Có thể lọc danh sách như thế nào?",
    answer:
      "Ở Sản phẩm, nhập tên hoặc GTIN và chọn loại sản phẩm. Ở Nhân viên, tìm theo tên hoặc email, kết hợp bộ lọc vai trò và trạng thái. Chọn Xóa bộ lọc để xem lại danh sách.",
  },
  {
    question: "Dữ liệu mới có được lưu sau khi tải lại trang?",
    answer:
      "Sản phẩm và nhân viên hiện dùng dữ liệu mẫu. Thay đổi được giữ khi chuyển mục trong phiên, nhưng sẽ khôi phục khi tải lại trang. Chưa kết nối máy chủ.",
  },
  {
    question: "Thêm nhân viên có gửi email mời không?",
    answer:
      "Chưa. Thao tác hiện chỉ cập nhật danh sách mẫu, không tạo tài khoản, gửi thư hay thay đổi quyền truy cập thật.",
  },
  {
    question: "Xuất báo cáo lô hàng ở đâu?",
    answer:
      "Vào Tổng quan, tìm bảng Lô hàng gần đây và chọn Xuất CSV. File xuất chứa những dòng phù hợp với bộ lọc hiện tại.",
  },
  {
    question: "Làm sao thu gọn thanh bên?",
    answer:
      "Bấm nút thu gọn trên thanh điều hướng phía trên. Sidebar sẽ giữ các icon chức năng; rê chuột lên icon để xem tên mục.",
  },
]
function Heading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
const pageClass =
  "mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8"

export function GuidePage() {
  return (
    <main className={pageClass}>
      <Heading
        title="Hướng dẫn sử dụng"
        description="Làm quen với không gian quản lý doanh nghiệp DeepTrace."
      />
      <Tabs defaultValue="overview" className="gap-6">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="start">Bắt đầu</TabsTrigger>
          <TabsTrigger value="features">Tính năng</TabsTrigger>
          <TabsTrigger value="faq">Câu hỏi thường gặp</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quản lý doanh nghiệp cùng DeepTrace</CardTitle>
                <CardDescription>
                  Một không gian thống nhất cho sản phẩm, lô hàng và thành viên.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm leading-7">
                <p>
                  Dashboard giúp doanh nghiệp theo dõi danh mục sản phẩm, thông
                  tin doanh nghiệp và hoạt động truy xuất. Các trang được tổ
                  chức theo menu bên trái để chuyển nhanh giữa các nghiệp vụ.
                </p>
                <div className="rounded-xl bg-accent p-4 text-accent-foreground">
                  <p className="font-semibold">Bắt đầu từ danh mục sản phẩm</p>
                  <p className="mt-1">
                    Kiểm tra thông tin doanh nghiệp, bổ sung sản phẩm rồi quản
                    lý thành viên tham gia hệ thống.
                  </p>
                </div>
                <Button render={<a href="#san-pham" />}>
                  Quản lý sản phẩm
                  <ArrowUpRightIcon className="size-4" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Truy cập nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Hồ sơ công ty",
                    href: "#cong-ty",
                    icon: BookOpenIcon,
                  },
                  {
                    title: "Danh mục sản phẩm",
                    href: "#san-pham",
                    icon: PackageIcon,
                  },
                  {
                    title: "Thành viên doanh nghiệp",
                    href: "#nhan-vien",
                    icon: UsersIcon,
                  },
                ].map(({ title, href, icon: Icon }) => (
                  <Button
                    key={href}
                    variant="outline"
                    className="w-full justify-start"
                    render={<a href={href} />}
                  >
                    <Icon className="size-4" />
                    {title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="start">
          <Card>
            <CardHeader>
              <CardTitle>Các bước làm quen</CardTitle>
              <CardDescription>
                Thực hiện theo thứ tự để khám phá giao diện.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                [
                  "Kiểm tra doanh nghiệp",
                  "Mở mục Công ty để xem thông tin liên hệ, pháp lý và thống kê.",
                  "#cong-ty",
                ],
                [
                  "Bổ sung sản phẩm",
                  "Chọn Thêm sản phẩm, điền thông tin và lưu. Có thể chỉnh sửa hoặc xóa sau đó.",
                  "#san-pham",
                ],
                [
                  "Quản lý nhân viên",
                  "Thêm thông tin thành viên, chọn vai trò và trạng thái phù hợp.",
                  "#nhan-vien",
                ],
                [
                  "Theo dõi hoạt động",
                  "Xem biểu đồ QR, lọc lô hàng và xuất CSV tại trang Tổng quan.",
                  "#tong-quan",
                ],
              ].map(([title, text, href], index) => (
                <a
                  key={href}
                  href={href}
                  className="flex gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Danh mục sản phẩm",
                text: "Hai nhóm sản phẩm chính và thầu phụ. Hỗ trợ tìm kiếm, lọc, sắp xếp, thêm, sửa và xóa.",
                icon: PackageIcon,
              },
              {
                title: "Nhân viên",
                text: "Quản lý thông tin thành viên, kiểm tra email trùng, lọc vai trò và trạng thái.",
                icon: UsersIcon,
              },
              {
                title: "Truy xuất QR",
                text: "Biểu đồ lượt truy xuất mẫu theo khoảng thời gian và bảng lô hàng có xuất CSV.",
                icon: QrCodeIcon,
              },
              {
                title: "Hồ sơ doanh nghiệp",
                text: "Tổng hợp thông tin doanh nghiệp, liên hệ và hồ sơ pháp lý để tra cứu.",
                icon: BookOpenIcon,
              },
            ].map(({ title, text, icon: Icon }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="mb-2 size-6 text-primary" />
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  {text}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="faq">
          <FaqList items={faqs} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
function FaqList({ items }: { items: typeof faqs }) {
  return (
    <Card>
      <CardContent className="divide-y">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="cursor-pointer rounded-sm py-1 font-medium focus-visible:outline-2 focus-visible:outline-primary">
              {item.question}
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
        {!items.length && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Không tìm thấy câu trả lời. Hãy thử từ khóa khác.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function HelpPage() {
  const [search, setSearch] = useState("")
  const rows = faqs.filter((item) =>
    (item.question + item.answer)
      .toLocaleLowerCase("vi")
      .includes(search.trim().toLocaleLowerCase("vi"))
  )
  return (
    <main className={pageClass}>
      <Heading
        title="Trợ giúp"
        description="Tìm câu trả lời và hướng dẫn cho các thao tác thường dùng."
      />
      <div className="relative max-w-xl">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="bg-background pl-9"
          aria-label="Tìm câu trả lời"
          placeholder="Tìm câu hỏi về sản phẩm, nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <FaqList items={rows} />
      <Card>
        <CardHeader>
          <CardTitle>Cần trao đổi thêm?</CardTitle>
          <CardDescription>
            Liên hệ người quản trị dự án qua kênh nội bộ của nhóm. Khi báo lỗi,
            cung cấp tên mục, thao tác đã thực hiện và thông báo trên màn hình.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" render={<a href="#huong-dan" />}>
            Xem hướng dẫn sử dụng
            <ArrowUpRightIcon className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [saved, setSaved] = useState(false)
  const [choice, setChoice] = useState(theme)
  function save(event: FormEvent) {
    event.preventDefault()
    setTheme(choice)
    setSaved(true)
  }
  return (
    <main className={pageClass}>
      <Heading
        title="Cài đặt"
        description="Điều chỉnh cách hiển thị không gian làm việc trên thiết bị của bạn."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Giao diện</CardTitle>
          <CardDescription>
            Lựa chọn được áp dụng cho thiết bị hiện tại.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-5">
            <div className="space-y-2">
              <Label>Chế độ hiển thị</Label>
              <Select
                value={choice}
                items={[
                  { value: "light", label: "Sáng" },
                  { value: "dark", label: "Tối" },
                  { value: "system", label: "Theo thiết bị" },
                ]}
                onValueChange={(value) => {
                  if (
                    value === "light" ||
                    value === "dark" ||
                    value === "system"
                  ) {
                    setChoice(value)
                    setSaved(false)
                  }
                }}
              >
                <SelectTrigger aria-label="Chế độ hiển thị" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Sáng</SelectItem>
                  <SelectItem value="dark">Tối</SelectItem>
                  <SelectItem value="system">Theo thiết bị</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit">Lưu cài đặt</Button>
              {saved && (
                <p role="status" className="text-sm text-primary">
                  Đã lưu giao diện.
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Thông tin không gian làm việc</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y text-sm">
            {[
              ["Doanh nghiệp", "Công ty Cổ phần Thực phẩm ABZ"],
              ["Ngôn ngữ", "Tiếng Việt"],
              ["Múi giờ", "Asia/Bangkok (UTC+7)"],
            ].map(([title, value]) => (
              <div
                key={title}
                className="flex flex-wrap justify-between gap-3 py-3"
              >
                <dt className="text-muted-foreground">{title}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </main>
  )
}
