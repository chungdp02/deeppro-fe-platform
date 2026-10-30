import { useState } from "react"
import { DownloadIcon, SearchIcon, PackageIcon } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@workspace/ui/components/table"

const batches = [
  {
    id: "LH-001",
    product: "Rượu Sâm Đinh Lăng 500ml",
    category: "Thực phẩm bổ sung",
    date: "2026-10-28",
    quantity: 240,
    status: "Đã xác thực",
  },
  {
    id: "LH-002",
    product: "Rượu Sâm Đinh Lăng 300ml",
    category: "Thực phẩm bổ sung",
    date: "2026-10-27",
    quantity: 180,
    status: "Chờ xác thực",
  },
  {
    id: "LH-003",
    product: "Bộ sản phẩm OCOP",
    category: "Nông sản",
    date: "2026-10-25",
    quantity: 96,
    status: "Đã xác thực",
  },
  {
    id: "LH-004",
    product: "Rượu Sâm Đinh Lăng Cao Cấp",
    category: "Thực phẩm bổ sung",
    date: "2026-10-22",
    quantity: 120,
    status: "Bản nháp",
  },
  {
    id: "LH-005",
    product: "Bộ sản phẩm OCOP",
    category: "Nông sản",
    date: "2026-10-19",
    quantity: 200,
    status: "Chờ xác thực",
  },
  {
    id: "LH-006",
    product: "Rượu Sâm Đinh Lăng 500ml",
    category: "Thực phẩm bổ sung",
    date: "2026-10-15",
    quantity: 360,
    status: "Đã xác thực",
  },
]

export function RecentBatches() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)
  const rows = batches.filter(
    (item) =>
      (item.id + " " + item.product)
        .toLocaleLowerCase("vi")
        .includes(search.trim().toLocaleLowerCase("vi")) &&
      (status === "all" || item.status === status) &&
      (category === "all" || item.category === category)
  )
  const pages = Math.max(1, Math.ceil(rows.length / 5))
  const visible = rows.slice((page - 1) * 5, page * 5)
  function exportCsv() {
    const csv = [
      ["Mã lô", "Sản phẩm", "Loại", "Ngày tạo", "Số lượng", "Trạng thái"],
      ...rows.map((item) => [
        item.id,
        item.product,
        item.category,
        item.date,
        item.quantity,
        item.status,
      ]),
    ]
      .map((row) =>
        row
          .map((value) => '"' + String(value).replaceAll('"', '""') + '"')
          .join(",")
      )
      .join("\r\n")
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = "deeptrace-lo-hang.csv"
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Lô hàng gần đây</CardTitle>
          <CardDescription>
            Theo dõi tiến độ xác thực và thông tin sản phẩm.
          </CardDescription>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
          <DownloadIcon className="size-4" />
          Xuất CSV
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-48 flex-1">
            <SearchIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              aria-label="Tìm lô hàng"
              placeholder="Tìm mã lô, tên sản phẩm..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value ?? "all")
              setPage(1)
            }}
          >
            <SelectTrigger
              aria-label="Lọc trạng thái"
              className="w-full sm:w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Mọi trạng thái</SelectItem>
              {["Đã xác thực", "Chờ xác thực", "Bản nháp"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value ?? "all")
              setPage(1)
            }}
          >
            <SelectTrigger
              aria-label="Lọc loại sản phẩm"
              className="w-full sm:w-52"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Mọi loại sản phẩm</SelectItem>
              {["Thực phẩm bổ sung", "Nông sản"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(search || status !== "all" || category !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("")
                setStatus("all")
                setCategory("all")
                setPage(1)
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                {[
                  "Mã lô",
                  "Sản phẩm",
                  "Ngày tạo",
                  "Số lượng",
                  "Trạng thái",
                ].map((title) => (
                  <TableHead key={title} className="px-4">
                    {title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 font-medium text-primary">
                    {item.id}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-accent p-2 text-primary">
                        <PackageIcon className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium">{item.product}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4">
                    {item.date.split("-").reverse().join("/")}
                  </TableCell>
                  <TableCell className="px-4 tabular-nums">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge
                      variant="outline"
                      className={
                        item.status === "Đã xác thực"
                          ? "border-primary/20 bg-accent text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Không tìm thấy lô hàng phù hợp. Hãy thử xóa bộ lọc.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground" aria-live="polite">
            {rows.length} lô hàng · Trang {page}/{pages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
