import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { CheckoutTotals } from "@/lib/checkout";
import { formatPrice } from "@/lib/pricing";
import { gstLines } from "@/lib/tax";

function Row({ label, value, tone }: { label: ReactNode; value: string; tone?: "success" }) {
  return (
    <div className={cn("flex justify-between gap-4 text-sm", tone === "success" ? "text-success" : "text-ink-600")}>
      <dt>{label}</dt>
      <dd className={cn("font-medium tabular-nums", tone !== "success" && "text-ink-950")}>{value}</dd>
    </div>
  );
}

interface PriceSummaryProps {
  totals: Pick<CheckoutTotals, "subtotal" | "couponDiscount" | "shipping" | "tax" | "total"> & {
    itemCount?: number;
    productSavings?: number;
  };
  couponCode?: string;
  /** Label for the delivery row. */
  deliveryLabel?: string;
  /** Destination state. When known, GST is split into CGST + SGST or IGST. */
  gstState?: string;
}

/** Cart, checkout and order confirmation all show their totals through this. */
export function PriceSummary({ totals, couponCode, deliveryLabel = "Delivery", gstState }: PriceSummaryProps) {
  const savings = (totals.productSavings ?? 0) + totals.couponDiscount;
  return (
    <dl className="space-y-2">
      <Row
        label={totals.itemCount !== undefined ? `Subtotal (${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"})` : "Subtotal"}
        value={formatPrice(totals.subtotal)}
      />
      {totals.couponDiscount > 0 && (
        <Row label={`Coupon${couponCode ? ` (${couponCode})` : ""}`} value={`−${formatPrice(totals.couponDiscount)}`} tone="success" />
      )}
      <Row label={deliveryLabel} value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)} />
      <div className="flex justify-between gap-4 border-t border-line pt-3 text-ink-950">
        <dt className="text-base font-semibold">Total</dt>
        <dd className="text-xl font-semibold tracking-tight tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
      {gstState ? (
        gstLines(totals.tax, gstState).map((line) => (
          <p key={line.label} className="flex justify-between text-[0.8125rem] text-ink-500">
            <span>Includes {line.label}</span>
            <span className="tabular-nums">{formatPrice(line.amount)}</span>
          </p>
        ))
      ) : (
        <p className="text-[0.8125rem] text-ink-500">Inclusive of all taxes ({formatPrice(totals.tax)} GST)</p>
      )}
      {savings > 0 && (
        <p className="rounded-lg bg-success-soft px-3 py-2 text-[0.8125rem] font-medium text-success">
          You&apos;re saving {formatPrice(savings)} on this order
        </p>
      )}
    </dl>
  );
}
