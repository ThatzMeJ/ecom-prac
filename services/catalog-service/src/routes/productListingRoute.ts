import { Request, Response, Router } from "express";
import { Product } from "../validator/products.js";
import { Money } from "bigint-money";
import * as z from "zod/v4";

const products: Product[] = [
  {
    /* ---------- Identity & SEO ---------- */
    id: "73ec156e-9cce-4b49-9dd3-1b962b5a9b05",
    sku: "KEL-FRL-101",
    slug: "kelloggs-froot-loops-10oz",
    gtin: "00038000123456",
    brand: "Kellogg's",
    name: "Kellogg's Froot Loops Breakfast Cereal 10 oz",
    description:
      "Sweetened multigrain cereal with natural fruit flavors. A fun, colorful breakfast classic.",
    /* ---------- Classification ---------- */
    categoryPath: ["Grocery", "Breakfast & Cereal", "Cold Cereal"],
    tags: ["cereal", "breakfast", "kids"],
    /* ---------- Pricing & Stock ---------- */
    currency: "USD",
    price: new Money(399, "USD"),          // $3.99
    salePrice: new Money(349, "USD"),      // $3.49 on sale
    saleStart: new Date(Date.now() - 86400000),   // started yesterday
    saleEnd: new Date(Date.now() + 86400000 * 7), // ends in 7 days
    inventoryStatus: "in_stock",
    quantity: 120,
    lowStockThreshold: 5,
    /* ---------- Logistics ---------- */
    weightGrams: 285,
    shippingClass: "small",
    /* ---------- Media ---------- */
    images: [
      {
        url: "https://example.com/images/frootloops-front.jpg",
        alt: "Front of Kellogg's Froot Loops cereal box",
        order: 1
      },
      {
        url: "https://example.com/images/frootloops-back.jpg",
        alt: "Back of Kellogg's Froot Loops cereal box",
        order: 2
      }
    ],
    /* ---------- Ratings & UX ---------- */
    aggregateRating: 4.6,
    reviewCount: 1380,
    /* ---------- Meta ---------- */
    schemaVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date()
  },
  {
    id: "1d5b7a53-00c4-478b-9c38-5f2c6bf90937",
    sku: "NAB-ORE-303",
    slug: "nabisco-oreo-classic-18oz",
    brand: "Nabisco",
    name: "Oreo Chocolate Sandwich Cookies 18 oz",
    description:
      "Classic Oreo cookies with creamy filling—perfect for dunking in milk.",
    categoryPath: ["Grocery", "Snacks", "Cookies"],
    tags: ["cookies", "snack", "chocolate"],
    currency: "USD",
    price: new Money(429, "USD"),          // $4.29
    inventoryStatus: "preorder",
    quantity: 0,
    images: [
      {
        url: "https://example.com/images/oreo-classic.jpg",
        alt: "Package of classic Oreo cookies",
        order: 1
      }
    ],
    schemaVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];


const router = Router();

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const product = products.find((product) => product.id === id);

  if (!product) {
    res.status(404).json({
      message: "Product not found"
    });
    return;
  }

  res.status(200).json({
    message: `Product id ${id} found`,
    product: product
  });
});

const randomSchema = z.object({
  name: z.string(),
  email: z.string(),
  isAdmin: z.boolean(),
});

type RandomProduct = z.infer<typeof randomSchema>;

router.post("/random", (req: Request, res: Response) => {
  try {
    const result = randomSchema.safeParse(req.body);

    if (!result.success) {
      // result.error is already a ZodError
      res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors
      });
      return;
    }

    res.status(200).json({
      message: "Random product",
      product: result.data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.issues
      });
      return;
    } else {
      res.status(500).json({
        message: "Error",
        error: error
      });
    }
  }
});



export default router;