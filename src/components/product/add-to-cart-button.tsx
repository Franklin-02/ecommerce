"use client";

import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/cn";
import { addToCart, openCartDrawer } from "@/stores/cart";
import { showToast } from "@/stores/toast";
import type { Product } from "@/types/catalog";

export function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const soldOut = product.stock === 0;
  return (
    <button
      type="button"
      disabled={soldOut}
      aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
      onClick={() => {
        addToCart(product);
        showToast(`${product.name} added`, { label: "View cart", onClick: openCartDrawer });
      }}
      className={cn(
        "relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors hover:bg-brand-600 hover:text-white disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-400",
        className,
      )}
    >
      <ShoppingBag className="size-[1.1rem]" aria-hidden />
    </button>
  );
}
