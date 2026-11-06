"use client";

import { ShoppingBag, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/pricing";
import {
  closeCartDrawer,
  removeFromCart,
  setCartQuantity,
  useCart,
  useCartDrawerOpen,
} from "@/stores/cart";

export function CartDrawer() {
  const open = useCartDrawerOpen();
  const { lines, itemCount, subtotal, savings } = useCart();
  const toFreeDelivery = Math.max(0, siteConfig.freeDeliveryThreshold - subtotal);
  const progress = Math.min(100, (subtotal / siteConfig.freeDeliveryThreshold) * 100);

  return (
    <Drawer open={open} onClose={closeCartDrawer} label="Shopping cart" title={`Your cart (${itemCount})`}>
      {lines.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          body="Add something you love and it will be waiting here, even if you come back later."
          action={<Button onClick={closeCartDrawer}>Keep shopping</Button>}
        />
      ) : (
        <>
          <div className="border-b border-line bg-surface-muted px-5 py-3">
            <p className="flex items-center gap-2 text-[0.8125rem] font-medium text-ink-800">
              <Truck className="size-4 text-brand-600" aria-hidden />
              {toFreeDelivery > 0
                ? `Add ${formatPrice(toFreeDelivery)} more for free delivery`
                : "You've unlocked free delivery"}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
              <div className="h-full rounded-full bg-brand-600 transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {lines.map((line) => (
              <li key={line.productId} className="flex gap-3 py-4">
                <Link
                  href={`/product/${line.slug}`}
                  onClick={closeCartDrawer}
                  tabIndex={-1}
                  aria-hidden
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted"
                >
                  <Image src={line.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${line.slug}`} onClick={closeCartDrawer} className="line-clamp-2 text-sm leading-5 font-medium text-ink-950 hover:text-brand-600">
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-sm font-semibold text-ink-950">{formatPrice(line.unitPrice * line.quantity)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <QuantitySelector
                      value={line.quantity}
                      max={line.maxQuantity}
                      label={line.name}
                      onChange={(quantity) => setCartQuantity(line.productId, quantity)}
                    />
                    <button
                      type="button"
                      aria-label={`Remove ${line.name}`}
                      onClick={() => removeFromCart(line.productId)}
                      className="grid size-9 place-items-center rounded-full text-ink-500 hover:bg-deal-soft hover:text-deal"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <footer className="border-t border-line p-5">
            {savings > 0 && (
              <p className="mb-1 flex justify-between text-sm text-success">
                <span>You&apos;re saving</span>
                <span className="font-semibold">{formatPrice(savings)}</span>
              </p>
            )}
            <p className="flex justify-between text-base font-semibold text-ink-950">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </p>
            <ButtonLink href="/checkout" size="lg" onClick={closeCartDrawer} className="mt-4 w-full">
              Checkout
            </ButtonLink>
            <ButtonLink href="/cart" variant="ghost" onClick={closeCartDrawer} className="mt-1 w-full">
              View full cart
            </ButtonLink>
          </footer>
        </>
      )}
    </Drawer>
  );
}
