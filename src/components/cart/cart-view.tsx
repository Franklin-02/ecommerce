"use client";

import { ArrowLeft, ArrowRight, ShoppingBag, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceSummary } from "@/components/checkout/price-summary";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { siteConfig } from "@/config/site";
import { computeTotals } from "@/lib/checkout";
import { formatPrice } from "@/lib/pricing";
import { useHydrated } from "@/lib/store";
import { removeFromCart, setCartQuantity, useCart } from "@/stores/cart";
import { useAppliedCoupon } from "@/stores/coupon";
import { CouponInput } from "./coupon-input";

function CartSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]" aria-busy="true" aria-label="Loading your cart">
      <div className="space-y-3">
        <div className="h-32 rounded-card bg-surface-sunken" />
        <div className="h-32 rounded-card bg-surface-sunken" />
      </div>
      <div className="h-80 rounded-card bg-surface-sunken" />
    </div>
  );
}

export function CartView() {
  const hydrated = useHydrated();
  const { lines } = useCart();
  const coupon = useAppliedCoupon();

  if (!hydrated) return <CartSkeleton />;

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        body="Add something you love and it will be waiting here, even if you come back later."
        action={<ButtonLink href="/categories">Start shopping</ButtonLink>}
      />
    );
  }

  const totals = computeTotals(lines, "standard", coupon);
  const toFreeDelivery = siteConfig.freeDeliveryThreshold - totals.subtotal;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0">
        <ul className="divide-y divide-line rounded-card border border-line">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
              <Link href={`/product/${line.slug}`} tabIndex={-1} aria-hidden className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-28">
                <Image src={line.image} alt="" fill sizes="112px" className="object-contain p-2" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="eyebrow text-ink-500">{line.brandName}</p>
                    <Link href={`/product/${line.slug}`} className="mt-0.5 line-clamp-2 text-[0.9375rem] leading-5 font-medium text-ink-950 hover:text-brand-600">
                      {line.name}
                    </Link>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-ink-950 tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</p>
                    {line.quantity > 1 && <p className="text-xs text-ink-500">{formatPrice(line.unitPrice)} each</p>}
                    {line.compareAtPrice && line.quantity === 1 && (
                      <s className="text-xs text-ink-500">{formatPrice(line.compareAtPrice)}</s>
                    )}
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
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
                    className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] font-medium text-ink-500 hover:bg-deal-soft hover:text-deal"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/categories" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 hover:text-brand-600">
          <ArrowLeft className="size-4" aria-hidden />
          Continue shopping
        </Link>
      </div>

      <aside aria-label="Order summary" className="rounded-card border border-line p-5 lg:sticky lg:top-36">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink-950">Order summary</h2>
        <CouponInput applied={coupon} issue={totals.couponIssue} />
        <div className="mt-3">
          <PriceSummary totals={totals} couponCode={coupon?.code} deliveryLabel="Standard delivery" />
        </div>
        <p className="mt-3 flex items-start gap-2 text-[0.8125rem] leading-5 text-ink-600">
          <Truck className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
          {toFreeDelivery > 0
            ? `Estimated delivery in 3–5 business days. Add ${formatPrice(toFreeDelivery)} more for free delivery.`
            : "Estimated delivery in 3–5 business days, or tomorrow within Tamil Nadu with free next-day at checkout."}
        </p>
        <ButtonLink href="/checkout" size="lg" className="mt-4 w-full">
          Proceed to checkout
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </aside>
    </div>
  );
}
