"use client";

import { Star } from "lucide-react";
import { useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/pricing";
import { ratingOptions, type ListingFilters } from "@/lib/product-filters";

export interface Facet {
  value: string;
  label: string;
  count: number;
}

export interface FilterPatch {
  brand?: string[];
  category?: string[];
  min?: number;
  max?: number;
  rating?: number;
  stock?: boolean;
  sale?: boolean;
}

interface FilterPanelProps {
  filters: ListingFilters;
  brands: Facet[];
  categories: Facet[];
  priceBounds: { min: number; max: number };
  onChange: (patch: FilterPatch) => void;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-4 first:pt-0 last:border-0">
      <legend className="float-left mb-2.5 w-full text-sm font-semibold text-ink-950">{title}</legend>
      <div className="clear-both space-y-1.5">{children}</div>
    </fieldset>
  );
}

function Option({
  type = "checkbox",
  name,
  checked,
  onChange,
  count,
  children,
}: {
  type?: "checkbox" | "radio";
  name?: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md py-0.5 text-sm text-ink-800 hover:text-ink-950">
      <input type={type} name={name} checked={checked} onChange={onChange} className="size-4 shrink-0 accent-brand-600" />
      <span className="flex min-w-0 flex-1 items-center gap-1">{children}</span>
      {count !== undefined && <span className="text-xs text-ink-500 tabular-nums">{count}</span>}
    </label>
  );
}

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

function PriceInputs({
  filters,
  bounds,
  onChange,
}: {
  filters: ListingFilters;
  bounds: FilterPanelProps["priceBounds"];
  onChange: (patch: FilterPatch) => void;
}) {
  const [min, setMin] = useState(filters.min?.toString() ?? "");
  const [max, setMax] = useState(filters.max?.toString() ?? "");
  const toNumber = (value: string) => (value === "" ? undefined : Number(value));
  const commit = () => onChange({ min: toNumber(min), max: toNumber(max) });
  const input =
    "h-10 w-full min-w-0 rounded-xl border border-line-strong bg-surface pr-2 pl-6 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        commit();
      }}
      className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2"
    >
      <div className="relative">
        <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-ink-500" aria-hidden>₹</span>
        <input type="number" min={0} inputMode="numeric" aria-label="Minimum price" placeholder={String(bounds.min)} value={min} onChange={(event) => setMin(event.target.value)} onBlur={commit} className={input} />
      </div>
      <span className="text-sm text-ink-500" aria-hidden>to</span>
      <div className="relative">
        <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-ink-500" aria-hidden>₹</span>
        <input type="number" min={0} inputMode="numeric" aria-label="Maximum price" placeholder={String(bounds.max)} value={max} onChange={(event) => setMax(event.target.value)} onBlur={commit} className={input} />
      </div>
      <button type="submit" className="sr-only">Apply price</button>
      <p className="col-span-full text-xs text-ink-500">
        {formatPrice(bounds.min)} to {formatPrice(bounds.max)} in this range
      </p>
    </form>
  );
}

export function FilterPanel({ filters, brands, categories, priceBounds, onChange }: FilterPanelProps) {
  return (
    <div>
      {categories.length > 1 && (
        <Group title="Category">
          {categories.map((category) => (
            <Option key={category.value} checked={filters.categories.includes(category.value)} count={category.count} onChange={() => onChange({ category: toggle(filters.categories, category.value) })}>
              {category.label}
            </Option>
          ))}
        </Group>
      )}

      {brands.length > 1 && (
        <Group title="Brand">
          {brands.map((brand) => (
            <Option key={brand.value} checked={filters.brands.includes(brand.value)} count={brand.count} onChange={() => onChange({ brand: toggle(filters.brands, brand.value) })}>
              {brand.label}
            </Option>
          ))}
        </Group>
      )}

      <Group title="Price">
        {/* Re-mounts when filters are cleared elsewhere, so the inputs never go stale. */}
        <PriceInputs key={`${filters.min ?? ""}-${filters.max ?? ""}`} filters={filters} bounds={priceBounds} onChange={onChange} />
      </Group>

      <Group title="Customer rating">
        <Option type="radio" name="rating" checked={filters.rating === undefined} onChange={() => onChange({ rating: undefined })}>
          Any rating
        </Option>
        {ratingOptions.map((rating) => (
          <Option key={rating} type="radio" name="rating" checked={filters.rating === rating} onChange={() => onChange({ rating })}>
            <Star className="size-3.5 fill-star text-star" aria-hidden />
            {rating.toFixed(1)} and up
          </Option>
        ))}
      </Group>

      <Group title="Availability">
        <Option checked={filters.inStock} onChange={() => onChange({ stock: !filters.inStock })}>
          In stock only
        </Option>
        <Option checked={filters.onSale} onChange={() => onChange({ sale: !filters.onSale })}>
          On sale
        </Option>
      </Group>
    </div>
  );
}
