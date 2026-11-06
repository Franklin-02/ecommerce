/** Domain types. These describe the contract a future backend must satisfy. */

export type CategoryIcon =
  | "smartphone"
  | "accessories"
  | "cable"
  | "battery"
  | "headphones"
  | "speaker"
  | "laptop"
  | "watch"
  | "plug"
  | "lightbulb"
  | "home"
  | "router";

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: CategoryIcon;
  /** Cutout image used on category tiles. */
  image: string;
  /** Tile background, as a CSS colour token name from globals.css. */
  tint: "blue" | "violet" | "teal" | "amber" | "rose" | "slate";
  featured: boolean;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
}

export type ProductTag = "trending" | "bestseller" | "new" | "deal";

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  /** Current selling price. */
  price: number;
  /** Original price; present only when the product is discounted. */
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  unitsSold: number;
  tags: ProductTag[];
  /** ISO date the product was added to the catalogue. */
  addedAt: string;
  images: string[];
  summary: string;
  highlights: string[];
  specs: Record<string, string>;
  warrantyMonths: number;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  brandName: string;
  image: string;
  unitPrice: number;
  compareAtPrice?: number;
  maxQuantity: number;
  quantity: number;
}
