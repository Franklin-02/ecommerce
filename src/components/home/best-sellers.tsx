import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { SectionHeader } from "@/components/ui/section-header";
import type { Product } from "@/types/catalog";

export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="bestsellers-title" className="mt-14 lg:mt-16">
      <Container>
        <SectionHeader id="bestsellers-title" eyebrow="Most bought this month" title="Best sellers" href="/best-sellers" />
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <li key={product.id} className="group relative flex items-center gap-3 rounded-card border border-line p-3 transition-[box-shadow,border-color] hover:border-line-strong hover:shadow-card">
              <span className="w-9 shrink-0 text-center font-mono text-2xl font-medium text-ink-400 group-hover:text-brand-600" aria-hidden>
                {index + 1}
              </span>
              <span className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                <Image src={product.images[0]} alt="" fill sizes="96px" className="object-contain p-2" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[0.9375rem] font-medium text-ink-950">
                  <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:rounded-card">
                    {product.name}
                  </Link>
                </h3>
                <div className="mt-0.5">
                  <Rating value={product.rating} count={product.reviewCount} />
                </div>
                <div className="mt-1">
                  <Price price={product.price} compareAtPrice={product.compareAtPrice} />
                </div>
              </div>
              <AddToCartButton product={product} />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
