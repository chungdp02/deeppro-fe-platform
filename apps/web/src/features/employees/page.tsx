import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import {
  SearchIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  UsersIcon,
  UserCheckIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
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
  TableHead,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table"

type Employee = {
  id: string
  name: string
  email: string
  role: string
  status: string
  date: string
}
const initialEmployees: Employee[] = [
  {
    id: "NV-001",
    name: "Nguyễn Minh Anh",
    email: "minhanh@example.com",
    role: "Quản trị viên",
    status: "Hoạt động",
    date: "2026-10-01",
  },
  {
    id: "NV-002",
    name: "Trần Hoàng Nam",
    email: "hoangnam@example.com",
    role: "Quản lý",
    status: "Hoạt động",
    date: "2026-10-05",
  },
  {
    id: "NV-003",
    name: "Lê Thu Hà",
    email: "thuha@example.com",
    role: "Nhân viên",
    status: "Hoạt động",
    date: "2026-10-12",
  },
  {
    id: "NV-004",
    name: "Phạm Đức Huy",
    email: "duchuy@example.com",
    role: "Nhân viên",
    status: "Tạm ngưng",
    date: "2026-10-16",
  },
]
const roles = ["Quản trị viên", "Quản lý", "Nhân viên"]
const statuses = ["Hoạt động", "Tạm ngưng"]
const emptyDraft = {
  name: "",
  email: "",
  role: "Nhân viên",
  status: "Hoạt động",
}
let sessionEmployees = initialEmployees

export default function EmployeesPage() {
  const { t } = useTranslation()
  const roleLabel = (value: string) =>
    value === "Quản trị viên"
      ? t("page.employees.roles.admin")
      : value === "Quản lý"
        ? t("page.employees.roles.manager")
        : t("page.employees.roles.employee")
  const statusLabel = (value: string) =>
    value === "Hoạt động"
      ? t("page.employees.statuses.active")
      : t("page.employees.statuses.paused")
  const [employees, setEmployees] = useState(sessionEmployees)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [deleting, setDeleting] = useState<Employee | null>(null)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const rows = employees.filter(
    (item) =>
      (item.name + " " + item.email)
        .toLocaleLowerCase("vi")
        .includes(search.trim().toLocaleLowerCase("vi")) &&
      (role === "all" || item.role === role) &&
      (status === "all" || item.status === status)
  )
  function update(next: Employee[]) {
    sessionEmployees = next
    setEmployees(next)
  }
  function edit(item?: Employee) {
    setEditing(item ?? null)
    setDraft(
      item
        ? {
            name: item.name,
            email: item.email,
            role: item.role,
            status: item.status,
          }
        : emptyDraft
    )
    setError("")
    setOpen(true)
  }
  function save(event: FormEvent) {
    event.preventDefault()
    const name = draft.name.trim()
    const email = draft.email.trim().toLowerCase()
    if (!name || !email) {
      setError("page.employees.required")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("page.employees.invalidEmail")
      return
    }
    if (
      employees.some(
        (item) => item.email.toLowerCase() === email && item.id !== editing?.id
      )
    ) {
      setError("page.employees.duplicateEmail")
      return
    }
    const next = {
      ...draft,
      name,
      email,
      id: editing?.id ?? crypto.randomUUID(),
      date:
        editing?.date ??
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Bangkok",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date()),
    }
    update(
      editing
        ? employees.map((item) => (item.id === editing.id ? next : item))
        : [next, ...employees]
    )
    setSearch("")
    setRole("all")
    setStatus("all")
    setOpen(false)
    setNotice(
      editing
        ? "page.employees.updated"
        : "page.employees.added"
    )
  }
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium tracking-wider text-primary">
            {t("page.employees.eyebrow")}
          </p>
          <h1 className="text-3xl font-semibold">
            {t("page.employees.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("page.employees.description")}
          </p>
        </div>
        <Button onClick={() => edit()}>
          <PlusIcon className="size-4" />
          {t("page.employees.add")}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t("page.employees.total"), value: employees.length, icon: UsersIcon },
          {
            label: t("page.employees.activeCount"),
            value: employees.filter((item) => item.status === "Hoạt động")
              .length,
            icon: UserCheckIcon,
          },
          {
            label: t("page.employees.adminCount"),
            value: employees.filter((item) => item.role === "Quản trị viên")
              .length,
            icon: ShieldCheckIcon,
          },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="py-5 shadow-none">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">
                  {value}
                </p>
              </div>
              <span className="rounded-xl bg-accent p-3 text-primary">
                <Icon className="size-5" />
              </span>
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
      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-48 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label={t("page.employees.search")}
                placeholder={t("page.employees.searchPlaceholder")}
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={role}
              items={[
                { value: "all", label: t("page.employees.allRoles") },
                ...roles.map((value) => ({ value, label: roleLabel(value) })),
              ]}
              onValueChange={(value) => setRole(value ?? "all")}
            >
              <SelectTrigger
                aria-label={t("page.employees.roleFilter")}
                className="w-full sm:w-44"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("page.employees.allRoles")}</SelectItem>
                {roles.map((value) => (
                  <SelectItem key={value} value={value}>
                    {roleLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              items={[
                { value: "all", label: t("page.employees.status") },
                ...statuses.map((value) => ({ value, label: statusLabel(value) })),
              ]}
              onValueChange={(value) => setStatus(value ?? "all")}
            >
              <SelectTrigger
                aria-label={t("page.employees.statusFilter")}
                className="w-full sm:w-44"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("page.employees.status")}</SelectItem>
                {statuses.map((value) => (
                  <SelectItem key={value} value={value}>
                    {statusLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(search || role !== "all" || status !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("")
                  setRole("all")
                  setStatus("all")
                }}
              >
                {t("page.employees.clearFilters")}
              </Button>
            )}
          </div>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/60">
                <TableRow>
                  {[
                    t("page.employees.title"),
                    t("page.employees.company"),
                    t("page.employees.role"),
                    t("page.employees.status"),
                    t("page.employees.created"),
                    t("page.employees.actions"),
                  ].map((title) => (
                    <TableHead className="px-4" key={title}>
                      {title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-accent text-primary">
                            {item.name
                              .trim()
                              .split(/\s+/)
                              .slice(-2)
                              .map((word) => word[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-48 px-4 whitespace-normal text-muted-foreground">
                      Công ty Cổ phần Thực phẩm ABZ
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge variant="outline">{roleLabel(item.role)}</Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge
                        variant="outline"
                        className={
                          item.status === "Hoạt động"
                            ? "border-primary/20 bg-accent text-primary"
                            : "text-muted-foreground"
                        }
                      >
                        {statusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      {item.date.split("-").reverse().join("/")}
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={t("page.employees.editLabel", { name: item.name })}
                          onClick={() => edit(item)}
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          aria-label={t("page.employees.deleteLabel", { name: item.name })}
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
                    <TableCell colSpan={6} className="h-36 text-center">
                      <p className="font-medium">{t("page.employees.empty")}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("page.employees.emptyHint")}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t(editing ? "page.employees.edit" : "page.employees.add")}
            </DialogTitle>
            <DialogDescription>
              {t("page.employees.temporary")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee-name">{t("page.employees.name")} *</Label>
              <Input
                id="employee-name"
                required
                maxLength={100}
                autoComplete="name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-email">Email *</Label>
              <Input
                id="employee-email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("page.employees.role")}</Label>
                <Select
                  value={draft.role}
                  items={roles.map((value) => ({ value, label: roleLabel(value) }))}
                  onValueChange={(value) =>
                    setDraft({ ...draft, role: value ?? draft.role })
                  }
                >
                  <SelectTrigger
                    aria-label={t("page.employees.employeeRole")}
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((value) => (
                      <SelectItem value={value} key={value}>
                        {roleLabel(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("page.employees.status")}</Label>
                <Select
                  value={draft.status}
                  items={statuses.map((value) => ({ value, label: statusLabel(value) }))}
                  onValueChange={(value) =>
                    setDraft({ ...draft, status: value ?? draft.status })
                  }
                >
                  <SelectTrigger
                    aria-label={t("page.employees.employeeStatus")}
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((value) => (
                      <SelectItem value={value} key={value}>
                        {statusLabel(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {t(error)}
              </p>
            )}
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("page.employees.cancel")}
              </Button>
              <Button type="submit">{t("page.employees.save")}</Button>
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
            <DialogTitle>{t("page.employees.deleteConfirm")}</DialogTitle>
            <DialogDescription>
              {t("page.employees.deleteQuestion", { name: deleting?.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("page.employees.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) {
                  update(employees.filter((item) => item.id !== deleting.id))
                  setNotice("page.employees.deleted")
                  setDeleting(null)
                }
              }}
            >
              {t("page.employees.delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
