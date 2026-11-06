import { createPersistedStore, useStore } from "@/lib/store";

const wishlistStore = createPersistedStore<string[]>("ohmly.wishlist.v1", []);

/** Returns true when the product is now on the wishlist. */
export function toggleWishlist(productId: string) {
  const wasSaved = wishlistStore.get().includes(productId);
  wishlistStore.set((ids) =>
    wasSaved ? ids.filter((id) => id !== productId) : [...ids, productId],
  );
  return !wasSaved;
}

export const useWishlist = () => useStore(wishlistStore);
