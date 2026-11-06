import type { Metadata } from "next";
import { ListingPage } from "@/components/catalog/listing-page";
import { getDiscountedProducts } from "@/services/catalog";

export const metadata: Metadata = { title: "Today's offers" };

export default async function DealsPage() {
  return (
    <ListingPage
      crumbs={[{ label: "Today's offers" }]}
      title="Today's offers"
      description="Every discounted product in the store, with the biggest savings first."
      products={await getDiscountedProducts()}
      acrossCategories
    />
  );
}
