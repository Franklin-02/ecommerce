import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { discountPercent } from "@/lib/pricing";
import type { Product } from "@/types/catalog";

/** The list-view counterpart to ProductCard, with room for the summary and highlights. */
export function ProductListRow({ product }: { product: Product }) {
  const discount = discountPercent(product);
  const soldOut = product.stock === 0;

  return (
    <article className="group relative flex gap-4 rounded-card border border-line bg-surface p-3 transition-[box-shadow,border-color] hover:border-line-strong hover:shadow-card sm:p-4">
      <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-44">
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes="(min-width: 640px) 176px, 112px"
          className={`object-contain p-[8%] transition-transform duration-500 group-hover:scale-105 ${soldOut ? "opacity-50 grayscale" : ""}`}
        />
        <div className="absolute top-2 left-2">
          {soldOut ? <Badge>Sold out</Badge> : discount > 0 && <Badge tone="deal">-{discount}%</Badge>}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="eyebrow text-ink-500">{product.brandName}</p>
        <h3 className="mt-1 pr-10 text-base leading-5 font-medium text-ink-950">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:rounded-card">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <p className="mt-2 hidden max-w-2xl text-sm leading-5 text-ink-600 sm:block">{product.summary}</p>
        <ul className="mt-2 hidden flex-wrap gap-x-4 gap-y-1 md:flex">
          {product.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-1 text-[0.8125rem] text-ink-600">
              <Check className="size-3.5 text-success" aria-hidden />
              {highlight}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          <AddToCartButton product={product} />
        </div>
      </div>
      <WishlistButton product={product} className="absolute top-3 right-3 border border-line" />
    </article>
  );
}
