import type { Metadata } from "next";
import { CategoryPills } from "@/components/catalog/category-pills";
import { ListingPage } from "@/components/catalog/listing-page";
import { getCatalogProducts, getCategories } from "@/services/catalog";

export const metadata: Metadata = { title: "All categories" };

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getCatalogProducts()]);
  return (
    <ListingPage
      crumbs={[{ label: "All categories" }]}
      title="All categories"
      description="Everything we carry, from flagship phones to the cables that keep them running."
      products={products}
      acrossCategories
    >
      <CategoryPills categories={categories} label="Categories" />
    </ListingPage>
  );
}
