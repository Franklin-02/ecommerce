/**
 * The storefront's only door to catalog data. Everything is async and returns
 * domain types, so moving to a real backend means rewriting these function
 * bodies as fetch calls; no component changes.
 */
import { brands, categories } from "@/data/categories";
import { coupons } from "@/data/marketing";
import { products } from "@/data/products";
import { discountPercent } from "@/lib/pricing";
import type { Brand, Category, Product } from "@/types/catalog";
import type { Coupon } from "@/types/commerce";

const inStock = (product: Product) => product.stock > 0;

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getBrands(): Promise<Brand[]> {
  return brands;
}

export async function getTrendingProducts(limit = 10): Promise<Product[]> {
  return products
    .filter((p) => p.tags.includes("trending") && inStock(p))
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit);
}

/** Ranked by revenue rather than units, so cheap plugs don't crowd out the catalog. */
export async function getBestSellers(limit = 6): Promise<Product[]> {
  return products
    .filter(inStock)
    .sort((a, b) => b.unitsSold * b.price - a.unitsSold * a.price)
    .slice(0, limit);
}

export async function getLatestArrivals(limit = 10): Promise<Product[]> {
  return [...products].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, limit);
}

export async function getSpecialOffers(limit = 4): Promise<Product[]> {
  return products
    .filter((p) => p.tags.includes("deal") && inStock(p))
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, limit);
}

export async function getTopRatedProducts(limit = 24): Promise<Product[]> {
  return products
    .filter(inStock)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

/** Top-rated products from the categories the shopper has shown interest in. */
export async function getRecommendations(seedProductIds: string[], limit = 8): Promise<Product[]> {
  const seeds = new Set(seedProductIds);
  const seedCategories = new Set(
    products.filter((p) => seeds.has(p.id)).map((p) => p.categoryId),
  );
  const candidates = (await getTopRatedProducts(products.length)).filter((p) => !seeds.has(p.id));
  return [
    ...candidates.filter((p) => seedCategories.has(p.categoryId)),
    ...candidates.filter((p) => !seedCategories.has(p.categoryId)),
  ].slice(0, limit);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

/** Every product, best sellers first. */
export async function getCatalogProducts(): Promise<Product[]> {
  return [...products].sort((a, b) => b.unitsSold - a.unitsSold);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return (await getCatalogProducts()).filter((product) => product.categoryId === categoryId);
}

export async function getDiscountedProducts(): Promise<Product[]> {
  return products
    .filter((product) => discountPercent(product) > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a));
}

/** Same category first, then the same brand, so short categories still fill a row. */
export async function getRelatedProducts(product: Product, limit = 10): Promise<Product[]> {
  const others = (await getCatalogProducts()).filter((p) => p.id !== product.id);
  return [
    ...others.filter((p) => p.categoryId === product.categoryId),
    ...others.filter((p) => p.categoryId !== product.categoryId && p.brandId === product.brandId),
  ].slice(0, limit);
}

const complements: Record<string, string[]> = {
  cat_phones: ["cat_mobile_acc", "cat_chargers"],
  cat_mobile_acc: ["cat_chargers", "cat_power_banks"],
  cat_chargers: ["cat_power_banks", "cat_mobile_acc"],
  cat_power_banks: ["cat_chargers", "cat_mobile_acc"],
  cat_audio: ["cat_chargers", "cat_speakers"],
  cat_speakers: ["cat_electrical", "cat_audio"],
  cat_computing: ["cat_chargers", "cat_electrical"],
  cat_watches: ["cat_chargers", "cat_audio"],
  cat_electrical: ["cat_chargers", "cat_lighting"],
  cat_lighting: ["cat_smart_home", "cat_electrical"],
  cat_smart_home: ["cat_lighting", "cat_networking"],
  cat_networking: ["cat_smart_home", "cat_electrical"],
};

/** The best-selling in-stock item from each category that pairs with this product. */
export async function getFrequentlyBoughtTogether(product: Product): Promise<Product[]> {
  const catalog = (await getCatalogProducts()).filter(inStock);
  return (complements[product.categoryId] ?? []).flatMap((categoryId) => {
    const match = catalog.find((p) => p.categoryId === categoryId && p.id !== product.id);
    return match ? [match] : [];
  });
}

export type CouponResult = { ok: true; coupon: Coupon } | { ok: false; message: string };

export async function validateCoupon(code: string): Promise<CouponResult> {
  const coupon = coupons.find((candidate) => candidate.code === code.trim().toUpperCase());
  if (!coupon) return { ok: false, message: "That code isn't valid. Check it and try again." };
  if (coupon.status === "expired") return { ok: false, message: "This code has expired." };
  if (coupon.status === "scheduled") return { ok: false, message: "This code isn't active yet." };
  if (coupon.status === "paused") return { ok: false, message: "This code is currently unavailable." };
  if (coupon.usageCount >= coupon.usageLimit) {
    return { ok: false, message: "This code has reached its usage limit." };
  }
  return { ok: true, coupon };
}

export interface SearchResults {
  products: Product[];
  categories: Category[];
}

/** Every query word must match somewhere in the product's searchable text. */
export async function searchCatalog(query: string, limit = 6): Promise<SearchResults> {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return { products: [], categories: [] };

  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const matches = (text: string) => terms.every((term) => text.includes(term));

  return {
    products: products
      .filter((p) => matches(`${p.name} ${categoryName.get(p.categoryId)} ${p.summary}`.toLowerCase()))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, limit),
    categories: categories.filter((c) => matches(c.name.toLowerCase())).slice(0, 3),
  };
}
