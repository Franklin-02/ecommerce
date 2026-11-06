import type { Metadata } from "next";
import { ListingPage } from "@/components/catalog/listing-page";
import { getBestSellers } from "@/services/catalog";

export const metadata: Metadata = { title: "Best sellers" };

const BEST_SELLERS_LIMIT = 24;

export default async function BestSellersPage() {
  return (
    <ListingPage
      crumbs={[{ label: "Best sellers" }]}
      title="Best sellers"
      description="The products customers are spending the most on this month."
      products={await getBestSellers(BEST_SELLERS_LIMIT)}
      acrossCategories
    />
  );
}
