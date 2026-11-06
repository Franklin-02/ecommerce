import type { Metadata } from "next";
import { ListingPage } from "@/components/catalog/listing-page";
import { getTrendingProducts } from "@/services/catalog";

export const metadata: Metadata = { title: "Trending now" };

const TRENDING_LIMIT = 24;

export default async function TrendingPage() {
  return (
    <ListingPage
      crumbs={[{ label: "Trending now" }]}
      title="Trending now"
      description="What's moving fastest across the store right now."
      products={await getTrendingProducts(TRENDING_LIMIT)}
      acrossCategories
    />
  );
}
