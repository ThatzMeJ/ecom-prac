import { Product } from "../validator/products";

declare namespace Express {
  interface Request {
    product?: Product;
    user?: {
      userId: string;
      email: string;
      role?: string;
      token: string;
      password?: string;
    }
  }
}