import { expect, test } from "@playwright/test"

test("đổi sang EN trên nhiều trang và nhớ lựa chọn sau khi tải lại", async ({ page }) => {
  await page.goto("/#/cong-ty")
  await page.getByRole("button", { name: "English" }).click()

  await expect(page.getByRole("heading", { name: "Company information" })).toBeVisible()
  await expect(page.getByText("Contact & Address")).toBeVisible()

  await page.getByRole("link", { name: "Employees", exact: true }).click()
  await expect(page.getByRole("button", { name: "Add employee" })).toBeVisible()
  await page.getByRole("combobox", { name: "Filter roles" }).click()
  await page.getByRole("option", { name: "Manager" }).click()
  await expect(page.getByText("Trần Hoàng Nam")).toBeVisible()

  await page.reload()
  await expect(page.getByRole("button", { name: "Add employee" })).toBeVisible()

  await page.getByRole("link", { name: "Overview", exact: true }).click()
  await expect(page.getByText("Recent batches")).toBeVisible()

  await page.getByRole("link", { name: "Guide", exact: true }).click()
  await expect(page.getByText("Manage your business with DeepTrace")).toBeVisible()

  await page.getByRole("link", { name: "Help", exact: true }).click()
  await expect(page.getByText("How do I add a product?")).toBeVisible()
})

test("thông báo lỗi JSON đổi ngôn ngữ cùng giao diện", async ({ page }) => {
  await page.route("**/products.json", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "demo",
          name: "Sản phẩm thử",
          category: "Nông sản",
          origin: "Việt Nam",
          weight: "",
          gtin: "",
          group: "invalid",
        },
      ]),
    })
  )
  await page.goto("/#/san-pham")

  await expect(page.getByRole("alert")).toContainText("JSON sản phẩm không hợp lệ")
  await page.getByRole("button", { name: "English" }).click()
  await expect(page.getByRole("alert")).toContainText("Invalid product JSON")
})
