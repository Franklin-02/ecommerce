import type {
  CampaignStatus,
  DeliveryMethod,
  InventoryItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  StockState,
} from "@/types/commerce";

export type StatusTone = "neutral" | "info" | "progress" | "success" | "warning" | "danger";

export const orderStatusMeta: Record<OrderStatus, { label: string; tone: StatusTone }> = {
  pending: { label: "Pending", tone: "warning" },
  processing: { label: "Processing", tone: "info" },
  packed: { label: "Packed", tone: "progress" },
  shipped: { label: "Shipped", tone: "progress" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  returned: { label: "Returned", tone: "danger" },
};

/** The forward path an order moves through. */
export const orderFlow: OrderStatus[] = ["pending", "processing", "packed", "shipped", "delivered"];

export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  const index = orderFlow.indexOf(status);
  return index === -1 || index === orderFlow.length - 1 ? null : orderFlow[index + 1];
}

export const paymentStatusMeta: Record<PaymentStatus, { label: string; tone: StatusTone }> = {
  paid: { label: "Paid", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  refunded: { label: "Refunded", tone: "neutral" },
};

export const campaignStatusMeta: Record<CampaignStatus, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  scheduled: { label: "Scheduled", tone: "info" },
  paused: { label: "Paused", tone: "warning" },
  expired: { label: "Expired", tone: "neutral" },
};

export const stockStateMeta: Record<StockState, { label: string; tone: StatusTone }> = {
  "in-stock": { label: "In stock", tone: "success" },
  low: { label: "Low stock", tone: "warning" },
  out: { label: "Out of stock", tone: "danger" },
};

export function stockState(item: Pick<InventoryItem, "onHand" | "reorderPoint">): StockState {
  if (item.onHand === 0) return "out";
  return item.onHand <= item.reorderPoint ? "low" : "in-stock";
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Credit or debit card",
  netbanking: "Net banking",
  emi: "No-cost EMI",
  cod: "Cash on delivery",
};

export const deliveryMethods: Record<DeliveryMethod, { label: string; detail: string; eta: string; price: number }> = {
  standard: { label: "Standard delivery", detail: "3–5 business days, across India", eta: "Arrives in 3–5 business days.", price: 49 },
  "next-day": { label: "Next-day delivery", detail: "Tamil Nadu only, order by 8pm", eta: "Arrives tomorrow.", price: 99 },
  pickup: { label: "Store pickup", detail: "Ready in 2 hours", eta: "Ready within 2 hours at Kanishka T. Nagar.", price: 0 },
};
