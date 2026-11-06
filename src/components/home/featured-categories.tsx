import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import type { Category } from "@/types/catalog";

const tints: Record<Category["tint"], string> = {
  blue: "bg-tint-blue",
  violet: "bg-tint-violet",
  teal: "bg-tint-teal",
  amber: "bg-tint-amber",
  rose: "bg-tint-rose",
  slate: "bg-tint-slate",
};

export function FeaturedCategories({ categories }: { categories: Category[] }) {
  return (
    <section aria-labelledby="categories-title" className="mt-14 lg:mt-16">
      <Container>
        <SectionHeader id="categories-title" eyebrow="Browse the store" title="Shop by category" href="/categories" linkLabel="All categories" />
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/category/${category.slug}`} className="group block">
                <span className={`relative block aspect-square overflow-hidden rounded-card ${tints[category.tint]}`}>
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 15vw, (min-width: 640px) 23vw, 30vw"
                    className="object-contain p-[14%] transition-transform duration-500 group-hover:scale-110"
                  />
                </span>
                <span className="mt-2 block text-center text-sm font-medium text-ink-900 group-hover:text-brand-600">
                  {category.shortName}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
