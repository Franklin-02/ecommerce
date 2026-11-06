import { createPersistedStore, createStore, useStore } from "@/lib/store";
import type { CartLine, Product } from "@/types/catalog";

const cartStore = createPersistedStore<CartLine[]>("ohmly.cart.v2", []);
const cartDrawerStore = createStore(false);

export function addToCart(product: Product, quantity = 1) {
  cartStore.set((lines) => {
    const existing = lines.find((line) => line.productId === product.id);
    if (existing) {
      return lines.map((line) =>
        line === existing
          ? { ...line, quantity: Math.min(line.quantity + quantity, line.maxQuantity) }
          : line,
      );
    }
    return [
      ...lines,
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brandName: product.brandName,
        image: product.images[0],
        unitPrice: product.price,
        compareAtPrice: product.compareAtPrice,
        maxQuantity: product.stock,
        quantity: Math.min(quantity, product.stock),
      },
    ];
  });
}

export function setCartQuantity(productId: string, quantity: number) {
  cartStore.set((lines) =>
    lines.map((line) =>
      line.productId === productId
        ? { ...line, quantity: Math.max(1, Math.min(quantity, line.maxQuantity)) }
        : line,
    ),
  );
}

export function removeFromCart(productId: string) {
  cartStore.set((lines) => lines.filter((line) => line.productId !== productId));
}

export const clearCart = () => cartStore.set([]);

export function useCart() {
  const lines = useStore(cartStore);
  return {
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    savings: lines.reduce(
      (sum, line) =>
        sum + (line.compareAtPrice ? (line.compareAtPrice - line.unitPrice) * line.quantity : 0),
      0,
    ),
  };
}

export const openCartDrawer = () => cartDrawerStore.set(true);
export const closeCartDrawer = () => cartDrawerStore.set(false);
export const useCartDrawerOpen = () => useStore(cartDrawerStore);
