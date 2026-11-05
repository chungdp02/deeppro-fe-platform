import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
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

const faqKeys = ["addProduct", "filter", "persistence", "invite", "export", "sidebar"] as const
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
  const { t } = useTranslation()
  return (
    <main className={pageClass}>
      <Heading
        title={t("page.guide.title")}
        description={t("page.guide.description")}
      />
      <Tabs defaultValue="overview" className="gap-6">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="overview">{t("page.guide.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="start">{t("page.guide.tabs.start")}</TabsTrigger>
          <TabsTrigger value="features">{t("page.guide.tabs.features")}</TabsTrigger>
          <TabsTrigger value="faq">{t("page.guide.tabs.faq")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("page.guide.intro.title")}</CardTitle>
                <CardDescription>
                  {t("page.guide.intro.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm leading-7">
                <p>
                  {t("page.guide.intro.body")}
                </p>
                <div className="rounded-xl bg-accent p-4 text-accent-foreground">
                  <p className="font-semibold">{t("page.guide.intro.highlightTitle")}</p>
                  <p className="mt-1">
                    {t("page.guide.intro.highlightText")}
                  </p>
                </div>
                <Button nativeButton={false} render={<Link to="/san-pham" />}>
                  {t("page.guide.intro.manageProducts")}
                  <ArrowUpRightIcon className="size-4" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("page.guide.intro.quickAccess")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: t("page.guide.intro.companyProfile"),
                    href: "/cong-ty",
                    icon: BookOpenIcon,
                  },
                  {
                    title: t("page.guide.intro.productCatalog"),
                    href: "/san-pham",
                    icon: PackageIcon,
                  },
                  {
                    title: t("page.guide.intro.companyMembers"),
                    href: "/nhan-vien",
                    icon: UsersIcon,
                  },
                ].map(({ title, href, icon: Icon }) => (
                  <Button
                    key={href}
                    variant="outline"
                    className="w-full justify-start"
                    nativeButton={false}
                    render={<Link to={href} />}
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
              <CardTitle>{t("page.guide.start.title")}</CardTitle>
              <CardDescription>
                {t("page.guide.start.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                [
                  t("page.guide.start.companyTitle"),
                  t("page.guide.start.companyText"),
                  "/cong-ty",
                ],
                [
                  t("page.guide.start.productTitle"),
                  t("page.guide.start.productText"),
                  "/san-pham",
                ],
                [
                  t("page.guide.start.employeeTitle"),
                  t("page.guide.start.employeeText"),
                  "/nhan-vien",
                ],
                [
                  t("page.guide.start.activityTitle"),
                  t("page.guide.start.activityText"),
                  "/tong-quan",
                ],
              ].map(([title, text, href], index) => (
                <Link
                  key={href}
                  to={href}
                  className="flex gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: t("page.guide.features.productsTitle"),
                text: t("page.guide.features.productsText"),
                icon: PackageIcon,
              },
              {
                title: t("page.guide.features.employeesTitle"),
                text: t("page.guide.features.employeesText"),
                icon: UsersIcon,
              },
              {
                title: t("page.guide.features.qrTitle"),
                text: t("page.guide.features.qrText"),
                icon: QrCodeIcon,
              },
              {
                title: t("page.guide.features.companyTitle"),
                text: t("page.guide.features.companyText"),
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
          <FaqList />
        </TabsContent>
      </Tabs>
    </main>
  )
}
function FaqList({ search = "" }: { search?: string }) {
  const { t } = useTranslation()
  const items = faqKeys
    .map((key) => ({
      question: t(`page.help.faq.${key}.question`),
      answer: t(`page.help.faq.${key}.answer`),
    }))
    .filter((item) =>
      (item.question + item.answer)
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase())
    )
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
            {t("page.help.empty")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function HelpPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  return (
    <main className={pageClass}>
      <Heading
        title={t("page.help.title")}
        description={t("page.help.description")}
      />
      <div className="relative max-w-xl">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="bg-background pl-9"
          aria-label={t("page.help.search")}
          placeholder={t("page.help.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <FaqList search={search} />
      <Card>
        <CardHeader>
          <CardTitle>{t("page.help.contactTitle")}</CardTitle>
          <CardDescription>
            {t("page.help.contactText")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/huong-dan" />}
          >
            {t("page.help.viewGuide")}
            <ArrowUpRightIcon className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
export function SettingsPage() {
  const { t, i18n } = useTranslation()
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
        title={t("page.settings.title")}
        description={t("page.settings.description")}
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("page.settings.appearance")}</CardTitle>
          <CardDescription>{t("page.settings.appliedLocally")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-5">
            <div className="space-y-2">
              <Label>{t("page.settings.displayMode")}</Label>
              <Select
                value={choice}
                items={[
                  { value: "light", label: t("page.settings.light") },
                  { value: "dark", label: t("page.settings.dark") },
                  { value: "system", label: t("page.settings.system") },
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
                <SelectTrigger
                  aria-label={t("page.settings.displayMode")}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    {t("page.settings.light")}
                  </SelectItem>
                  <SelectItem value="dark">
                    {t("page.settings.dark")}
                  </SelectItem>
                  <SelectItem value="system">
                    {t("page.settings.system")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit">{t("page.settings.save")}</Button>
              {saved && (
                <p role="status" className="text-sm text-primary">
                  {t("page.settings.saved")}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("page.settings.workspaceInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y text-sm">
            {[
              [t("page.settings.company"), "Công ty Cổ phần Thực phẩm ABZ"],
              [
                t("language"),
                i18n.language === "en" ? "English" : "Tiếng Việt",
              ],
              [t("page.settings.timeZone"), "Asia/Bangkok (UTC+7)"],
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
