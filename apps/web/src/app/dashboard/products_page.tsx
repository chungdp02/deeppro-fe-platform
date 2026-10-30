import { useState, type FormEvent } from "react"
import {
  PackageIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@workspace/ui/components/table"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

type Product = {
  id: string
  name: string
  category: string
  origin: string
  weight: string
  gtin: string
  group: string
}
const initialProducts: Product[] = [
  {
    id: "SP-001",
    name: "Rượu Sâm Đinh Lăng 500ML",
    category: "Thực phẩm bổ sung",
    origin: "Việt Nam",
    weight: "500ml",
    gtin: "8938533564237",
    group: "main",
  },
  {
    id: "SP-002",
    name: "Rượu Sâm Đinh Lăng 500ML Cao Cấp",
    category: "Thực phẩm bổ sung",
    origin: "Việt Nam",
    weight: "500ml",
    gtin: "8938533564060",
    group: "main",
  },
  {
    id: "SP-003",
    name: "Rượu Sâm Đinh Lăng 300ml",
    category: "Thực phẩm bổ sung",
    origin: "Việt Nam",
    weight: "300ml",
    gtin: "8938533564244",
    group: "main",
  },
  {
    id: "SP-004",
    name: "Bộ tiêu chuẩn OCOP TP.HCM",
    category: "Nông sản",
    origin: "Việt Nam",
    weight: "",
    gtin: "2599999999901",
    group: "main",
  },
  {
    id: "SP-005",
    name: "Trà thảo mộc đóng hộp",
    category: "Nông sản",
    origin: "Việt Nam",
    weight: "200g",
    gtin: "8938533564251",
    group: "sub",
  },
]
const emptyProduct = {
  name: "",
  category: "Thực phẩm bổ sung",
  origin: "Việt Nam",
  weight: "",
  gtin: "",
  group: "main",
}
type Draft = typeof emptyProduct

// Keep mock changes when navigating between pages during this session.
let sessionProducts = initialProducts

export default function ProductsPage() {
  const [products, setProducts] = useState(sessionProducts)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [group, setGroup] = useState("main")
  const [sort, setSort] = useState("newest")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(emptyProduct)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [notice, setNotice] = useState("")
  const rows = products
    .filter(
      (item) =>
        item.group === group &&
        (category === "all" || item.category === category) &&
        (item.name + " " + item.gtin)
          .toLocaleLowerCase("vi")
          .includes(search.trim().toLocaleLowerCase("vi"))
    )
    .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name, "vi") : 0))
  function update(next: Product[]) {
    sessionProducts = next
    setProducts(next)
  }
  function beginEdit(item?: Product) {
    setEditingId(item?.id ?? null)
    setDraft(item ? { ...item } : { ...emptyProduct, group })
    setError("")
    setOpen(true)
  }
  function save(event: FormEvent) {
    event.preventDefault()
    const next = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [key, value.trim()])
    ) as Draft
    if (!next.name || !next.origin) {
      setError("Vui lòng nhập tên sản phẩm và xuất xứ.")
      return
    }
    if (next.gtin && !/^\d{8}$|^\d{12,14}$/.test(next.gtin)) {
      setError("GTIN cần gồm 8, 12, 13 hoặc 14 chữ số.")
      return
    }
    if (
      next.gtin &&
      products.some((item) => item.gtin === next.gtin && item.id !== editingId)
    ) {
      setError("GTIN đã được sử dụng bởi sản phẩm khác.")
      return
    }
    update(
      editingId
        ? products.map((item) =>
            item.id === editingId ? { ...next, id: editingId } : item
          )
        : [{ ...next, id: crypto.randomUUID() }, ...products]
    )
    setGroup(next.group)
    setSearch("")
    setCategory("all")
    setNotice(editingId ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm.")
    setOpen(false)
  }
  return (
    <>
      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wider text-primary">
              QUẢN LÝ DANH MỤC
            </p>
            <h1 className="text-3xl font-semibold">Sản phẩm</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Quản lý thông tin và mã truy xuất sản phẩm của doanh nghiệp.
            </p>
          </div>
          <Button onClick={() => beginEdit()}>
            <PlusIcon className="size-4" />
            Thêm sản phẩm
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Tổng sản phẩm", products.length],
            [
              "Sản phẩm chính",
              products.filter((item) => item.group === "main").length,
            ],
            [
              "Sản phẩm thầu phụ",
              products.filter((item) => item.group === "sub").length,
            ],
          ].map(([label, count]) => (
            <Card key={label} className="py-5 shadow-none">
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums">
                    {count}
                  </p>
                </div>
                <PackageIcon className="size-6 text-primary" />
              </CardContent>
            </Card>
          ))}
        </div>
        {notice && (
          <p
            role="status"
            className="rounded-lg border border-primary/20 bg-accent px-4 py-3 text-sm text-primary"
          >
            {notice}
          </p>
        )}
        <Card>
          <CardContent className="space-y-5">
            <Tabs
              value={group}
              onValueChange={(value) => {
                setGroup(String(value))
              }}
            >
              <TabsList
                variant="line"
                className="h-auto w-full justify-start gap-4 border-b"
              >
                <TabsTrigger value="main" className="py-3">
                  Sản phẩm chính
                </TabsTrigger>
                <TabsTrigger value="sub" className="py-3">
                  Sản phẩm thầu phụ
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-48 flex-1">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Tìm sản phẩm"
                  className="pl-9"
                  placeholder="Tìm tên sản phẩm hoặc GTIN..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                  }}
                />
              </div>
              <Select
                value={category}
                items={[
                  { value: "all", label: "Tất cả sản phẩm" },
                  { value: "Thực phẩm bổ sung", label: "Thực phẩm bổ sung" },
                  { value: "Nông sản", label: "Nông sản" },
                ]}
                onValueChange={(value) => {
                  setCategory(value ?? "all")
                }}
              >
                <SelectTrigger
                  aria-label="Lọc loại sản phẩm"
                  className="w-full sm:w-52"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                  <SelectItem value="Thực phẩm bổ sung">
                    Thực phẩm bổ sung
                  </SelectItem>
                  <SelectItem value="Nông sản">Nông sản</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sort}
                items={[
                  { value: "newest", label: "Mới nhất" },
                  { value: "name", label: "Tên A → Z" },
                ]}
                onValueChange={(value) => {
                  setSort(value ?? "newest")
                }}
              >
                <SelectTrigger
                  aria-label="Sắp xếp sản phẩm"
                  className="w-full sm:w-44"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="name">Tên A → Z</SelectItem>
                </SelectContent>
              </Select>
              {(search || category !== "all") && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearch("")
                    setCategory("all")
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
                      "STT",
                      "Sản phẩm",
                      "Loại sản phẩm",
                      "Xuất xứ",
                      "Quy cách",
                      "GTIN",
                      "Thao tác",
                    ].map((title) => (
                      <TableHead key={title} className="px-4">
                        {title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="rounded-lg bg-accent p-2.5 text-primary">
                            <PackageIcon className="size-5" />
                          </span>
                          <span className="max-w-64 min-w-40 font-medium whitespace-normal">
                            {item.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="px-4">{item.origin}</TableCell>
                      <TableCell className="px-4">
                        {item.weight || "—"}
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs">
                        {item.gtin || "—"}
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={"Sửa " + item.name}
                            onClick={() => beginEdit(item)}
                          >
                            <PencilIcon className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            aria-label={"Xóa " + item.name}
                            onClick={() => setDeleting(item)}
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!rows.length && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-36 text-center">
                        <p className="font-medium">Không tìm thấy sản phẩm</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Thử thay đổi bộ lọc hoặc thêm sản phẩm mới.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </DialogTitle>
            <DialogDescription>
              Thay đổi được lưu tạm trong phiên sử dụng; tải lại trang sẽ khôi
              phục dữ liệu mẫu.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            {(
              [
                ["name", "Tên sản phẩm", true],
                ["origin", "Xuất xứ", true],
                ["weight", "Quy cách (ví dụ: 500ml)", false],
                ["gtin", "GTIN", false],
              ] as const
            ).map(([key, label, required]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={"product-" + key}>
                  {label}
                  {required ? " *" : ""}
                </Label>
                <Input
                  id={"product-" + key}
                  required={required}
                  maxLength={key === "gtin" ? 14 : 160}
                  value={draft[key]}
                  inputMode={key === "gtin" ? "numeric" : "text"}
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
                />
              </div>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Loại sản phẩm</Label>
                <Select
                  value={draft.category}
                  onValueChange={(value) =>
                    setDraft({ ...draft, category: value ?? draft.category })
                  }
                >
                  <SelectTrigger aria-label="Loại sản phẩm" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thực phẩm bổ sung">
                      Thực phẩm bổ sung
                    </SelectItem>
                    <SelectItem value="Nông sản">Nông sản</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nhóm sản phẩm</Label>
                <Select
                  value={draft.group}
                  items={[
                    { value: "main", label: "Sản phẩm chính" },
                    { value: "sub", label: "Sản phẩm thầu phụ" },
                  ]}
                  onValueChange={(value) =>
                    setDraft({ ...draft, group: value ?? draft.group })
                  }
                >
                  <SelectTrigger aria-label="Nhóm sản phẩm" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Sản phẩm chính</SelectItem>
                    <SelectItem value="sub">Sản phẩm thầu phụ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu sản phẩm</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleting}
        onOpenChange={(value) => {
          if (!value) setDeleting(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa sản phẩm?</DialogTitle>
            <DialogDescription>
              Bạn muốn xóa “{deleting?.name}” khỏi danh sách?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) {
                  update(products.filter((item) => item.id !== deleting.id))
                  setNotice("Đã xóa sản phẩm.")
                  setDeleting(null)
                }
              }}
            >
              Xóa sản phẩm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
