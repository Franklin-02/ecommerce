"use client";

import { useEffect, useState } from "react";
import { getRecommendations } from "@/services/catalog";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import type { Product } from "@/types/catalog";
import { ProductSection } from "./product-section";

/** Shows top-rated picks, then personalizes once the cart or wishlist has content. */
export function RecommendedProducts({ initial }: { initial: Product[] }) {
  const { lines } = useCart();
  const wishlist = useWishlist();
  const [personal, setPersonal] = useState<{ key: string; products: Product[] } | null>(null);

  const key = [...lines.map((line) => line.productId), ...wishlist].sort().join(",");

  useEffect(() => {
    if (!key) return;
    let current = true;
    getRecommendations(key.split(","), initial.length).then((products) => {
      if (current) setPersonal({ key, products });
    });
    return () => {
      current = false;
    };
  }, [key, initial.length]);

  const isPersonal = Boolean(key) && personal?.key === key;

  return (
    <ProductSection
      id="recommended-title"
      eyebrow={isPersonal ? "Based on your cart and wishlist" : "Top rated by customers"}
      title="Recommended for you"
      href="/categories"
      products={isPersonal ? personal.products : initial}
    />
  );
}
