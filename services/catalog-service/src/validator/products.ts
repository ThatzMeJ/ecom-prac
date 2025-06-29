import * as z from "zod/v4";
import { Money } from "bigint-money";

const MoneySchema = z.instanceof(Money);


const ProductSchema = z.object({
  /* ---------- Identity & SEO ---------- */
  id: z.string().uuid(),
  sku: z.string(),
  slug: z.string(),
  gtin: z.string().optional(),
  brand: z.string(),
  name: z.string(),
  description: z.string().optional(),

  /* ---------- Classification ---------- */
  categoryPath: z.array(z.string()).nonempty(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().uuid().optional(),
  variantAxes: z
    .object({
      size: z.string().optional(),
      color: z.string().optional(),
      material: z.string().optional(),
      style: z.string().optional(),
      fit: z.string().optional(),
    })
    .partial()
    .optional(),

  /* ---------- Pricing & Stock ---------- */
  currency: z.string().length(3),             // ISO-4217
  price: MoneySchema,
  salePrice: MoneySchema.optional(),
  saleStart: z.date().optional(),
  saleEnd: z.date().optional(),
  inventoryStatus: z.enum([
    "in_stock",
    "preorder",
    "backorder",
    "discontinued",
  ]),
  quantity: z.number().int(),
  lowStockThreshold: z.number().int().positive().optional(),

  /* ---------- Logistics ---------- */
  weightGrams: z.number().positive().optional(),
  widthMm: z.number().positive().optional(),
  heightMm: z.number().positive().optional(),
  depthMm: z.number().positive().optional(),
  shippingClass: z.enum(["small", "oversize", "hazmat"]).optional(),

  /* ---------- Media ---------- */
  images: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string(),
      order: z.number().int(),
    })
  ),
  videoUrls: z.array(z.string().url()).optional(),

  /* ---------- Compliance ---------- */
  ageRestriction: z.string().optional(),
  hazardousMaterialCode: z.string().optional(),
  countryOfOrigin: z.string().length(2).optional(),

  /* ---------- Ratings & UX ---------- */
  aggregateRating: z.number().min(1).max(5).optional(),
  reviewCount: z.number().int().optional(),

  /* ---------- Meta ---------- */
  schemaVersion: z.literal(1),                // fixed for now
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().optional(),
  discontinuedAt: z.date().optional(),
})


export type Product = z.infer<typeof ProductSchema>;
