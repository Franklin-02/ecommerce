import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Product } from "@/types/catalog";
import { DealCountdown } from "./deal-countdown";

export function SpecialOffers({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="offers-title" className="mt-14 lg:mt-16">
      <Container>
        <div className="grid gap-8 rounded-panel bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 p-5 sm:p-8 xl:grid-cols-[17rem_minmax(0,1fr)] xl:items-center">
          <div>
            <p className="eyebrow text-brand-300">Deepavali offers</p>
            <h2 id="offers-title" className="mt-2 text-3xl leading-tight font-semibold tracking-tight text-balance text-white sm:text-4xl">
              Today only, while stock lasts
            </h2>
            <p className="mt-3 mb-5 max-w-sm text-sm leading-6 text-white/70">
              Our deepest discounts of the day. Prices reset at midnight.
            </p>
            <DealCountdown />
            <ButtonLink href="/deals" variant="inverse" className="mt-6">
              See all offers
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
