import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingPage } from "@/components/catalog/listing-page";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/services/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryBySlug((await params).slug);
  if (!category) notFound();

  return (
    <ListingPage
      crumbs={[{ label: "All categories", href: "/categories" }, { label: category.name }]}
      title={category.name}
      description={category.description}
      banner={{ image: category.image, tint: category.tint }}
      products={await getProductsByCategory(category.id)}
    />
  );
}
