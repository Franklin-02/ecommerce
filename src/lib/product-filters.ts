import { discountPercent } from "@/lib/pricing";
import type { Product } from "@/types/catalog";

export const PAGE_SIZE = 12;

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
  { value: "discount", label: "Biggest discount" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];
export type ListingView = "grid" | "list";

export const ratingOptions = [4.5, 4, 3.5];

export interface ListingFilters {
  sort: SortValue;
  brands: string[];
  categories: string[];
  min?: number;
  max?: number;
  rating?: number;
  inStock: boolean;
  onSale: boolean;
  view: ListingView;
  page: number;
}

const list = (value: string | null) => (value ? value.split(",").filter(Boolean) : []);

const positive = (value: string | null) => {
  const parsed = Number(value);
  return value && Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

/** The URL is the source of truth, so filtered views can be shared and survive reloads. */
export function parseFilters(params: URLSearchParams): ListingFilters {
  const sort = params.get("sort");
  return {
    sort: sortOptions.find((option) => option.value === sort)?.value ?? "featured",
    brands: list(params.get("brand")),
    categories: list(params.get("category")),
    min: positive(params.get("min")),
    max: positive(params.get("max")),
    rating: positive(params.get("rating")),
    inStock: params.get("stock") === "1",
    onSale: params.get("sale") === "1",
    view: params.get("view") === "list" ? "list" : "grid",
    page: Math.max(1, Math.floor(Number(params.get("page"))) || 1),
  };
}

export function applyFilters(products: Product[], filters: ListingFilters) {
  const matching = products.filter(
    (product) =>
      (filters.brands.length === 0 || filters.brands.includes(product.brandName)) &&
      (filters.categories.length === 0 || filters.categories.includes(product.categoryId)) &&
      (filters.min === undefined || product.price >= filters.min) &&
      (filters.max === undefined || product.price <= filters.max) &&
      (filters.rating === undefined || product.rating >= filters.rating) &&
      (!filters.inStock || product.stock > 0) &&
      (!filters.onSale || discountPercent(product) > 0),
  );

  const compare: Record<SortValue, ((a: Product, b: Product) => number) | null> = {
    featured: null,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    newest: (a, b) => b.addedAt.localeCompare(a.addedAt),
    discount: (a, b) => discountPercent(b) - discountPercent(a),
  };
  const sorter = compare[filters.sort];
  return sorter ? [...matching].sort(sorter) : matching;
}
