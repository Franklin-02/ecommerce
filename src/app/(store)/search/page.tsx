import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingLoading } from "@/components/catalog/listing-page";
import { SearchResultsView } from "@/components/catalog/search-results-view";
import { getCategories } from "@/services/catalog";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage() {
  const categories = await getCategories();
  const categoryNames = Object.fromEntries(categories.map((category) => [category.id, category.name]));
  return (
    <Suspense fallback={<ListingLoading />}>
      <SearchResultsView categoryNames={categoryNames} />
    </Suspense>
  );
}
