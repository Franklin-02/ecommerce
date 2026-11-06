"use client";

import { Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCatalogProducts } from "@/services/catalog";
import { showToast } from "@/stores/toast";
import { toggleWishlist, useWishlist } from "@/stores/wishlist";
import type { Product } from "@/types/catalog";

const grid = "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4";

function WishlistSkeleton() {
  return (
    <div className={`${grid} animate-pulse`} aria-busy="true" aria-label="Loading your wishlist">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index}>
          <div className="aspect-square rounded-card bg-surface-sunken" />
          <div className="mt-3 h-4 w-3/4 rounded bg-surface-sunken" />
          <div className="mt-2 h-4 w-1/2 rounded bg-surface-sunken" />
        </div>
      ))}
    </div>
  );
}

export function WishlistView() {
  const ids = useWishlist();
  const [catalog, setCatalog] = useState<Product[] | null>(null);

  useEffect(() => {
    let current = true;
    getCatalogProducts().then((products) => {
      if (current) setCatalog(products);
    });
    return () => {
      current = false;
    };
  }, []);

  const saved = catalog?.filter((product) => ids.includes(product.id)) ?? [];

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Wishlist</h1>
      <p className="mt-1 mb-5 text-sm text-ink-500">
        {ids.length === 1 ? "1 saved item" : `${ids.length} saved items`}
      </p>

      {!catalog ? (
        <WishlistSkeleton />
      ) : saved.length === 0 ? (
        <div className="rounded-card border border-line">
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            body="Tap the heart on any product to keep it here for later."
            action={<ButtonLink href="/categories">Browse categories</ButtonLink>}
          />
        </div>
      ) : (
        <ul className={grid}>
          {saved.map((product) => (
            <li key={product.id} className="flex flex-col gap-1.5">
              <div className="flex-1">
                <ProductCard product={product} />
              </div>
              <button
                type="button"
                aria-label={`Remove ${product.name} from wishlist`}
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast("Removed from wishlist");
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[0.8125rem] font-medium text-ink-500 hover:bg-deal-soft hover:text-deal"
              >
                <Trash2 className="size-3.5" aria-hidden /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
