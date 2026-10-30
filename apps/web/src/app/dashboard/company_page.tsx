import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const companySections = [
  {
    title: "Thông tin doanh nghiệp",
    fields: [
      { label: "Tên doanh nghiệp", value: "Công ty Cổ phần Thực phẩm ABZ" },
      { label: "Nhóm ngành", value: "Thực phẩm" },
      { label: "Trạng thái", value: "Hoạt động" },
    ],
  },
  {
    title: "Liên hệ & Địa chỉ",
    fields: [
      { label: "Email", value: "abz@example.com" },
      { label: "Số điện thoại", value: "090 123 4567" },
      { label: "Địa chỉ", value: "Thành phố Hồ Chí Minh" },
    ],
  },
  {
    title: "Thông tin pháp lý",
    fields: [
      { label: "Mã số thuế", value: "Chưa cập nhật" },
      { label: "Số giấy phép", value: "Chưa cập nhật" },
      { label: "Ngày cấp", value: "Chưa cập nhật" },
    ],
  },
  {
    title: "Thống kê hoạt động",
    fields: [
      { label: "Tổng số sản phẩm", value: "4" },
      { label: "Tổng số nhân viên", value: "3" },
    ],
  },
]

export default function Page() {
  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Thông tin doanh nghiệp
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quản lý thông tin và hồ sơ pháp lý của doanh nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {companySections.map((section, index) => (
            <Card
              key={section.title}
              className={index % 2 === 0 ? "lg:col-span-2" : ""}
            >
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <dl className="divide-y">
                  {section.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:justify-between sm:gap-6"
                    >
                      <dt className="text-sm text-muted-foreground">
                        {field.label}
                      </dt>
                      <dd className="text-sm font-medium break-words sm:max-w-[65%] sm:text-right">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
