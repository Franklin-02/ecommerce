"use client";

import { Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { openCartDrawer, useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-brand-600 px-1 text-[0.625rem] font-bold text-white ring-2 ring-surface">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function HeaderActions() {
  const { itemCount } = useCart();
  const wishlistCount = useWishlist().length;
  const action = "relative grid size-10 place-items-center rounded-full text-ink-900 transition-colors hover:bg-surface-sunken";

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <Link href="/account" aria-label="Account" className={`${action} hidden sm:grid`}>
        <User className="size-[1.35rem]" aria-hidden />
      </Link>
      <Link href="/account/wishlist" aria-label={`Wishlist, ${wishlistCount} items`} className={action}>
        <Heart className="size-[1.35rem]" aria-hidden />
        <CountBadge count={wishlistCount} />
      </Link>
      <button type="button" onClick={openCartDrawer} aria-label={`Cart, ${itemCount} items`} className={action}>
        <ShoppingBag className="size-[1.35rem]" aria-hidden />
        <CountBadge count={itemCount} />
      </button>
    </div>
  );
}
