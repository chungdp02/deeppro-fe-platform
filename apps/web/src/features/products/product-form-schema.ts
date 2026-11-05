import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "validation.productNameRequired"),
  category: z.string().trim().min(1, "validation.productCategoryRequired"),
  origin: z.string().trim().min(1, "validation.productOriginRequired"),
  weight: z.string().trim(),
  gtin: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^(?:\d{8}|\d{12,14})$/.test(value),
      "validation.productGtinInvalid"
    ),
  group: z.enum(["main", "sub"]),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
