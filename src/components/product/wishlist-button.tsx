"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { showToast } from "@/stores/toast";
import { toggleWishlist, useWishlist } from "@/stores/wishlist";
import type { Product } from "@/types/catalog";

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const saved = useWishlist().includes(product.id);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`Save ${product.name} to wishlist`}
      onClick={() => {
        const nowSaved = toggleWishlist(product.id);
        showToast(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
      }}
      className={cn(
        "z-10 grid size-9 place-items-center rounded-full bg-white/90 text-ink-600 shadow-sm backdrop-blur transition-colors hover:text-deal",
        saved && "text-deal",
        className,
      )}
    >
      <Heart className={cn("size-[1.05rem]", saved && "fill-current")} aria-hidden />
    </button>
  );
}
