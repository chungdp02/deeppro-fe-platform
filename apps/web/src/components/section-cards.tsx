import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { TrendingUpIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Thẻ 1: Sản phẩm */}
      <Card>
        <CardHeader>
          <CardDescription>Tổng sản phẩm</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            24
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon className="size-3" />
              +4
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="font-medium">Thêm 4 sản phẩm trong tháng</p>
          <p className="text-muted-foreground">
            Tổng sản phẩm đang quản lý
          </p>
        </CardFooter>
      </Card>

      {/* Thẻ 2: Lô hàng */}
      <Card>
        <CardHeader>
          <CardDescription>Tổng lô hàng</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            120
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon className="size-3" />
              +12
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="font-medium">Thêm 12 lô hàng trong tháng</p>
          <p className="text-muted-foreground">Tổng lô hàng đã tạo</p>
        </CardFooter>
      </Card>

      {/* Thẻ 3: Truy xuất QR */}
      <Card>
        <CardHeader>
          <CardDescription>Lượt truy xuất QR</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            2.450
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon className="size-3" />
              +25%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="font-medium">Tăng 25% so với tháng trước</p>
          <p className="text-muted-foreground">
            Lượt truy xuất trong tháng
          </p>
        </CardFooter>
      </Card>

      {/* Thẻ 4: Nhân viên */}
      <Card>
        <CardHeader>
          <CardDescription>Tổng nhân viên</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            8
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon className="size-3" />
              +2
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="font-medium">Thêm 2 nhân viên trong tháng</p>
          <p className="text-muted-foreground">
            Tổng nhân viên trong hệ thống
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}   