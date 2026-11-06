import type { Metadata } from "next";
import { ListingPage } from "@/components/catalog/listing-page";
import { getLatestArrivals } from "@/services/catalog";

export const metadata: Metadata = { title: "New arrivals" };

const NEW_ARRIVALS_LIMIT = 20;

export default async function NewArrivalsPage() {
  return (
    <ListingPage
      crumbs={[{ label: "New arrivals" }]}
      title="New arrivals"
      description="The latest additions to the catalog, newest first."
      products={await getLatestArrivals(NEW_ARRIVALS_LIMIT)}
      acrossCategories
    />
  );
}
