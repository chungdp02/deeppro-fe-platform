import { z } from "zod"

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  origin: z.string(),
  weight: z.string(),
  gtin: z.string(),
  group: z.enum(["main", "sub"]),
})

const productsSchema = z.array(productSchema)

export type Product = z.infer<typeof productSchema>

export class ProductValidationError extends Error {
  readonly path: string

  constructor(path: string) {
    super(`Invalid product JSON at ${path}`)
    this.path = path
  }
}

export class ProductRequestError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`Could not load products (HTTP ${status})`)
    this.status = status
  }
}

export function validateProducts(data: unknown): Product[] {
  const result = productsSchema.safeParse(data)
  if (!result.success) {
    const issue = result.error.issues[0]
    throw new ProductValidationError(issue.path.join(".") || "root")
  }
  return result.data
}

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}products.json`, {
    signal,
  })
  if (!response.ok) {
    throw new ProductRequestError(response.status)
  }

  const data: unknown = await response.json()
  return validateProducts(data)
}
