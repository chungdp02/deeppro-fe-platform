import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getProducts, validateProducts, type Product } from "@/api/products"
import {
  productFormSchema,
  type ProductFormValues,
} from "./product-form-schema"
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

const emptyProduct: ProductFormValues = {
  name: "",
  category: "Thực phẩm bổ sung",
  origin: "Việt Nam",
  weight: "",
  gtin: "",
  group: "main",
}

// Keep mock changes when navigating between pages during this session.
let sessionProducts: Product[] | null = null

function getSessionProducts() {
  return sessionProducts
}

function saveSessionProducts(next: Product[]) {
  sessionProducts = next
}

export default function ProductsPage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>(
    getSessionProducts() ?? []
  )
  const [loading, setLoading] = useState(getSessionProducts() === null)
  const [loadError, setLoadError] = useState("")
  const [retry, setRetry] = useState(0)
  const [validationDemo, setValidationDemo] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [group, setGroup] = useState<Product["group"]>("main")
  const [sort, setSort] = useState("newest")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyProduct,
    mode: "onTouched",
  })
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [notice, setNotice] = useState("")
  useEffect(() => {
    if (retry === 0 && getSessionProducts() !== null) return

    const controller = new AbortController()
    getProducts(controller.signal)
      .then((data) => {
        saveSessionProducts(data)
        setProducts(data)
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setLoadError(
          cause instanceof Error ? cause.message : "Không tải được sản phẩm."
        )
        setLoading(false)
      })

    return () => controller.abort()
  }, [retry])
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
    saveSessionProducts(next)
    setProducts(next)
  }
  function reloadProducts() {
    setLoadError("")
    setLoading(true)
    setValidationDemo("")
    setRetry((value) => value + 1)
  }
  function tryInvalidData() {
    try {
      validateProducts([
        {
          id: "demo",
          name: "Sản phẩm thử nghiệm",
          category: "Nông sản",
          origin: "Việt Nam",
          weight: "",
          gtin: "",
          group: "sai-nhom",
        },
      ])
      setValidationDemo("page.products.demo.accepted")
    } catch {
      setValidationDemo("page.products.demo.rejected")
    }
  }
  function beginEdit(item?: Product) {
    setEditingId(item?.id ?? null)
    reset(
      item
        ? {
            name: item.name,
            category: item.category,
            origin: item.origin,
            weight: item.weight,
            gtin: item.gtin,
            group: item.group,
          }
        : { ...emptyProduct, group }
    )
    setOpen(true)
  }
  function save(next: ProductFormValues) {
    if (
      next.gtin &&
      products.some((item) => item.gtin === next.gtin && item.id !== editingId)
    ) {
      setError("gtin", {
        type: "manual",
        message: "page.products.duplicateGtin",
      })
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
    setNotice(editingId ? "page.products.updated" : "page.products.added")
    setOpen(false)
  }
  return (
    <>
      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wider text-primary">
              {t("page.products.eyebrow")}
            </p>
            <h1 className="text-3xl font-semibold">
              {t("page.products.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("page.products.description")}
            </p>
          </div>
          <Button disabled={loading || !!loadError} onClick={() => beginEdit()}>
            <PlusIcon className="size-4" />
            {t("page.products.add")}
          </Button>
        </div>
        {import.meta.env.DEV && (
          <Card className="border-dashed bg-muted/30 shadow-none">
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">{t("page.products.demo.title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("page.products.demo.description")}
                </p>
              </div>
              <p role="status" className="text-sm">
                {loading
                  ? t("page.products.demo.loading")
                  : loadError
                    ? t("page.products.demo.failed")
                    : t("page.products.demo.success", {
                        count: products.length,
                      })}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={reloadProducts}
                >
                  {t("page.products.demo.reload")}
                </Button>
                <Button variant="outline" size="sm" onClick={tryInvalidData}>
                  {t("page.products.demo.invalid")}
                </Button>
              </div>
              {validationDemo && (
                <p role="status" className="text-sm text-destructive">
                  {t(validationDemo)}
                </p>
              )}
            </CardContent>
          </Card>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [t("page.products.total"), products.length],
            [
              t("page.products.main"),
              products.filter((item) => item.group === "main").length,
            ],
            [
              t("page.products.sub"),
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
            {t(notice)}
          </p>
        )}
        {loadError && (
          <div
            role="alert"
            className="flex items-center justify-between gap-4 rounded-lg border border-destructive/30 p-4 text-sm text-destructive"
          >
            <span>{loadError}</span>
            <Button variant="outline" onClick={reloadProducts}>
              {t("page.products.retry")}
            </Button>
          </div>
        )}
        <Card>
          <CardContent className="space-y-5">
            <Tabs
              value={group}
              onValueChange={(value) => {
                if (value === "main" || value === "sub") setGroup(value)
              }}
            >
              <TabsList
                variant="line"
                className="h-auto w-full justify-start gap-4 border-b"
              >
                <TabsTrigger value="main" className="py-3">
                  {t("page.products.main")}
                </TabsTrigger>
                <TabsTrigger value="sub" className="py-3">
                  {t("page.products.sub")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-48 flex-1">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label={t("page.products.searchLabel")}
                  className="pl-9"
                  placeholder={t("page.products.search")}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                  }}
                />
              </div>
              <Select
                value={category}
                items={[
                  { value: "all", label: t("page.products.all") },
                  {
                    value: "Thực phẩm bổ sung",
                    label: t("page.products.food"),
                  },
                  { value: "Nông sản", label: t("page.products.agriculture") },
                ]}
                onValueChange={(value) => {
                  setCategory(value ?? "all")
                }}
              >
                <SelectTrigger
                  aria-label={t("page.products.category")}
                  className="w-full sm:w-52"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("page.products.all")}</SelectItem>
                  <SelectItem value="Thực phẩm bổ sung">
                    {t("page.products.food")}
                  </SelectItem>
                  <SelectItem value="Nông sản">
                    {t("page.products.agriculture")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sort}
                items={[
                  { value: "newest", label: t("page.products.newest") },
                  { value: "name", label: t("page.products.nameSort") },
                ]}
                onValueChange={(value) => {
                  setSort(value ?? "newest")
                }}
              >
                <SelectTrigger
                  aria-label={t("page.products.sort")}
                  className="w-full sm:w-44"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    {t("page.products.newest")}
                  </SelectItem>
                  <SelectItem value="name">
                    {t("page.products.nameSort")}
                  </SelectItem>
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
                  {t("page.products.clearFilters")}
                </Button>
              )}
            </div>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader className="bg-muted/60">
                  <TableRow>
                    {[
                      t("page.products.number"),
                      t("page.products.title"),
                      t("page.products.category"),
                      t("page.products.origin"),
                      t("page.products.weightColumn"),
                      t("page.products.gtin"),
                      t("page.products.actions"),
                    ].map((title) => (
                      <TableHead key={title} className="px-4">
                        {title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!loading &&
                    !loadError &&
                    rows.map((item, index) => (
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
                          <Badge variant="outline">
                            {item.category === "Thực phẩm bổ sung"
                              ? t("page.products.food")
                              : item.category === "Nông sản"
                                ? t("page.products.agriculture")
                                : item.category}
                          </Badge>
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
                              aria-label={t("page.products.editLabel", {
                                name: item.name,
                              })}
                              onClick={() => beginEdit(item)}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              aria-label={t("page.products.deleteLabel", {
                                name: item.name,
                              })}
                              onClick={() => setDeleting(item)}
                            >
                              <Trash2Icon className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-36 text-center">
                        {t("page.products.loading")}
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !loadError && !rows.length && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-36 text-center">
                        <p className="font-medium">
                          {t("page.products.noResults")}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t("page.products.noResultsHint")}
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
              {editingId ? t("page.products.edit") : t("page.products.add")}
            </DialogTitle>
            <DialogDescription>
              {t("page.products.temporary")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(save)} noValidate className="space-y-4">
            {(
              [
                ["name", t("page.products.name"), true],
                ["origin", t("page.products.origin"), true],
                ["weight", t("page.products.weight"), false],
                ["gtin", t("page.products.gtin"), false],
              ] as const
            ).map(([key, label, required]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={"product-" + key}>
                  {label}
                  {required ? " *" : ""}
                </Label>
                <Input
                  id={"product-" + key}
                  maxLength={key === "gtin" ? 14 : 160}
                  inputMode={key === "gtin" ? "numeric" : "text"}
                  aria-invalid={!!errors[key]}
                  aria-describedby={
                    errors[key] ? `product-${key}-error` : undefined
                  }
                  {...register(key)}
                />
                {errors[key] && (
                  <p
                    id={`product-${key}-error`}
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {t(errors[key]?.message ?? "")}
                  </p>
                )}
              </div>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-category">
                  {t("page.products.category")}
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      items={[
                        {
                          value: "Thực phẩm bổ sung",
                          label: t("page.products.food"),
                        },
                        {
                          value: "Nông sản",
                          label: t("page.products.agriculture"),
                        },
                      ]}
                      onValueChange={(value) => field.onChange(value ?? "")}
                    >
                      <SelectTrigger
                        id="product-category"
                        aria-invalid={!!errors.category}
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Thực phẩm bổ sung">
                          {t("page.products.food")}
                        </SelectItem>
                        <SelectItem value="Nông sản">
                          {t("page.products.agriculture")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p role="alert" className="text-sm text-destructive">
                    {t(errors.category.message ?? "")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-group">
                  {t("page.products.group")}
                </Label>
                <Controller
                  name="group"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      items={[
                        { value: "main", label: t("page.products.main") },
                        { value: "sub", label: t("page.products.sub") },
                      ]}
                      onValueChange={(value) => field.onChange(value ?? "")}
                    >
                      <SelectTrigger
                        id="product-group"
                        aria-invalid={!!errors.group}
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">
                          {t("page.products.main")}
                        </SelectItem>
                        <SelectItem value="sub">
                          {t("page.products.sub")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.group && (
                  <p role="alert" className="text-sm text-destructive">
                    {t(errors.group.message ?? "")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("page.products.cancel")}
              </Button>
              <Button type="submit">{t("page.products.save")}</Button>
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
            <DialogTitle>{t("page.products.deleteConfirm")}</DialogTitle>
            <DialogDescription>
              {t("page.products.deleteQuestion", { name: deleting?.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("page.products.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) {
                  update(products.filter((item) => item.id !== deleting.id))
                  setNotice("page.products.deleted")
                  setDeleting(null)
                }
              }}
            >
              {t("page.products.delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
