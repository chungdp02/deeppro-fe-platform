import { useState } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const statusLabel = (value: string) =>
    value === "Đã xác thực"
      ? t("page.overview.recentBatches.verified")
      : value === "Chờ xác thực"
        ? t("page.overview.recentBatches.pending")
        : t("page.overview.recentBatches.draft")
  const categoryLabel = (value: string) =>
    value === "Nông sản"
      ? t("page.products.agriculture")
      : t("page.products.food")
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
      [
        t("page.overview.recentBatches.code"),
        t("page.overview.recentBatches.product"),
        t("page.overview.recentBatches.category"),
        t("page.overview.recentBatches.created"),
        t("page.overview.recentBatches.quantity"),
        t("page.overview.recentBatches.status"),
      ],
      ...rows.map((item) => [
        item.id,
        item.product,
        categoryLabel(item.category),
        item.date,
        item.quantity,
        statusLabel(item.status),
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
          <CardTitle>{t("page.overview.recentBatches.title")}</CardTitle>
          <CardDescription>
            {t("page.overview.recentBatches.description")}
          </CardDescription>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
          <DownloadIcon className="size-4" />
          {t("page.overview.recentBatches.export")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-48 flex-1">
            <SearchIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              aria-label={t("page.overview.recentBatches.search")}
              placeholder={t("page.overview.recentBatches.searchPlaceholder")}
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
            items={[
              { value: "all", label: t("page.overview.recentBatches.status") },
              ...["Đã xác thực", "Chờ xác thực", "Bản nháp"].map(
                (value) => ({ value, label: statusLabel(value) }),
              ),
            ]}
            onValueChange={(value) => {
              setStatus(value ?? "all")
              setPage(1)
            }}
          >
            <SelectTrigger
              aria-label={t("page.overview.recentBatches.statusFilter")}
              className="w-full sm:w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("page.overview.recentBatches.status")}</SelectItem>
              {["Đã xác thực", "Chờ xác thực", "Bản nháp"].map((value) => (
                <SelectItem key={value} value={value}>
                  {statusLabel(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={category}
            items={[
              { value: "all", label: t("page.overview.recentBatches.allCategories") },
              ...["Thực phẩm bổ sung", "Nông sản"].map((value) => ({
                value,
                label: categoryLabel(value),
              })),
            ]}
            onValueChange={(value) => {
              setCategory(value ?? "all")
              setPage(1)
            }}
          >
            <SelectTrigger
              aria-label={t("page.overview.recentBatches.categoryFilter")}
              className="w-full sm:w-52"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("page.overview.recentBatches.allCategories")}</SelectItem>
              {["Thực phẩm bổ sung", "Nông sản"].map((value) => (
                <SelectItem key={value} value={value}>
                  {categoryLabel(value)}
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
              {t("page.overview.recentBatches.clearFilters")}
            </Button>
          )}
        </div>
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                {[
                  t("page.overview.recentBatches.code"),
                  t("page.overview.recentBatches.product"),
                  t("page.overview.recentBatches.created"),
                  t("page.overview.recentBatches.quantity"),
                  t("page.overview.recentBatches.status"),
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
                          {categoryLabel(item.category)}
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
                      {statusLabel(item.status)}
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
                    {t("page.overview.recentBatches.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground" aria-live="polite">
            {t("page.overview.recentBatches.pagination", {
              count: rows.length,
              page,
              pages,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              {t("page.overview.recentBatches.previous")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
            >
              {t("page.overview.recentBatches.next")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
