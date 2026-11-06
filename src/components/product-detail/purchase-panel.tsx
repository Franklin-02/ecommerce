"use client";

import { Bell, ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { addToCart, openCartDrawer } from "@/stores/cart";
import { showToast } from "@/stores/toast";
import type { Product } from "@/types/catalog";

export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  if (product.stock === 0) {
    return (
      <div className="flex items-center gap-3">
        <Button size="lg" className="flex-1" onClick={() => showToast("We'll email you when it's back")}>
          <Bell className="size-4" aria-hidden />
          Notify me when available
        </Button>
        <WishlistButton product={product} className="size-12 border border-line-strong" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-800">Quantity</span>
        <QuantitySelector value={quantity} max={product.stock} label={product.name} onChange={setQuantity} />
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button
          size="lg"
          className="min-w-40 flex-1"
          onClick={() => {
            addToCart(product, quantity);
            showToast(`${product.name} added`, { label: "View cart", onClick: openCartDrawer });
          }}
        >
          <ShoppingBag className="size-4" aria-hidden />
          Add to cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="min-w-32 flex-1"
          onClick={() => {
            addToCart(product, quantity);
            router.push("/checkout");
          }}
        >
          <Zap className="size-4" aria-hidden />
          Buy now
        </Button>
        <WishlistButton product={product} className="size-12 shrink-0 border border-line-strong" />
      </div>
    </div>
  );
}
