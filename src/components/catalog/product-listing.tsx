"use client";

import { ChevronDown, LayoutGrid, List, SearchX, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/pricing";
import {
  applyFilters,
  PAGE_SIZE,
  parseFilters,
  sortOptions,
  type ListingView,
  type SortValue,
} from "@/lib/product-filters";
import type { Product } from "@/types/catalog";
import { FilterPanel, type Facet, type FilterPatch } from "./filter-panel";
import { ProductListRow } from "./product-list-row";

interface ProductListingProps {
  products: Product[];
  /** Maps category ids to names. Pass it when the listing spans categories. */
  categoryNames?: Record<string, string>;
  emptyTitle?: string;
  emptyBody?: string;
  emptyAction?: ReactNode;
}

function facets(values: string[], label: (value: string) => string = (value) => value): Facet[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts]
    .map(([value, count]) => ({ value, label: label(value), count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** The one listing used by category, search, deals and every other product page. */
export function ProductListing({ products, categoryNames, emptyTitle, emptyBody, emptyAction }: ProductListingProps) {
  const params = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const results = useMemo(() => applyFilters(products, filters), [products, filters]);

  const brandFacets = useMemo(() => facets(products.map((p) => p.brandName)), [products]);
  const categoryFacets = useMemo(
    () => (categoryNames ? facets(products.map((p) => p.categoryId), (id) => categoryNames[id] ?? id) : []),
    [products, categoryNames],
  );
  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  /**
   * replaceState updates useSearchParams without a server round trip. It takes the
   * real browser path because usePathname leaves out the GitHub Pages base path.
   */
  const setParams = (change: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    change(next);
    const query = next.toString();
    const path = window.location.pathname;
    window.history.replaceState(null, "", query ? `${path}?${query}` : path);
  };

  const onFilterChange = (patch: FilterPatch) =>
    setParams((next) => {
      const set = (key: string, value?: string) => (value ? next.set(key, value) : next.delete(key));
      if ("brand" in patch) set("brand", patch.brand?.join(","));
      if ("category" in patch) set("category", patch.category?.join(","));
      if ("min" in patch) set("min", patch.min?.toString());
      if ("max" in patch) set("max", patch.max?.toString());
      if ("rating" in patch) set("rating", patch.rating?.toString());
      if ("stock" in patch) set("stock", patch.stock ? "1" : undefined);
      if ("sale" in patch) set("sale", patch.sale ? "1" : undefined);
      next.delete("page");
    });

  const clearAll = () =>
    setParams((next) => ["brand", "category", "min", "max", "rating", "stock", "sale", "page"].forEach((key) => next.delete(key)));

  const chips: { label: string; clear: FilterPatch }[] = [
    ...filters.categories.map((id) => ({
      label: categoryNames?.[id] ?? id,
      clear: { category: filters.categories.filter((value) => value !== id) },
    })),
    ...filters.brands.map((brand) => ({
      label: brand,
      clear: { brand: filters.brands.filter((value) => value !== brand) },
    })),
    ...(filters.min !== undefined || filters.max !== undefined
      ? [{
          label: `${filters.min !== undefined ? formatPrice(filters.min) : "Any"} to ${filters.max !== undefined ? formatPrice(filters.max) : "any"}`,
          clear: { min: undefined, max: undefined },
        }]
      : []),
    ...(filters.rating !== undefined ? [{ label: `${filters.rating.toFixed(1)} and up`, clear: { rating: undefined } }] : []),
    ...(filters.inStock ? [{ label: "In stock", clear: { stock: false } }] : []),
    ...(filters.onSale ? [{ label: "On sale", clear: { sale: false } }] : []),
  ];

  if (products.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle ?? "Nothing to show yet"}
        body={emptyBody ?? "Check back soon, or browse another category."}
        action={emptyAction}
      />
    );
  }

  const shown = results.slice(0, filters.page * PAGE_SIZE);
  const remaining = results.length - shown.length;
  const panel = (
    <FilterPanel filters={filters} brands={brandFacets} categories={categoryFacets} priceBounds={priceBounds} onChange={onFilterChange} />
  );
  const viewButton = (view: ListingView, label: string, Icon: typeof List) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={filters.view === view}
      onClick={() => setParams((next) => (view === "list" ? next.set("view", "list") : next.delete("view")))}
      className={cn(
        "grid size-9 place-items-center rounded-lg transition-colors",
        filters.view === view ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-surface-sunken",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <aside aria-label="Filters" className="hidden lg:block">
        {panel}
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-sm text-ink-600" role="status">
            <span className="font-semibold text-ink-950">{results.length}</span> {results.length === 1 ? "product" : "products"}
          </p>
          <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters{chips.length > 0 && ` (${chips.length})`}
          </Button>
          <div className="relative">
            <select
              aria-label="Sort by"
              value={filters.sort}
              onChange={(event) => {
                const value = event.target.value as SortValue;
                setParams((next) => {
                  if (value === "featured") next.delete("sort");
                  else next.set("sort", value);
                  next.delete("page");
                });
              }}
              className="h-9 appearance-none rounded-full border border-line-strong bg-surface pr-8 pl-3.5 text-sm font-medium text-ink-900 focus:border-brand-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-500" aria-hidden />
          </div>
          <div role="group" aria-label="View" className="hidden gap-0.5 rounded-xl border border-line p-0.5 sm:flex">
            {viewButton("grid", "Grid view", LayoutGrid)}
            {viewButton("list", "List view", List)}
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                aria-label={`Remove filter: ${chip.label}`}
                onClick={() => onFilterChange(chip.clear)}
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pr-2 pl-3 text-[0.8125rem] font-medium text-brand-700 hover:bg-brand-100"
              >
                {chip.label}
                <X className="size-3.5" aria-hidden />
              </button>
            ))}
            <button type="button" onClick={clearAll} className="px-1 text-[0.8125rem] font-semibold text-ink-600 hover:text-ink-950">
              Clear all
            </button>
          </div>
        )}

        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No products match those filters"
            body="Try removing a filter or widening the price range."
            action={<Button onClick={clearAll}>Clear all filters</Button>}
          />
        ) : filters.view === "list" ? (
          <ul className="mt-4 space-y-3">
            {shown.map((product) => (
              <li key={product.id}>
                <ProductListRow product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {shown.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}

        {remaining > 0 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-sm text-ink-500">
              Showing {shown.length} of {results.length}
            </p>
            <Button variant="secondary" onClick={() => setParams((next) => next.set("page", String(filters.page + 1)))}>
              Load {Math.min(remaining, PAGE_SIZE)} more
            </Button>
          </div>
        )}
      </div>

      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} side="left" label="Filters" title="Filters">
        <div className="flex-1 overflow-y-auto p-5">{panel}</div>
        <div className="flex gap-2 border-t border-line p-4">
          {chips.length > 0 && (
            <Button variant="secondary" onClick={clearAll}>
              Clear
            </Button>
          )}
          <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
            Show {results.length} {results.length === 1 ? "product" : "products"}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
