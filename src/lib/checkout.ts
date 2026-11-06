import { siteConfig } from "@/config/site";
import { deliveryMethods } from "@/lib/status";
import { formatPrice } from "@/lib/pricing";
import { gstIncludedIn } from "@/lib/tax";
import type { CartLine } from "@/types/catalog";
import type { Address, Coupon, DeliveryMethod, Order, PaymentMethod } from "@/types/commerce";

const round = (value: number) => Math.round(value * 100) / 100;

export interface CheckoutTotals {
  itemCount: number;
  subtotal: number;
  /** Saved through sale prices, before any coupon. */
  productSavings: number;
  couponDiscount: number;
  shipping: number;
  /** GST included in the total. Prices already contain it, so it is never added on top. */
  tax: number;
  total: number;
  /** Why an applied coupon isn't taking effect right now. */
  couponIssue?: string;
}

/** Delivery cost before coupons. Orders over the threshold ship free, including next-day. */
export function deliveryPrice(method: DeliveryMethod, subtotal: number) {
  return subtotal >= siteConfig.freeDeliveryThreshold ? 0 : deliveryMethods[method].price;
}

interface OrderDraft {
  customerId: string;
  customerName: string;
  customerEmail: string;
  lines: CartLine[];
  totals: CheckoutTotals;
  delivery: DeliveryMethod;
  payment: PaymentMethod;
  couponCode?: string;
  shippingAddress: Omit<Address, "id" | "isDefault">;
}

/** Turns a completed checkout into an order. A real backend would do this server-side. */
export function buildOrder({ lines, totals, delivery, payment, shippingAddress, ...customer }: OrderDraft): Order {
  const stamp = Date.now();
  const placedAt = new Date(stamp).toISOString();
  return {
    ...customer,
    id: `ord_web_${stamp.toString(36)}`,
    number: `KCM-${String(stamp).slice(-6)}`,
    placedAt,
    status: "pending",
    paymentMethod: payment,
    paymentStatus: payment === "cod" ? "pending" : "paid",
    deliveryMethod: delivery,
    lines: lines.map(({ productId, slug, name, image, unitPrice, quantity }) => ({
      productId,
      slug,
      name,
      image,
      unitPrice,
      quantity,
    })),
    subtotal: totals.subtotal,
    discount: totals.couponDiscount,
    shipping: totals.shipping,
    tax: totals.tax,
    total: totals.total,
    shippingAddress: { ...shippingAddress, id: `adr_${stamp.toString(36)}`, isDefault: false },
    timeline: [{ status: "pending", at: placedAt, note: "Order placed" }],
  };
}

export function computeTotals(
  lines: CartLine[],
  delivery: DeliveryMethod,
  coupon: Coupon | null,
): CheckoutTotals {
  const subtotal = round(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
  const productSavings = round(
    lines.reduce(
      (sum, line) => sum + (line.compareAtPrice ? (line.compareAtPrice - line.unitPrice) * line.quantity : 0),
      0,
    ),
  );

  const qualifies = coupon !== null && subtotal >= coupon.minSpend;
  const couponIssue =
    coupon && !qualifies
      ? `${coupon.code} needs a ${formatPrice(coupon.minSpend)} minimum spend. Add ${formatPrice(coupon.minSpend - subtotal)} more to use it.`
      : undefined;

  let couponDiscount = 0;
  if (qualifies && coupon.type === "percent") couponDiscount = round((subtotal * coupon.value) / 100);
  if (qualifies && coupon.type === "fixed") couponDiscount = Math.min(coupon.value, subtotal);

  const shipping = qualifies && coupon.type === "shipping" ? 0 : deliveryPrice(delivery, subtotal);
  const total = round(subtotal - couponDiscount + shipping);

  return {
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal,
    productSavings,
    couponDiscount,
    shipping,
    tax: gstIncludedIn(total),
    total,
    couponIssue,
  };
}
