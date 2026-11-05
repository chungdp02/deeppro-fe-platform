import { expect, test } from "@playwright/test"

test("tải và hiển thị sản phẩm từ JSON", async ({ page }) => {
  await page.goto("/#/san-pham")

  await expect(page.getByRole("heading", { name: "Sản phẩm" })).toBeVisible()
  await expect(
    page.getByRole("cell", { name: "Rượu Sâm Đinh Lăng 500ML", exact: true })
  ).toBeVisible()
})

test("báo lỗi tên trống rồi cho thêm sản phẩm hợp lệ", async ({ page }) => {
  await page.goto("/#/san-pham")
  await page.getByRole("button", { name: "Thêm sản phẩm" }).click()
  await page.getByRole("button", { name: "Lưu sản phẩm" }).click()

  await expect(
    page.getByRole("alert").filter({ hasText: "Vui lòng nhập tên sản phẩm." })
  ).toBeVisible()

  await page.getByRole("textbox", { name: /Tên sản phẩm/ }).fill("Trà thử nghiệm")
  await page.getByRole("button", { name: "Lưu sản phẩm" }).click()

  await expect(
    page.getByRole("cell", { name: "Trà thử nghiệm", exact: true })
  ).toBeVisible()
})

test("chuyển trang bằng router và mở được liên kết cũ", async ({ page }) => {
  await page.goto("/#san-pham")

  await expect(page).toHaveURL(/#\/san-pham$/)
  await expect(page.getByRole("heading", { name: "Sản phẩm" })).toBeVisible()

  await page.getByRole("link", { name: "Công ty", exact: true }).click()
  await expect(page).toHaveURL(/#\/cong-ty$/)
  await expect(
    page.getByRole("heading", { name: "Thông tin doanh nghiệp" })
  ).toBeVisible()

  await page.goBack()
  await expect(page.getByRole("heading", { name: "Sản phẩm" })).toBeVisible()
})
