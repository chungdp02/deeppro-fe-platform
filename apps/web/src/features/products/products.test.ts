import { describe, expect, it } from "vitest"

import { validateProducts } from "./products"

const validProduct = {
  id: "SP-001",
  name: "Trà thảo mộc",
  category: "Nông sản",
  origin: "Việt Nam",
  weight: "200g",
  gtin: "8938533564251",
  group: "main",
}

describe("validateProducts", () => {
  it("chấp nhận danh sách sản phẩm đúng cấu trúc", () => {
    expect(validateProducts([validProduct])).toEqual([validProduct])
  })

  it("từ chối sản phẩm có nhóm không hợp lệ", () => {
    const invalidProduct = { ...validProduct, group: "unknown" }

    expect(() => validateProducts([invalidProduct])).toThrow(
      /Invalid product JSON at 0\.group/
    )
  })
})
