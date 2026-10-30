import { PackageIcon, BoxesIcon, QrCodeIcon, UsersIcon } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"

const metrics = [
  {
    title: "Sản phẩm",
    value: "24",
    note: "Đang quản lý trong hệ thống",
    icon: PackageIcon,
  },
  {
    title: "Lô hàng",
    value: "120",
    note: "Đã tạo trong hệ thống",
    icon: BoxesIcon,
  },
  {
    title: "Lượt truy xuất QR",
    value: "2.450",
    note: "Trong tháng 10/2026",
    icon: QrCodeIcon,
  },
  {
    title: "Nhân viên",
    value: "8",
    note: "Thành viên doanh nghiệp",
    icon: UsersIcon,
  },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map(({ title, value, note, icon: Icon }) => (
        <Card key={title} className="gap-0 py-5 shadow-none">
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <span className="rounded-xl bg-accent p-2.5 text-primary">
                <Icon className="size-5" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
