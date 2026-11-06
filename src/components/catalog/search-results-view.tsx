"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { searchCatalog, type SearchResults } from "@/services/catalog";
import { CategoryPills } from "./category-pills";
import { ListingFrame, ListingLoading } from "./listing-page";

const SEARCH_LIMIT = 100;

/** Reads ?q= in the browser, because a static export has no request to read it from. */
export function SearchResultsView({ categoryNames }: { categoryNames: Record<string, string> }) {
  const query = useSearchParams().get("q")?.trim() ?? "";
  const [found, setFound] = useState<{ query: string; results: SearchResults } | null>(null);

  useEffect(() => {
    let stale = false;
    searchCatalog(query, SEARCH_LIMIT).then((results) => {
      if (!stale) setFound({ query, results });
    });
    return () => {
      stale = true;
    };
  }, [query]);

  if (found?.query !== query) return <ListingLoading />;
  const { results } = found;

  return (
    <ListingFrame
      crumbs={[{ label: "Search" }]}
      title={query ? `Results for “${query}”` : "Search the store"}
      description={query ? "Refine by brand, price or rating." : "Type in the search bar above to find products."}
      products={results.products}
      categoryNames={categoryNames}
      emptyTitle={query ? `No matches for “${query}”` : "What are you looking for?"}
      emptyBody={query ? "Check the spelling, or try a brand or product type." : "Search by product, brand or category."}
      emptyAction={<ButtonLink href="/categories">Browse all categories</ButtonLink>}
    >
      {results.categories.length > 0 && <CategoryPills categories={results.categories} label="Matching categories" />}
    </ListingFrame>
  );
}
