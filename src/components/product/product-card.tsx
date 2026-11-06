import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { discountPercent } from "@/lib/pricing";
import type { Product } from "@/types/catalog";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";

const LOW_STOCK = 10;

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);
  const soldOut = product.stock === 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK;

  return (
    <article className="group relative flex h-full flex-col rounded-card border border-line bg-surface transition-[box-shadow,border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden rounded-t-[calc(var(--radius-card)-1px)] bg-surface-muted">
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 60vw"
          className={`object-contain p-[9%] transition-transform duration-500 group-hover:scale-105 ${soldOut ? "opacity-50 grayscale" : ""}`}
        />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
          {soldOut && <Badge tone="neutral">Sold out</Badge>}
          {!soldOut && discount > 0 && <Badge tone="deal">-{discount}%</Badge>}
          {!soldOut && product.tags.includes("new") && <Badge tone="new">New</Badge>}
        </div>
      </div>
      <WishlistButton product={product} className="absolute top-3 right-3" />

      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow text-ink-500">{product.brandName}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-[0.9375rem] leading-5 font-medium text-ink-950">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:rounded-card">
            {product.name}
          </Link>
        </h3>
        <div className="mt-2">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <Price price={product.price} compareAtPrice={product.compareAtPrice} />
            {lowStock && <p className="mt-0.5 text-xs font-medium text-warning">Only {product.stock} left</p>}
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
