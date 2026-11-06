import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/catalog";

/** Compact category tiles for pages that lead into the catalog. */
export function CategoryPills({ categories, label }: { categories: Category[]; label: string }) {
  return (
    <ul aria-label={label} className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/category/${category.slug}`}
            className="group flex h-full items-center gap-3 rounded-2xl p-2.5 transition-shadow hover:shadow-card"
            style={{ background: `var(--color-tint-${category.tint})` }}
          >
            <span className="relative size-12 shrink-0">
              <Image src={category.image} alt="" fill sizes="48px" className="object-contain transition-transform duration-300 group-hover:scale-110" />
            </span>
            <span className="text-sm leading-4 font-medium text-ink-950">{category.shortName}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
