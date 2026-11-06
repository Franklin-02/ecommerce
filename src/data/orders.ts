import type {
  DeliveryMethod,
  Order,
  OrderEvent,
  OrderStatus,
  PaymentMethod,
} from "@/types/commerce";
import { customers } from "./customers";
import { assignableEmployees } from "./employees";
import { products } from "./products";
import { siteConfig } from "@/config/site";
import { deliveryMethods } from "@/lib/status";
import { gstIncludedIn } from "@/lib/tax";
import { daysAgo, pick, seededRandom } from "./seed";

const ORDER_COUNT = 72;
const FLOW: OrderStatus[] = ["pending", "processing", "packed", "shipped", "delivered"];

const random = seededRandom(9127);
const round = (value: number) => Math.round(value * 100) / 100;

/** Recent orders are still in flight; older ones have usually been delivered. */
function statusForAge(age: number): OrderStatus {
  const roll = random();
  if (age > 7) return roll < 0.08 ? "cancelled" : roll < 0.14 ? "returned" : "delivered";
  if (age > 3) return roll < 0.6 ? "delivered" : roll < 0.9 ? "shipped" : "cancelled";
  if (age > 1) return roll < 0.5 ? "shipped" : roll < 0.8 ? "packed" : "processing";
  return roll < 0.45 ? "pending" : roll < 0.8 ? "processing" : "packed";
}

function buildTimeline(status: OrderStatus, age: number): OrderEvent[] {
  const end = status === "cancelled" ? 1 : status === "returned" ? FLOW.length : FLOW.indexOf(status) + 1;
  const events: OrderEvent[] = FLOW.slice(0, end).map((step, index) => ({
    status: step,
    at: daysAgo(Math.max(age - index, 0), 9 + index * 2),
  }));
  if (status === "cancelled") events.push({ status, at: daysAgo(age, 15), note: "Cancelled by customer" });
  if (status === "returned") events.push({ status, at: daysAgo(Math.max(age - 6, 0), 14), note: "Returned within 30 days" });
  return events;
}

export const orders: Order[] = Array.from({ length: ORDER_COUNT }, (_, index) => {
  // Spread orders over 60 days, weighted toward the present.
  const age = Math.floor(Math.pow(index / ORDER_COUNT, 1.6) * 60);
  // The demo customer gets a steady share so their account has real history.
  const customer = index % 6 === 1 ? customers[0] : pick(random, customers);
  const status = statusForAge(age);
  const lineCount = 1 + Math.floor(random() * 3);
  const chosen = new Set<(typeof products)[number]>();
  while (chosen.size < lineCount) chosen.add(pick(random, products));

  const lines = [...chosen].map((product) => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    unitPrice: product.price,
    quantity: random() < 0.15 ? 2 : 1,
  }));

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const couponCode = random() < 0.18 ? "WELCOME10" : undefined;
  const discount = couponCode ? round(subtotal * 0.1) : 0;
  const preferred: DeliveryMethod = pick(random, ["standard", "standard", "next-day", "pickup"] as const);
  // Next-day and store pickup only exist within Tamil Nadu.
  const deliveryMethod = customer.addresses[0].state === siteConfig.homeState ? preferred : "standard";
  const shipping = subtotal >= siteConfig.freeDeliveryThreshold ? 0 : deliveryMethods[deliveryMethod].price;
  const total = round(subtotal - discount + shipping);
  const paymentMethod: PaymentMethod = pick(random, ["upi", "upi", "upi", "card", "card", "netbanking", "emi", "cod", "cod"] as const);
  const needsAssignee = ["processing", "packed", "shipped"].includes(status);

  return {
    id: `ord_${String(index + 1).padStart(4, "0")}`,
    number: `OHM-${104900 - index * 7}`,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    placedAt: daysAgo(age, 8 + Math.floor(random() * 12), Math.floor(random() * 60)),
    status,
    paymentMethod,
    paymentStatus:
      status === "returned" || status === "cancelled"
        ? "refunded"
        : paymentMethod === "cod" && status !== "delivered"
          ? "pending"
          : "paid",
    deliveryMethod,
    lines,
    subtotal,
    discount,
    shipping,
    tax: gstIncludedIn(total),
    total,
    couponCode,
    shippingAddress: customer.addresses[0],
    // Every other active order lands on the demo employee so their queue is full.
    assignedToId: needsAssignee
      ? (index % 2 === 0 ? assignableEmployees[1] : pick(random, assignableEmployees)).id
      : undefined,
    timeline: buildTimeline(status, age),
  };
});
