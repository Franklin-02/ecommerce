"use client";

import { ArrowRight, Loader2, Search, SearchX, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/pricing";
import { searchCatalog, type SearchResults } from "@/services/catalog";

const POPULAR = ["WiFi 7", "Noise cancelling", "65W charger", "Smartwatch"];
const DEBOUNCE_MS = 140;

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [response, setResponse] = useState<{ query: string; results: SearchResults } | null>(null);

  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;
    let current = true;
    const timer = setTimeout(async () => {
      const results = await searchCatalog(trimmed);
      if (current) setResponse({ query: trimmed, results });
    }, DEBOUNCE_MS);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [trimmed]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  const results = response?.query === trimmed ? response.results : null;
  const loading = Boolean(trimmed) && !results;

  const options = [
    ...(results?.categories ?? []).map((category) => ({
      key: category.id,
      href: `/category/${category.slug}`,
    })),
    ...(results?.products ?? []).map((product) => ({
      key: product.id,
      href: `/product/${product.slug}`,
    })),
  ];

  const go = (href: string) => {
    setOpen(false);
    setActive(-1);
    router.push(href);
  };

  const submit = () => {
    if (trimmed) go(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (options.length === 0) return;
      // Cycles through the options plus one "nothing selected" slot at -1.
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const slots = options.length + 1;
      setActive((index) => ((index + 1 + delta + slots) % slots) - 1);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options[active];
      if (option) go(option.href);
      else submit();
    }
  };

  const optionClass = (index: number) =>
    cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left", index === active ? "bg-surface-sunken" : "hover:bg-surface-muted");

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Search className="pointer-events-none absolute top-1/2 left-4 size-[1.1rem] -translate-y-1/2 text-ink-500" aria-hidden />
        <input
          type="text"
          role="combobox"
          aria-label="Search products"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 && options[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Search phones, chargers, smart home…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-11 w-full rounded-full border border-transparent bg-surface-muted pr-11 pl-11 text-sm text-ink-950 transition-colors placeholder:text-ink-500 hover:border-line focus:border-brand-500 focus:bg-surface focus:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setActive(-1);
            }}
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-500 hover:bg-surface-sunken"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </form>

      <div
        id={listId}
        role={options.length > 0 ? "listbox" : undefined}
        aria-label="Search suggestions"
        hidden={!open}
        className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-overlay"
      >
        {!trimmed && (
          <div className="p-2">
            <p className="eyebrow mb-2 text-ink-500">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full bg-surface-muted px-3 py-1.5 text-sm text-ink-800 hover:bg-brand-50 hover:text-brand-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <p className="flex items-center gap-2 p-3 text-sm text-ink-500" role="status">
            <Loader2 className="size-4 animate-spin" aria-hidden /> Searching…
          </p>
        )}

        {results && options.length === 0 && (
          <p className="flex items-center gap-2 p-3 text-sm text-ink-600" role="status">
            <SearchX className="size-4" aria-hidden /> No matches for “{trimmed}”. Try a brand or product type.
          </p>
        )}

        {results?.categories.map((category, index) => (
          <button
            key={category.id}
            id={`${listId}-${index}`}
            type="button"
            role="option"
            aria-selected={index === active}
            onClick={() => go(`/category/${category.slug}`)}
            className={optionClass(index)}
          >
            <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <CategoryIcon name={category.icon} className="size-5" />
            </span>
            <span className="text-sm font-medium text-ink-950">{category.name}</span>
            <span className="eyebrow ml-auto text-ink-500">Category</span>
          </button>
        ))}

        {results?.products.map((product, productIndex) => {
          const index = results.categories.length + productIndex;
          return (
            <button
              key={product.id}
              id={`${listId}-${index}`}
              type="button"
              role="option"
              aria-selected={index === active}
              onClick={() => go(`/product/${product.slug}`)}
              className={optionClass(index)}
            >
              <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={product.images[0]} alt="" fill sizes="40px" className="object-contain p-1" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-950">{product.name}</span>
              <span className="text-sm font-semibold text-ink-800">{formatPrice(product.price)}</span>
            </button>
          );
        })}

        {options.length > 0 && (
          <button
            type="button"
            onClick={submit}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-surface-muted px-3 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50"
          >
            See all results for “{trimmed}” <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
